const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  number: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  videoUrl: {
    type: String,
    required: true
  },
  chapter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chapter'
  }
});

const Lesson = mongoose.model('Lesson', lessonSchema);

module.exports = Lesson;
