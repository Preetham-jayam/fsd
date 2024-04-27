const bcrypt = require("bcryptjs");
const User = require("../models/user");
const Student = require("../models/student");
const Teacher = require("../models/teacher");
const Admin = require("../models/admin");
exports.getLogin = (req, res) => {
  res.render("login");
};

exports.postLogin = (req, res) => {
  const mail = req.body.email;
  const password = req.body.password;
  if (mail == "admin@gmail.com") {
    Admin.findOne({ email: mail }).then((admin) => {
      bcrypt
        .compare(password, admin.password)
        .then((domatch) => {
          if (domatch) {
            req.session.isLoggedIn = true;
            req.session.user = admin;
            res.redirect("/admin/admindb");
          } else {
            req.flash("error", "Password not matching");
            res.redirect("/login");
          }
        })
        .catch((err) => {
          console.log(err);
          req.flash("error", "Admin not found");
          res.redirect("/login");
        });
    });
  } else {
    User.findOne({ email: mail })
    .then((user) => {
      if (!user) {
        req.flash("error", "User not Found");
        return res.redirect("/login");
      }
      bcrypt
        .compare(password, user.password)
        .then((doMatch) => {
          if (doMatch) {
            if (user.flag === 1) {
              req.flash("error", "You are blocked by admin");
                req.session.save(() => {
                  res.redirect('/login');
                });
                return;
            
            }
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save((err) => {
              if (err) {
                console.log(err);
              }
              if (user.role == 0) {
                res.redirect("/student/shome");
              } else if (user.role == 1) {
                res.redirect("/teacher/home");
              }
            });
          }
          req.flash("error", "Password not matching");
          res.redirect("/login");
        })
        .catch((err) => {
          console.log(err);
          req.flash("error", "User not found");
          res.redirect("/login");
        });
    });
  }
};

exports.getSignUp = (req, res, next) => {
  res.render("student/signup");
};

exports.gettsignup = (req, res, next) => {
  res.render("teacher/tsignup");
};

exports.postSignUp = (req, res, next) => {
  const data = req.body;
  console.log(data);
  const role = data.role;
  const email = data.email;
  const pwd = data.pwd;

  User.findOne({ email: email })
    .then((existingUser) => {
      if (existingUser) {
        req.flash("error", "User with this email already exists. Please enter another email.");
        req.session.save(() => {
          if (existingUser.role == 0) {
            return res.redirect('/signup');
          } else {
            return res.redirect('/tsignup');
          }
        });
        return;
      }
      bcrypt.hash(pwd, 12)
        .then((hashedPwd) => {
          const newUser = new User({
            email: email,
            password: hashedPwd,
            role: role
          });
          if (role == 0) {
            const student = new Student({
              firstName: data.fname,
              lastName: data.lname,
              phoneNo: data.phno,
              address: data.address
            });
            student.save()
              .then((result) => {
                console.log(result);
                newUser.student = result._id;
                newUser.save()
                  .then((userResult) => {
                    console.log(userResult);
                    req.flash("success", "Registration successful. Please login to study.");
                    return res.redirect("/login");
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              })
              .catch((err) => {
                console.log(err);
              });
          } else if (role == 1) {
            const teacher = new Teacher({
              FullName: data.fname,
              InstName: data.instname,
              phoneNo: data.phno
            });
            teacher.save()
              .then((result) => {
                console.log(result);
                newUser.teacher = result._id;
                newUser.save()
                  .then((userResult) => {
                    console.log(userResult);
                    req.flash("success", "Registration successful. Please login to study.");
                    return res.redirect("/login");
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              })
              .catch((err) => {
                console.log(err);
              });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
};
exports.Logout = (req, res) => {
  req.session.destroy((err) => {
    res.redirect("/");
  });
};

