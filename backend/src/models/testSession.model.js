const mongoose = require('mongoose');

const testSessionSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  topic: { 
    type: String, 
    required: true 
  },
  totalQuestions: { 
    type: Number, 
    required: true 
  },
  score: { 
    type: Number, 
    required: true 
  },
  timeTakenSeconds: { 
    type: Number, 
    required: true 
  },
  completedAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('TestSession', testSessionSchema);