const Course = require("../models/course");
const Teacher = require("../models/teacher");
const User = require("../models/user");
const Student = require("../models/student");
const review = require("../models/review");

exports.getcoursebyId = (req, res, next) => {
  const courseId = req.params.cid;
  Course.findById(courseId)
    .populate("teacher")
    .populate("students")
    .populate("chapters")
    .exec()
    .then((course) => {
      if (!course) {
        console.log("Course not found");
        return;
      }
      req.course = course;
      next();
    })
    .catch((err) => {
      console.log(err.message);
      next(err);
    });
};

exports.getAllCourses = (req, res) => {
  Course.find({})
    .populate("teacher")
    .then((courses) => {
      res.render("teacher/courses", { courses: courses });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getSingleCourse = (req, res) => {
  const id = req.params.cid;
  Course.findById(id)
    .populate("teacher")
    .populate({
      path: "chapters",
      populate: {
        path: "lessons",
        model: "Lesson",
      },
    })
    .then((course) => {
      review
        .find({ course: id })
        .populate("student")
        .then((reviews) => {
          const chapters = course.chapters || [];
          const lessons = chapters.reduce(
            (acc, chapter) => acc.concat(chapter.lessons),
            []
          );
          res.render("coursedetail", {
            data: course,
            teacher: course.teacher,
            chapters: chapters,
            lessons: lessons,
            reviews: reviews,
          });
        });
    })
    .catch((err) => console.log(err));
};

exports.SearchCourse = (req, res) => {
  const word = req.body;
  const exp = new RegExp(word.sname, "i");
  const price = parseInt(word.sname);
  Course.find({
    $or: [
      { title: { $regex: exp } },
      { price: !isNaN(price) ? price : 0 },
    ],
  })
    .populate("teacher")
    .then((courses) => {
      res.render("teacher/courses", { courses: courses });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getCourses = (req, res, next) => {
  const sort = req.query.sort;
  let courses;
  if (sort === "price:asc") {
    courses = Course.find().populate("teacher").sort({ price: 1 }).exec();
  } else if (sort === "price:desc") {
    courses = Course.find().populate("teacher").sort({ price: -1 }).exec();
  } else if (sort == "title:asc") {
    courses = Course.find().populate("teacher").sort({ title: "asc" }).exec();
  } else {
    courses = Course.find().populate("teacher").exec();
  }

  courses
    .then((courses) => {
      res.render("teacher/courses", { courses: courses });
    })
    .catch((error) => {
      next(error);
    });
};


