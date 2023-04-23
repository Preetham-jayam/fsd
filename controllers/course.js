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
exports.getCourses = (req, res, next) => {
  const sort = req.query.sort;
  let promise;
  if (sort === "price:asc") {
    promise = Course.find().populate("teacher").sort({ price: 1 }).exec();
  } else if (sort === "price:desc") {
    promise = Course.find().populate("teacher").sort({ price: -1 }).exec();
  } else if (sort == "title:asc") {
    promise = Course.find().populate("teacher").sort({ title: "asc" }).exec();
  } else {
    promise = Course.find().populate("teacher").exec();
  }

  promise
    .then((courses) => {
      res.render("teacher/courses", { courses: courses });
    })
    .catch((error) => {
      next(error);
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
      { name: { $regex: exp } },
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

exports.enrolledcourse = (req, res) => {
  const { studentId, courseId } = req.body;
  Student.findById(studentId, (err, student) => {
    if (err || !student) {
      console.error(`Error finding student`);
      return;
    }
    const course = req.course;
    if (student.courses.includes(courseId)) {
      console.log("Student is already enrolled in course");
      return;
    }
    student.courses.push(courseId);
    course.students.push(student);
    student.save((err) => {
      if (err) {
        console.error(`Error saving student`);
        return;
      }
      course.save((err) => {
        if (err) {
          console.error(`Error saving course`);
        }
        console.log(`Student  has been enrolled in course ${course.title}`);
      });
    });
  });
};

exports.getCheckoutPage = (req, res) => {
  res.render("checkout");
};
