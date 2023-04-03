const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  questions: [{
    question: {
      type: String,
      required: true
    },
    options: [{
      type: String,
      required: true
    }],
    answer: {
      type: String,
      required: true
    }
  }],
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }
});

const Quiz = mongoose.model('Quiz', quizSchema);

module.exports = Quiz;
