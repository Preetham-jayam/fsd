const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  number: {
    type: Number
  },
  title: {
    type: String
  },
  description: {
    type: String
  },
  videoUrl: {
    type: String
  },
  chapter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chapter'
  }
});

const Lesson = mongoose.model('Lesson', lessonSchema);

module.exports = Lesson;
