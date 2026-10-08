const { GoogleGenerativeAI } = require('@google/generative-ai');

// Array of active Gemini models with fallback in case of rate limit/spikes
const PREFERRED_MODELS = [
  'gemini-3.5-flash-lite',
  'gemini-3.8-flash', 
  'gemini-3.1-pro-preview'
];

function getGenAI() {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENAI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is not set.');
  }
  return new GoogleGenerativeAI(apiKey);
}

/**
 * Helper to call Gemini models with fallback
 */
async function generateWithFallback(prompt, generationConfig = {}) {
  const genAI = getGenAI();
  let lastError = null;

  for (const modelName of PREFERRED_MODELS) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig
      });
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (err) {
      console.warn(`Gemini model ${modelName} failed (${err.message}). Trying fallback...`);
      lastError = err;
    }
  }

  throw lastError || new Error('All Gemini fallback models failed.');
}

/**
 * Analyze performance for completed test sessions
 */
exports.analyzeTestPerformance = async (reviewData) => {
  try {
    const prompt = `
      You are an expert Aptitude Tutor. Analyze the user's test attempt and provide:
      1. Quick summary of performance.
      2. Step-by-step logic and mental shortcuts for questions they got incorrect or skipped.

      User Attempts Data:
      ${JSON.stringify(reviewData, null, 2)}
    `;

    return await generateWithFallback(prompt);
  } catch (err) {
    console.error('LLM Performance Analysis Error:', err.message || err);
    throw new Error('Failed to analyze test performance via LLM.');
  }
};

/**
 * Generate full-length dynamic multi-topic questions
 */
exports.generateMultiTopicQuestions = async (
  topics = ['Quantitative Aptitude', 'Logical Reasoning', 'Verbal Ability'],
  totalQuestions = 15,
  difficulty = 'medium'
) => {
  try {
    const prompt = `
    You are an expert aptitude test evaluator.
    Generate a full-length mock test with EXACTLY ${totalQuestions} questions evenly distributed across these topics: ${topics.join(', ')}.
    Difficulty Level: ${difficulty}.

    Return ONLY a raw valid JSON array of objects (no markdown blocks, no extra text) strictly matching this schema:
    [
      {
        "id": "q1",
        "topic": "Quantitative Aptitude",
        "subTopic": "Time & Work",
        "questionText": "If 10 men can complete a job in 12 days...",
        "options": [
          "8 days",
          "10 days",
          "12 days",
          "15 days"
        ],
        "correctAnswer": "8 days",
        "explanation": "Step 1: Calculate total man-days..."
      }
    ]
    `;

    const rawText = await generateWithFallback(prompt, {
      responseMimeType: 'application/json'
    });

    // Clean up potential markdown formatting block wrappers
    const cleanedText = rawText.replace(/```json|```/g, '').trim();
    const questions = JSON.parse(cleanedText);

    return questions;
  } catch (error) {
    console.error('LLM Generation Error:', error.message || error);
    throw new Error('Failed to generate multi-topic test via LLM.');
  }
};