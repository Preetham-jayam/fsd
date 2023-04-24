const Student = require("../models/student");
const Course = require("../models/course");
const Teacher = require("../models/teacher");
const User = require("../models/user");
const Quiz = require("../models/quiz");
const Review = require("../models/review");
const review = require("../models/review");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const ObjectId = new mongoose.Types.ObjectId();
exports.getIndex = (req, res) => {
  Course.find({})
    .populate("teacher")
    .then((courses) => {
      res.render("index", { courses: courses });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getAboutpage = (req, res) => {
  res.render("about");
};

exports.getContactPage = (req, res) => {
  res.render("contact");
};

exports.getHelpPage = (req, res) => {
  res.render("help");
};

exports.getHomepage = (req, res, next) => {
  Student.findById(req.session.user.student)
    .populate({
      path: "courses",
      populate: {
        path: "teacher",
        model: "Teacher",
      },
    })
    .then((result) => {
      Course.find({})
        .populate("teacher")
        .then((courses) => {
          res.render("student/shome", {
            user: req.session.user,
            student: result,
            courses: courses,
            scourses: result.courses,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    });
};

exports.getPaymentpage = (req, res) => {
  const id = req.params.id;
  const sid = req.params.sid;
  Course.findById(id)
    .populate("teacher")
    .then((course) => {
      res.render("payment", { course: course, sid: sid });
    });
};

exports.enrolledcourse = (req, res) => {
  const { studentId, courseId } = req.body;

  Student.findById(studentId)
    .then((student) => {
      if (!student) {
        console.log(`Student not found`);
      }
      return Course.findById(courseId).populate("students");
    })
    .then((course) => {
      if (!course) {
        console.log(`Course not found`);
      }
      if (
        course.students.some((student) => student._id.toString() === studentId)
      ) {
        console.log("Student is already enrolled in course");
        res.redirect(`/student/courseContent/${courseId}`);
        return;
      }
      return Promise.all([
        Student.findByIdAndUpdate(studentId, { $push: { courses: courseId } }),
        Course.findByIdAndUpdate(courseId, { $push: { students: studentId } }),
      ]);
    })
    .then(() => {
      console.log(`Student has been enrolled in course`);
      res.redirect(`/student/courseContent/${courseId}`);
    })
    .catch((err) => {
      console.error(`Error enrolling student in course: ${err.message}`);
    });
};

exports.getCourseDetails = (req, res) => {
  const id = req.params.id;
  Student.findById(req.session.user.student).then((result) => {
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
        Review.find({ course: id })
          .populate("student")
          .then((reviews) => {
            const chapters = course.chapters || [];
            const lessons = chapters.reduce(
              (acc, chapter) => acc.concat(chapter.lessons),
              []
            );
            res.render("student/courseDetails", {
              data: course,
              teacher: course.teacher,
              student: result,
              chapters: chapters,
              lessons: lessons,
              reviews: reviews,
            });
          });
      })
      .catch((err) => console.log(err));
  });
};

exports.getProfile = (req, res, next) => {
  User.findById(req.session.user)
    .populate("student")
    .then((user) => {
      res.render("student/sprofile", { user: user, student: user.student });
    })

    .catch((err) => console.log(err));
};

exports.postProfileEdit = (req, res) => {
  const fname = req.body.fname;
  const lname = req.body.lname;
  const phno = req.body.phno;
  const address = req.body.address;
  const image = req.file;
  const imageurl = image.path;
  Student.findById(req.body.sid)
    .then((student) => {
      student.firstName = fname;
      student.lastName = lname;
      student.phoneNo = phno;
      student.address = address;
      student.Imageurl = imageurl;
      return student.save();
    })
    .then(() => {
      console.log("Student Detail Updated");
      res.redirect("/student/profile");
    })
    .catch((err) => console.log(err));
};

exports.getPasswordEdit = (req, res) => {
  User.findById(req.session.user)
    .populate("student")
    .then((student) => {
      res.render("student/saccount", {
        user: student,
        student: student.student,
      });
    });
};
exports.postPasswordedit = (req, res) => {
  const currentPassword = req.body.CurrentPassword;
  const newPassword = req.body.NewPassword;
  const retypeNewPassword = req.body.RetypeNewPassword;
  const userid = req.body.userId;
  const email = req.body.mail;
  User.findById(userid)
    .then((user) => {
      bcrypt.compare(currentPassword, user.password, function (err, result) {
        if (err) {
          console.log(err);
        }
        if (!result) {
          req.flash("error", "Current Password Incorrect");
          console.log("Current password is incorrect");
        }

        return bcrypt.hash(newPassword, 12).then((hashespwd) => {
          user.email = email;
          user.password = hashespwd;
          user.save().then((err) => {
            if (err) {
              console.log(err);
            }
            console.log("Password updated successfully");
          });
          req.flash("success", "Password Updated");
          res.redirect("/student/account");
        });
      });
    })
    .catch((err) => console.log(err));
};

exports.myLearning = (req, res) => {
  User.findById(req.session.user)
    .populate({
      path: "student",
      populate: {
        path: "courses",
        model: "Course",
      },
    })
    .then((user) => {
      res.render("student/scourselist", {
        user: user,
        student: user.student,
        courses: user.student.courses,
      });
    });
};

exports.getCourseContent = (req, res) => {
  const id = req.params.id;
  Student.findById(req.session.user.student).then((result) => {
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
        Review.find({ course: id })
          .populate("student")
          .then((reviews) => {
            const chapters = course.chapters || [];
            const lessons = chapters.reduce(
              (acc, chapter) => acc.concat(chapter.lessons),
              []
            );
            res.render("teacher/courseContent", {
              user: req.session.user,
              data: course,
              teacher: course.teacher,
              student: result,
              chapters: chapters,
              lessons: lessons,
              reviews: reviews,
            });
          });
      })
      .catch((err) => console.log(err));
  });
};

exports.studentQuiz = (req, res) => {
  const id = req.params.id;
  User.findById(req.session.user)
    .populate("student")
    .then((user) => {
      Course.findById(id)
        .populate("quizzes")
        .then((course) => {
          res.render("student/studentquiz", {
            student: user.student,
            course: course,
            quizzes: course.quizzes,
          });
        });
    });
};

exports.postsubmitQuiz = (req, res) => {
  const studentId = req.session.user.student;
  const quizResult = req.body;
  const quizId = quizResult.quizId;
  const courseId = quizResult.courseId;

  Quiz.findById(quizId)
    .populate("questions")
    .populate("course")
    .then((quiz) => {
      let totalScore = 0;
      let totalMarks = 0;
      const submittedAnswers = {};

      quiz.questions.forEach((question, i) => {
        totalMarks += question.Marks;
        const submittedAnswer = quizResult["question" + (i + 1)];
        const correctAnswer = question.answer;
        if (submittedAnswer == correctAnswer) {
          totalScore += question.Marks;
        }
        submittedAnswers["question" + (i + 1)] = submittedAnswer;
      });

      const percentageScore = Math.round(
        (totalScore / quiz.questions.length) * 100
      );

      const quizResultObject = {
        course: courseId,
        quiz: quizId,
        marks: totalScore,
        totalMarks: totalMarks,
        answers: submittedAnswers,
      };

      Student.findById(studentId)
        .then((student) => {
          student.quizzes.push(quizResultObject);
          return student.save();
        })
        .then(() => {
          return Student.findById(studentId)
            .populate({
              path: "quizzes.quiz",
              populate: {
                path: "course",
              },
            })
            .populate("courses");
        })
        .then((student) => {
          res.render("student/studentResult", {
            student: student,
            course: courseId,
            quiz: quiz,
            totalScore: totalScore,
            totalMarks: totalMarks,
            percentageScore: percentageScore,
            submittedAnswers: submittedAnswers,
          });
        })
        .catch((error) => {
          console.error(error);
          res.status(500).send("An error occurred while saving quiz results.");
        });
    });
};

exports.postAddreview = (req, res) => {
  const { rating, comment, student } = req.body;
  const course = req.params.id;

  const reviews = new review({ course, student, rating, comment });

  reviews
    .save()
    .then(() => {
      req.flash("success", "Review added successfully");
      res.redirect(`/student/courseContent/${course}`);
    })
    .catch((err) => {
      req.flash("error", "Unable to add review");
      res.redirect(`/student/courseContent/${course}`);
    });
};

const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
exports.generateCertificate = (req, res) => {
  const { studentId, courseId } = req.params;
  Student.findById(studentId)
    .then((student) => {
      Course.findById(courseId)
        .populate("teacher")
        .then((course) => {
          const fileName = `${student.firstName}-${course.name}-Certificate.pdf`;
          const filePath = path.join(
            __dirname,
            "..",
            "public",
            "certificates",
            fileName
          );
          fs.access(filePath, fs.constants.F_OK, (err) => {
            if (err) {
              const doc = new PDFDocument({
                size: "A4",
                layout: "landscape",
              });
              doc.info[
                "Title"
              ] = `${student.firstName} - ${course.name} Certificate`;
              doc.info["Author"] = "Eduphoria";

              doc.image(
                "C:/Users/Dell/OneDrive/Desktop/Project/public/Img/certificate-background.png",
                0,
                0,
                { width: 842, height: 595 }
              );

              doc.moveDown();
              doc.moveDown();
              doc.moveDown();
              doc.moveDown();
              doc
                .fontSize(30)
                .strokeColor("black")
                .fillColor("black")
                .text("Certificate of Completion", {
                  align: "center",
                  underline: true,
                  stroke: true,
                  fill: false,
                });
              doc.moveDown();
              doc.moveDown();
              doc.moveDown();
              doc.moveDown();
              doc
                .fontSize(16)
                .text(
                  `This certificate is awarded to ${student.firstName} for successfully completing the course`
                );
              doc.moveDown();
              doc.fontSize(14).text(`Student Name: ${student.firstName}`);
              doc.fontSize(14).text(`Course Title: ${course.title}`);
              doc.fontSize(14).text(`Instructor: ${course.teacher.FullName}`);
              doc
                .fontSize(14)
                .text(`Completion Date: ${new Date().toLocaleDateString()}`);
              doc
                .fontSize(18)
                .text(`-Best Rewards from Eduphoria`, { align: "right" });

              // Write the document to a file
              doc.pipe(fs.createWriteStream(filePath));
              doc.end();
              req.flash("success", "Certificate is generated ");
              res.redirect(`/student/courseContent/${courseId}`);
            } else {
              res.sendFile(filePath);
            }
          });
        })
        .catch((err) => {
          console.error(err);
          console.log("Error generating certificate");
        });
    })
    .catch((err) => {
      console.error(err);
      console.log("Error generating certificate");
    });
};
