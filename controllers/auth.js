const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Student = require("../models/student");
const Teacher = require("../models/teacher");

exports.getLogin = (req, res) => {
  res.render("login");
};

exports.postLogin = (req, res) => {
  const mail = req.body.email;
  const password = req.body.password;
  User.findOne({ email: mail }).then((user) => {
    if (!user) {
      return res.redirect("/login");
    }
    bcrypt
      .compare(password, user.password)
      .then((doMatch) => {
        if (doMatch) {
          req.session.isLoggedIn = true;
          req.session.user = user;
          console.log(user);
          return req.session.save((err) => {
            if (err) {
              console.log(err);
            }
            res.redirect("/student/shome");
          });
        }
        res.redirect("/");
      })
      .catch((err) => {
        console.log(err);
        res.redirect("/");
      });
  });
};

exports.getSignUp = (req, res, next) => {
  res.render("student/signup");
};

exports.gettsignup = (req, res, next) => {
  res.render("teacher/tsignup");
};

exports.postSignUp = (req, res, next) => {
  const data = req.body;
  const role = data.role;
  const email = data.email;
  const pwd = data.pwd;
  const user = new User();

  User.findOne({ email: email })
    .then((userDoc) => {
      if (userDoc) {
        res.redirect("/signup");
      }
      return bcrypt
        .hash(pwd, 12)
        .then((hashedPwd) => {
          user.email = data.email;
          user.password = hashedPwd;
          user.role = role;
          if (role == 0) {
            const student = new Student();
            student.firstName = data.fname;
            student.lastName = data.lname;
            student.phoneNo = data.phno;
            student.address = data.address;
            student
              .save()
              .then((result) => {
                console.log(result);
              })
              .catch((err) => {
                console.log(err);
              });
            user.student = student;
          } else if (role == 1) {
            const teacher = new Teacher();
            teacher.FullName = data.fname;
            teacher.InstName = data.instname;
            teacher.phoneNo = data.phno;
            teacher
              .save()
              .then((result) => {
                console.log(result);
              })
              .catch((err) => {
                console.log(err);
              });

            user.teacher = teacher;
          }
          return user.save();
        })
        .then((result) => {
          console.log(result);
          return res.redirect("/login");
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.Logout = (req, res) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};