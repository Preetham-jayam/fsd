const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema(
  {
    FullName: {
      type: String,
      required: true,
    },
    InstName: {
      type: String,
      required: true,
    },
    phoneNo: {
      type: String,
      required: true,
    },
    courses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
    flag: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Teacher = mongoose.model("Teacher", teacherSchema);

module.exports = Teacher;
