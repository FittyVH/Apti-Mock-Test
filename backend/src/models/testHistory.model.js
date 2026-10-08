const mongoose = require('mongoose');

const testHistorySchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    score: {
        type: String,
        required: true
    },
    llmFeedback: {
        type: String,
        required: true
    }
})

const testHistoryModel = mongoose.model('testHistory', testHistorySchema)

module.exports = testHistoryModel