const studentModel = require("../models/student");
const courseModel = require("../models/course");
const teacherModel = require("../models/teacher");
const Chapter = require("../models/chapter");
const Lesson = require("../models/lesson");
const User = require("../models/user");
const bcrypt = require("bcryptjs");

exports.getDashboard = (req, res) => {
  User.findOne({ role: 2 })
    .populate("teacher")
    .then((admin) => {
      res.render("admin/admindb", { title: "Admin Dashboard", admin: admin });
    });
};

exports.postProfileEdit = (req, res) => {
  const name = req.body.FullName;
  const phno = req.body.Phno;
  const email = req.body.email;
  const pwd = req.body.password;
  const id = req.params.id;

  User.findOne({ role: 2 })
    .then((admin) => {
      return bcrypt.hash(pwd, 12).then((hashespwd) => {
        admin.email = email;
        admin.password = hashespwd;
        return admin.save();
      });
    })
    .catch((err) => console.log(err));
  teacherModel
    .findById(id)
    .then((admin) => {
      admin.FullName = name;
      admin.phoneNo = phno;
      return admin.save();
    })
    .then(() => {
      res.redirect("/admin/admindb");
    })
    .catch((err) => console.log(err));
};

exports.getAllStudents = (req, res) => {
  User.find({ role: 0 })
    .populate({
      path: "student",
      populate: {
        path: "courses",
        model: "Course",
      },
    })
    .then((result) => {
      res.render("admin/tstudents", { title: "All Students", users: result });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getAllTeachers = (req, res) => {
  User.find({ role: 1 })
    .populate({
      path: "teacher",
      populate: {
        path: "courses",
        model: "Course",
      },
    })
    .then((users) => {
      res.render("admin/tteachers", {
        title: "All Teachers",
        users: users,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.pendingTeachers = (req, res) => {
  User.find({ role: 1 })
    .populate({
      path: "teacher",
      populate: {
        path: "courses",
        model: "Course",
      },
    })
    .then((users) => {
      res.render("admin/pendingteacher", {
        title: "Pending Teachers",
        users: users,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.acceptTeacher = (req, res) => {
  const id = req.params.id;
  teacherModel
    .findById(id)
    .then((teacher) => {
      teacher.flag = 1;
      return teacher.save();
    })
    .then(() => {
      req.flash("The teacher is accepted");
      res.redirect("/admin/all/teachers");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getAllCourses = (req, res) => {
  courseModel
    .find({})
    .populate("teacher")
    .populate("students")
    .then((courses) => {
      res.render("admin/tcourses", { title: "All Courses", courses: courses });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.BlockUser = (req, res) => {
  const userId = req.params.id;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new Error("User not found.");
      }
      user.flag = user.flag === 1 ? 0 : 1;
      return user.save();
    })
    .then((updatedUser) => {
      if (updatedUser.flag === 1) {
        console.log("User blocked successfully.");
      } else {
        console.log("User unblocked successfully.");
      }
      if (updatedUser.role == 0) {
        res.redirect("/admin/all/students");
      } else {
        res.redirect("/admin/all/teachers");
      }
    })
    .catch((err) => {
      console.error(err);
    });
};

exports.DeleteUser = (req, res) => {
  const id = req.params.uid;
  console.log(id);
  User.findByIdAndDelete(id).then((user) => {
    if (user.role == 0) {
      studentModel
        .findByIdAndDelete(user.student)
        .then((user) => {
          if (!user) {
            console.log("User Not Found");
          }
          console.log("User deleted successfully");
          res.redirect("/admindb/all/students");
        })
        .catch((err) => {
          console.log(err);
          console.log("Internal server error");
        });
    } else if (user.role == 1) {
      teacherModel
        .findByIdAndDelete(user.teacher)
        .then((user) => {
          if (!user) {
            console.log("User Not Found");
          }
          console.log("User Teacher deleted successfully");
          res.redirect("/admin/all/teachers");
        })
        .catch((err) => {
          console.log(err);
          console.log("Internal server error");
        });
    }
  });
};

exports.searchAdmin = (req, res) => {
  const search = req.body;
  const regex = new RegExp(search.searchValue, "i");
  User.find({ email: { $regex: regex } })
    .populate({
      path: "student",
      populate: {
        path: "courses",
        model: "Course",
      },
    })
    .populate({
      path: "teacher",
      populate: {
        path: "courses",
        model: "Course",
      },
    })
    .then((users) => {
      console.log(users);
      return res.render("admin/adminresults", {
        title: "Search",
        users: users,
      });
    });
};

exports.getSingleCourse = (req, res, next) => {
  const id = req.params.id;

  courseModel
    .findById(id)
    .populate("teacher")
    .populate({
      path: "chapters",
      populate: {
        path: "lessons",
        model: "Lesson",
      },
    })
    .then((course) => {
      const chapters = course.chapters || [];
      const lessons = chapters.reduce(
        (acc, chapter) => acc.concat(chapter.lessons),
        []
      );

      res.render("admin/admincoursedetail", {
        data: course,
        chapters: chapters,
        teacher: course.teacher,
        lessons: lessons,
      });
    })
    .catch((err) => console.log(err));
};
