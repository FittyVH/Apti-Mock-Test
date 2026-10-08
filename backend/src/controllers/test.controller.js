const { redisClient } = require('../db/redis');
const { generateMultiTopicQuestions, analyzeTestPerformance } = require('../services/llm.service');
const TestSession = require('../models/testSession.model');
const questionModel = require('../models/question.model')
const testHistoryModel = require('../models/testHistory.model')
const userModel = require('../models/user.model')

exports.generateTest = async (req, res) => {
    try {
        const {
            topics = ['Quantitative Aptitude', 'Logical Reasoning', 'Verbal Ability'],
            timeLimitMinutes = 30,
            questionCount = 15,
            difficulty = 'medium'
        } = req.body;

        // Enforce 90-minute ceiling
        if (timeLimitMinutes > 90) {
            return res.status(400).json({
                success: false,
                message: 'Time limit cannot exceed 90 minutes.',
            });
        }

        // 1. Generate multi-topic question suite via LLM
        const rawQuestions = await generateMultiTopicQuestions(topics, questionCount, difficulty);

        // 2. Safe User ID resolution
        const userId = req.user?._id || req.user?.id || req.user?.userId || 'anon';
        const testId = `test:${userId}:${Date.now()}`;

        // 3. Cache full session payload in Redis (including answers and explanations)
        const topicString = Array.isArray(topics) ? topics.join(', ') : String(topics || 'General Aptitude');
        const redisPayload = {
            testId,
            userId,
            topic: topicString,
            topics,
            timeLimitMinutes,
            createdAt: new Date().toISOString(),
            questions: rawQuestions,
        };

        // TTL = Test duration + 15 min buffer
        const ttlInSeconds = (timeLimitMinutes + 15) * 60;

        try {
            await redisClient.set(testId, JSON.stringify(redisPayload), {
                EX: ttlInSeconds,
            });
        } catch (redisErr) {
            console.error('Redis set failed for generateTest:', redisErr.message);
        }

        // 4. Strip `correctAnswer` and `explanation` before returning to frontend, normalizing options to strings
        const sanitizedQuestions = rawQuestions.map(({ correctAnswer, explanation, ...q }) => {
            const rawOpts = q.options || [];
            const normalizedOptions = rawOpts.map((opt) => {
                if (opt && typeof opt === 'object') {
                    return opt.text ? `${opt.key ? opt.key + ': ' : ''}${opt.text}` : (opt.text || opt.value || JSON.stringify(opt));
                }
                return String(opt);
            });
            return {
                ...q,
                options: normalizedOptions
            };
        });

        return res.status(200).json({
            success: true,
            testId,
            timeLimitMinutes,
            topics,
            totalQuestions: sanitizedQuestions.length,
            questions: sanitizedQuestions,
        });
    } catch (error) {
        console.error('Generate Multi-Topic Test Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error generating dynamic test session.',
        });
    }
};

exports.submitAndAnalyze = async (req, res) => {
    try {
        const { testId, userAnswers = {}, timeTakenSeconds = 0 } = req.body;

        // Fetch active session from Redis
        const cachedData = await redisClient.get(testId);
        if (!cachedData) {
            return res.status(404).json({ success: false, message: 'Test session expired or not found.' });
        }

        const cachedTest = JSON.parse(cachedData);
        const originalQuestions = cachedTest.questions;

        let score = 0;
        const reviewData = [];

        for (const q of originalQuestions) {
            let correctOpt = q.correctAnswer || q.correctOption;
            if (correctOpt && typeof correctOpt === 'object') {
                correctOpt = correctOpt.text || correctOpt.key || String(correctOpt);
            }
            let selected = userAnswers[q.id] || null;
            if (selected && typeof selected === 'object') {
                selected = selected.text || selected.key || String(selected);
            }

            const isCorrect = selected === correctOpt;
            if (isCorrect) score++;

            // Clean options for review
            const cleanOptions = (q.options || []).map((opt) => {
                if (opt && typeof opt === 'object') {
                    return opt.text ? `${opt.key ? opt.key + ': ' : ''}${opt.text}` : (opt.text || opt.value || JSON.stringify(opt));
                }
                return String(opt);
            });

            reviewData.push({
                questionId: q.id,
                questionText: q.questionText,
                options: cleanOptions,
                userSelected: selected,
                correctOption: correctOpt,
                isCorrect
            });
        }

        // Generate LLM analysis for missed or completed questions
        const llmFeedback = await analyzeTestPerformance(reviewData);

        // Save metadata ONLY in MongoDB
        const sessionTopic = cachedTest.topic || (Array.isArray(cachedTest.topics) ? cachedTest.topics.join(', ') : 'General Aptitude');
        const sessionUserId = req.user?._id || req.user?.id || req.user?.userId || cachedTest.userId;

        await TestSession.create({
            userId: sessionUserId,
            topic: sessionTopic,
            totalQuestions: originalQuestions.length,
            score,
            timeTakenSeconds
        });
        // save the test scores and feedback
        await testHistoryModel.create({
            userId: req.user.id,
            score: `${score}/${originalQuestions.length}`,
            llmFeedback: llmFeedback
        })

        // Purge session from Redis
        try {
            await redisClient.del(testId);
        } catch (redisErr) {
            console.error('Redis del failed for submitAndAnalyze:', redisErr.message);
        }

        res.status(200).json({
            success: true,
            score,
            totalQuestions: originalQuestions.length,
            reviewData,
            llmFeedback
        });
    } catch (err) {
        console.error(err)
        res.status(500).json({ success: false, error: err.message });
    }
};

exports.saveQuestion = async (req, res) => {
    try {
        // 1. Receive question details directly from frontend request body
        const { questionText, options = [], correctOption } = req.body;
        // 2. Validate input fields
        if (!questionText || !correctOption) {
            return res.status(400).json({
                success: false,
                message: 'questionText and correctOption are required.'
            });
        }
        // 3. Save question directly to MongoDB
        const question = await questionModel.create({
            userId: req.user?._id || req.user?.id,
            questionText,
            options,
            correctOption
        });
        return res.status(201).json({
            success: true,
            message: 'Question saved successfully.',
            question
        });
    } catch (error) {
        console.error('Save Question Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error saving question.',
            error: error.message
        });
    }
};

exports.getTestHistory = async (req, res) => {
    try {
        const userId = req.user?._id || req.user?.id;

        const cacheKey = `history:${userId}`
        const cache = await redisClient.get(cacheKey)

        if(cache) {
            console.log(`cache hit for ${userId}`)
            return res.status(200).json({ success: true, history: JSON.parse(cache)})
        }

        const history = await testHistoryModel.find({ userId }).sort({ _id: -1 });
        await redisClient.set(cacheKey, JSON.stringify(history), { EX: 300})

        return res.status(200).json({ success: true, history });
    } catch (error) {
        console.error('Get Test History Error:', error);
        return res.status(500).json({ success: false, message: 'Failed to fetch test history' });
    }
};

exports.getSavedQuestions = async (req, res) => {
    try {
        const userId = req.user?._id || req.user?.id;

        const cacheKey = `saved:${userId}`
        const cache = await redisClient.get(cacheKey)

        if(cache) {
            console.log(`cache hit for ${userId}`)
            return res.status(200).json({ questions: JSON.parse(cache) })
        }

        const questions = await questionModel.find({ userId }).sort({ _id: -1 });

        await redisClient.set(cacheKey, JSON.stringify(questions), { EX: 300 })
        
        return res.status(200).json({ success: true, questions });
    } catch (error) {
        console.error('Get Saved Questions Error:', error);
        return res.status(500).json({ success: false, message: 'Failed to fetch saved questions' });
    }
};

exports.getProfileStats = async (req, res) => {
    try {
        const userId = req.user?._id || req.user?.id;
        const user = await userModel.findById(userId).select('-password');
        const testCount = await testHistoryModel.countDocuments({ userId });
        return res.status(200).json({
            success: true,
            user: {
                id: user?._id,
                username: user?.username || 'User',
                email: user?.email || '',
                testsTaken: testCount
            }
        });
    } catch (error) {
        console.error('Get Profile Stats Error:', error);
        return res.status(500).json({ success: false, message: 'Failed to fetch profile stats' });
    }
};
