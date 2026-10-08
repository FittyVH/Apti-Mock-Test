const express = require('express');
const router = express.Router();
const { generateTest, submitAndAnalyze, saveQuestion, getTestHistory, getSavedQuestions, getProfileStats } = require('../controllers/test.controller');
const authMiddleware = require("../middlewares/auth.middleware")

router.post('/generate', authMiddleware.authUser, generateTest);
router.post('/submit', authMiddleware.authUser, submitAndAnalyze);
router.post('/save', authMiddleware.authUser, saveQuestion);

router.get('/history', authMiddleware.authUser, getTestHistory);
router.get('/saved', authMiddleware.authUser, getSavedQuestions);
router.get('/profile', authMiddleware.authUser, getProfileStats);

module.exports = router;