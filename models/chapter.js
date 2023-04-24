const mongoose = require("mongoose");

const chapterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
  },
  lessons: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lesson",
    },
  ],
});

const Chapter = mongoose.model("Chapter", chapterSchema);

module.exports = Chapter;
