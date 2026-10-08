import api from '../../auth/services/auth.api';

export async function generateTest({ topics, timeLimitMinutes, questionCount, difficulty }) {
    try {
        const response = await api.post('/api/test/generate', {
            topics,
            timeLimitMinutes,
            questionCount,
            difficulty
        });
        return response.data;
    } catch (err) {
        throw new Error(err.response?.data?.message || 'Failed to generate test');
    }
}

export async function submitTest({ testId, userAnswers, timeTakenSeconds }) {
    try {
        const response = await api.post('/api/test/submit', {
            testId,
            userAnswers,
            timeTakenSeconds
        });
        return response.data;
    } catch (err) {
        throw new Error(err.response?.data?.message || 'Failed to submit test');
    }
}

export async function saveQuestion({ questionText, options = [], correctOption }) {
    try {
        const response = await api.post('/api/test/save', {
            questionText,
            options,
            correctOption
        });
        return response.data;
    } catch (err) {
        throw new Error(err.response?.data?.message || 'Failed to save question');
    }
}

export async function getTestHistory() {
    try {
        const response = await api.get('/api/test/history');
        return response.data;
    } catch (err) {
        throw new Error(err.response?.data?.message || 'Failed to fetch test history');
    }
}

export async function getSavedQuestions() {
    try {
        const response = await api.get('/api/test/saved');
        return response.data;
    } catch (err) {
        throw new Error(err.response?.data?.message || 'Failed to fetch saved questions');
    }
}

export async function getProfileStats() {
    try {
        const response = await api.get('/api/test/profile');
        return response.data;
    } catch (err) {
        throw new Error(err.response?.data?.message || 'Failed to fetch profile stats');
    }
}
