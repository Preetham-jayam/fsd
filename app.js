const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDbStore = require("connect-mongodb-session")(session);
const flash=require('connect-flash');
const User = require("./models/user");
const bcryptjs=require('bcryptjs');
const MONGODB_URI = "mongodb+srv://nagapreethamj21:preetham@cluster0.jhy2xxy.mongodb.net/Learning";

const app = express();
const store = new MongoDbStore({
  uri: MONGODB_URI,
  collection: "sessions",
});
app.use(express.static(__dirname + "/public"));
app.use("/images", express.static(__dirname + "/images"));
app.use("/uploads", express.static(__dirname + "/uploads"));

app.use(bodyParser.urlencoded({ extended: false }));

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

app.use(flash());
app.use(function(req, res, next) {
  res.locals.messages = req.flash();
  next();
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

const Lesson=require('./models/lesson');

app.put('/lessons/:id', (req, res) => {
  const id = req.params.id;
  
  Lesson.findByIdAndUpdate(id, { checked: 1 }, { new: true })
    .then(updatedLesson => {
      res.json(updatedLesson);
    })
    .catch(err => {
      console.error('An error occurred while updating the lesson');
     
    });
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
