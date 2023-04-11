const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const multer = require("multer");
const MongoDbStore = require("connect-mongodb-session")(session);
const User = require("./models/user");
const MONGODB_URI =
  "mongodb+srv://nagapreethamj21:preetham@cluster0.jhy2xxy.mongodb.net/Learning";
// const fileStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "images");
//   },
//   filename: (req, file, cb) => {
//     cb(null, file.filename + "-" + file.originalname);
//   },
// });

const app = express();
const store = new MongoDbStore({
  uri: MONGODB_URI,
  collection: "sessions",
});
const sqlite3 = require("sqlite3");
const cors = require("cors");
app.use(express.static(__dirname + "/public"));
app.use("/images", express.static(__dirname + "/images"));
app.use("/uploads", express.static(__dirname + "/uploads"));


app.use(bodyParser.urlencoded({ extended: false }));
// app.use(multer({ storage: fileStorage }).single('fuVideo'));
app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);
app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      if (!user) {
        return next();
      }
      req.user = user;
      next();
    })
    .catch((err) => {
      next(new Error(err));
    });
});
app.set("views", "./views");
app.set("view engine", "ejs");

const teacherRoutes = require("./routes/teacher");
const adminRoutes = require("./routes/admin");
const authRoutes = require("./routes/auth");
const studRoutes = require("./routes/student");
const courseRoutes=require('./routes/course');

app.use(authRoutes);
app.use("/teacher", teacherRoutes);
app.use("/admin", adminRoutes);
app.use(studRoutes);
app.use(courseRoutes);


app.get("/", function (req, res) {
  res.render("index");
});
app.get("/about", function (req, res) {
  res.render("about");
});


app.get("/help", function (req, res) {
  res.render("help");
});
app.get("/contact", function (req, res) {
  res.render("contact");
});

app.get("/courses/course1", (req, res) => {
  res.render("courses/course1");
});
app.get("/courses/course2", (req, res) => {
  res.render("courses/course2");
});
app.get("/courses/course3", (req, res) => {
  res.render("courses/course3");
});
app.get("/courses/course4", (req, res) => {
  res.render("courses/course4");
});
app.get("/courses/course5", (req, res) => {
  res.render("courses/course5");
});
app.get("/courses/course6", (req, res) => {
  res.render("courses/course6");
});
app.get("/signedin", (req, res) => {
  res.render("partials/signedinnav");
});


app.get("/courseContent", function (req, res) {
  res.render("teacher/courseContent");
});





app.get("/student/account/profile", (req, res) => {
  res.render("student/sprofile");
});
app.get("/student/account/course-list", (req, res) => {
  res.render("student/scourselist");
});

mongoose
  .connect("mongodb+srv://nagapreethamj21:preetham@cluster0.jhy2xxy.mongodb.net/Learning")
  .then((result) => {
    app.listen(3001, () => {
      console.log("App Listening to port 3001");
    });
    console.log('MongoDB Connected...');
  })
  .catch((err) => console.log("MongoDB connection error:", err));
