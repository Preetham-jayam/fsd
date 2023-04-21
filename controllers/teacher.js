const Course = require("../models/course");
const Teacher = require("../models/teacher");
const User = require("../models/user");
const Chapter = require("../models/chapter");
const Lesson = require("../models/lesson");
const Quiz = require("../models/quiz");
const bcrypt = require("bcryptjs");
const path = require("path");

exports.getAddCourse = (req, res) => {
  Teacher.findById(req.session.user.teacher).then((result) => {
    res.render("teacher/add-course", {
      user: req.session.user,
      teacher: result,
    });
  });
};

exports.postAddCourse = (req, res, next) => {
  const title = req.body.title;
  const courseName = req.body.nameCourse;
  const description = req.body.Description;
  const cost = req.body.Price;
  const image = req.file;
  const imageUrl = image.path;
  const teacher = req.body.Id;

  const course = new Course({
    title: title,
    name: courseName,
    description: description,
    price: cost,
    Imageurl: imageUrl,
    teacher: teacher,
  });

  course
    .save()
    .then((result) => {
      console.log("Course created");
      return Teacher.findById(req.body.Id).exec();
    })
    .then((teacher) => {
      teacher.courses.push(course._id);
      return teacher.save();
    })
    .then(() => {
      return User.findById(req.body.Id).populate("teacher").exec();
    })
    .then((user) => {
      return res.redirect("/teacher/home");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getHomepage = (req, res, next) => {
  Teacher.findById(req.session.user.teacher)
    .populate("courses")
    .then((result) => {
      res.render("teacher/teacher-home", {
        user: req.session.user,
        teacher: result,
        courses: result.courses,
      });
    })
    .catch((err) => console.log(err));
};

exports.getSingleCourse = (req, res, next) => {
  const id = req.params.cid;
  Teacher.findById(req.session.user.teacher).then((teacher) => {
    Course.findById(id)
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
        console.log(course.chapters);
        res.render("teacher/coursedetail", {
          data: course,
          chapters: chapters,
          teacher: teacher,
          lessons: lessons,
        });
      })
      .catch((err) => console.log(err));
  });
};

exports.upload = (req, res, next) => {
  const id = req.params.cid;
  Teacher.findById(req.session.user.teacher).then((teacher) => {
    Course.findById(id)
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
        console.log(course.chapters);
        res.render("teacher/courseupload", {
          data: course,
          chapters: chapters,
          teacher: teacher,
          lessons: lessons,
        });
      })
      .catch((err) => console.log(err));
  });
};

exports.postUpload = (req, res) => {
  const courseId = req.params.cid;
  var chapterId = req.body.chapter;
  var lessonId = req.body.lesson;
  var newChapterName = req.body.newNameChapter;
  var newLessonName = req.body.newNameLesson;
  if (chapterId === "new") {
    const newChapter = new Chapter({
      name: newChapterName,
      course: courseId,
      lessons: [],
    });
    Course.findById(courseId).then((course) => {
      course.chapters.push(newChapter);
      return course.save();
    });

    newChapter
      .save()
      .then((chapter) => {
        chapterId = chapter._id;

        // Handle new lesson creation
        if (lessonId === "new") {
          const newLesson = new Lesson({
            title: newLessonName,
            chapter: chapterId,
            videoUrl: req.file.path,
          });

          newLesson
            .save()
            .then((lesson) => {
              // Add lesson to chapter and save chapter
              chapter.lessons.push(lesson._id);
              chapter
                .save()
                .then(() => {
                  res.redirect(`/teacher/courseDetails/${courseId}`);
                })
                .catch((error) => {
                  console.log(error);
                });
            })
            .catch((error) => {
              console.log(error);
            });
        } else {
          // Handle existing lesson update
          Lesson.findByIdAndUpdate(lessonId, {
            $set: { videoUrl: req.file.path },
          })
            .then(() => {
              res.redirect(`/teacher/courseDetails/${courseId}`);
            })
            .catch((error) => {
              console.log(error);
            });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  } else {
    // Handle existing chapter update
    Chapter.findByIdAndUpdate(chapterId)
      .then((chapter) => {
        if (lessonId === "new") {
          // Handle new lesson creation
          const newLesson = new Lesson({
            title: newLessonName,
            chapter: chapterId,
            videoUrl: req.file.path,
          });

          newLesson
            .save()
            .then((lesson) => {
              // Add lesson to chapter and save chapter
              chapter.lessons.push(lesson._id);
              chapter
                .save()
                .then(() => {
                  res.redirect(`/teacher/courseDetails/${courseId}`);
                })
                .catch((error) => {
                  console.log(error);
                });
            })
            .catch((error) => {
              console.log(error);
            });
        } else {
          // Handle existing lesson update
          Lesson.findByIdAndUpdate(lessonId, {
            $set: { videoUrl: req.file.path },
          })
            .then(() => {
              res.redirect(`/teacher/courseDetails/${courseId}`);
            })
            .catch((error) => {
              console.log(error);
            });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
};

exports.getCourseEdit = (req, res, next) => {
  const course = req.course;
  res.render("teacher/course-edit", {
    course: course,
    teacher: course.teacher,
  });
};

exports.postEditCourse = (req, res, next) => {
  const id = req.params.cid;
  const newtitle = req.body.title;
  const newname = req.body.nameCourse;
  const description = req.body.Description;
  const price = req.body.Price;
  const Image = req.file;
  const imageUrl = Image.path;

  Course.findById(id)
    .then((course) => {
      course.title = newtitle;
      course.name = newname;
      course.cost = price;
      course.description = description;
      course.Imageurl = imageUrl;
      return course.save();
    })
    .then((course) => {
      console.log("Course Updated");
      res.redirect(`/teacher/courseDetails/${course._id}`);
    })
    .catch((err) => console.log(err));
};

exports.getProfileEdit = (req, res) => {
  Teacher.findById(req.session.user.teacher)
    .then((result) => {
      res.render("teacher/teacher-profile", {
        user: req.session.user,
        teacher: result,
      });
    })
    .catch((err) => console.log(err));
};

exports.postProfileEdit = (req, res) => {
  const id = req.session.user.teacher;
  const name = req.body.FullName;
  const Instname = req.body.Instname;
  const email = req.body.email;
  const userid = req.body.userId;
  User.findById(userid)
    .then((user) => {
      user.email = email;
      return user.save();
    })
    .catch((err) => console.log(err));

  Teacher.findById(id)
    .then((teacher) => {
      teacher.FullName = name;
      teacher.InstName = Instname;
      return teacher.save();
    })
    .then((teacher) => {
      console.log("Teacher Details Updated");
      res.redirect("/teacher/profile");
    })
    .catch((err) => console.log(err));
};

exports.getPasswordEdit = (req, res) => {
  Teacher.findById(req.session.user.teacher)
    .then((result) => {
      res.render("teacher/edit-password", {
        user: req.session.user,
        teacher: result,
      });
    })
    .catch((err) => console.log(err));
};

exports.postPasswordedit = (req, res) => {
  const currentPassword = req.body.CurrentPassword;
  const newPassword = req.body.NewPassword;
  const retypeNewPassword = req.body.RetypeNewPassword;
  const userid = req.body.userId;
  User.findById(userid)
    .then((user) => {
      bcrypt.compare(currentPassword, user.password, function (err, result) {
        if (err) {
          console.log(err);
        }
        if (!result) {
          console.log("Current password is incorrect");
        }

        return bcrypt.hash(newPassword, 12).then((hashespwd) => {
          user.password = hashespwd;
          user.save().then((err) => {
            if (err) {
              console.log(err);
            }
            console.log("Password updated successfully");
          });
          res.redirect("/teacher/profile");
        });
      });
    })
    .catch((err) => console.log(err));
};

exports.getQuizPage = (req, res, next) => {
  const course = req.course;
  res.render("teacher/teacher-quiz", { course: course });
};

exports.PostaddQuestion = (req, res) => {
  Quiz.findOne({ course: req.body.IdCourse })
    .then((quiz) => {
      if (quiz) {
        const newQuestion = {
          question: req.body.question,
          options: [
            req.body.option1,
            req.body.option2,
            req.body.option3,
            req.body.option4,
          ],
          answer: req.body.answer,
          Marks: req.body.marks,
        };
        quiz.questions.push(newQuestion);
        quiz
          .save()
          .then(() => {
            console.log(quiz);
            res.redirect("/teacher/quiz/" + req.body.IdCourse);
          })
          .catch((err) => {
            console.log(err);
            res.redirect("/teacher/courseDetails/" + req.body.IdCourse);
          });
      } else {
        const quiz = new Quiz({
          title: req.body.title,
          questions: [
            {
              question: req.body.question,
              options: [
                req.body.option1,
                req.body.option2,
                req.body.option3,
                req.body.option4,
              ],
              answer: req.body.answer,
              Marks: req.body.marks,
            },
          ],
          course: req.body.IdCourse,
        });
        console.log(quiz.questions.answer)
        quiz
          .save()
          .then((quiz) => {
            Course.findById(req.body.IdCourse)
              .then((course) => {
                course.quizzes.push(quiz._id);
                course
                  .save()
                  .then(() => {
                    console.log(quiz);
                    res.redirect("/teacher/quiz/" + req.body.IdCourse);
                  })
                  .catch((err) => {
                    console.log(err);
                    res.redirect("/teacher/courseDetails/" + req.body.IdCourse);
                  });
              })
              .catch((err) => {
                console.log(err);
                res.redirect("/teacher/courseDetails/" + req.body.IdCourse);
              });
          })
          .catch((err) => {
            console.log(err);
            res.redirect("/teacher/courseDetails/" + req.body.IdCourse);
          });
      }
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/teacher/courseDetails/" + req.body.IdCourse);
    });
};
