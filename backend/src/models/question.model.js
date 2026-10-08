const mongoose = require('mongoose')

const questionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    questionText: {
        type: String,
        required: true
    },
    options: {
        type: [String],
        default: []
    },
    correctOption: {
        type: String,
        required: true
    }
})

const questionModel = mongoose.model('question', questionSchema)

module.exports = questionModel