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
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, file.filename + "-" + file.originalname);
  },
});

const app = express();
const store = new MongoDbStore({
  uri: MONGODB_URI,
  collection: "sessions",
});
const sqlite3 = require("sqlite3");
const cors = require("cors");
app.use(express.static(__dirname + "/public"));
app.use("/images", express.static(__dirname + "/images"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ storage: fileStorage }).single("fuImage"));
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
// require('dotenv').config();

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

// const dbna=path.join(__dirname,"data","fsd.db");

// const db=new sqlite3.Database(dbna,err=>{
// if(err){
//     return console.log(err.message);
// }
// console.log("Database connected");
// });

// const studenttable="CREATE TABLE IF NOT EXISTS student (sid INTEGER PRIMARYKEY AUTO_INCREMENT,firstname varchar(50),lastname varchar(50),PhoneNo varchar(10),Email varchar(50),Password varchar(50));";
// const coursemodel="CREATE TABLE IF NOT EXISTS course (cid INTEGER PRIMARYKEY AUTO_INCREMENT ,Name varchar(50),Title varchar(60),cost varchar(10),salecost varchar(20),Idcategory varchar(30),Description varchar(100),status varchar(50) default 'unfinished',IdTeacher int unsigned );";
// const teachermodel="CREATE TABLE IF NOT EXISTS teacher (tid INTEGER AUTO_INCREMENT PRIMARYKEY ,Fullname varchar(50),Instname varchar(60),PhoneNo varchar(10),Email varchar(30),Password varchar(50),gender varchar(10));";
// const categorymodel=" CREATE TABLE IF NOT EXISTS Headercategory(catId int unsigned auto_increment primary key,HeaderNameCategory varchar(50) not null)";
// const lessonmodel= 'create table if not exists Lesson(idLesson int unsigned auto_increment primary key, NameLesson varchar(100) not null,Video text not null,idChapter int unsigned not null,CONSTRAINT FK_ChapterLesson FOREIGN KEY (IdChapter)REFERENCES Chapter(IdChapter))';
// const chaptermodel="create table if not exists Chapter(IdChapter int unsigned auto_increment primary key,NameChapter varchar(50) not null,cid int unsigned not null,CONSTRAINT FK_ChapterCourse FOREIGN KEY (cid)REFERENCES course(cid))";

// db.run(studenttable,err=>{
//   if(err){
//       return console.log(err.message);
//   }
//   console.log("Student Table Created");
// });
// db.run(coursemodel,err=>{
//   if(err){
//       return console.log(err.message);
//   }
//   console.log("Course Table Created");
// });
// db.run(teachermodel,err=>{
//   if(err){
//       return console.log(err.message);
//   }
//   console.log("Teacher Table Created");
// });
// db.run(chaptermodel,err=>{
//   if(err){
//       return console.log(err.message);
//   }
//   console.log("Chapter Table Created");
// });
// db.run(lessonmodel,err=>{
//   if(err){
//       return console.log(err.message);
//   }
//   console.log("Lesson Table Created");
// });
// db.run(categorymodel,err=>{
//   if(err){
//       return console.log(err.message);
//   }
//   console.log("Category Table Created");
// });

// const inserts="Insert into student values(1,'kampara','chaitanya','9573569787','chaitu@gmail.com','chaitu')";
// db.run(inserts,err=>{
//   if(err){
//       return console.log(err.message);
//   }
//   console.log("Data Inserted");
// });

// const deleter="drop table teacher";
// db.run(deleter,err=>{
//   if(err){
//       return console.log(err.message);
//   }
//   console.log("data deleted");
// });

// const deleter="delete from student where firstname='kampara'";
// db.run(deleter,err=>{
//   if(err){
//       return console.log(err.message);
//   }
//   console.log("data deleted");
// });

app.get("/", function (req, res) {
  res.render("index");
});
app.get("/tlogin", function (req, res) {
  res.render("tlogin");
});
app.get("/about", function (req, res) {
  res.render("about");
});

// app.get("/courses", function (req, res) {
//   res.render("teacher/courses");
// });

app.post("/admin", function (req, res) {
  res.render("admin/admin");
});
app.get("/admindb", function (req, res) {
  res.render("admin/admindb", { title: "Admin Dashboard" });
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
app.get("/checkout", (req, res) => {
  res.render("checkout");
});

app.get("/signup", function (req, res) {
  res.render("student/signup", { model: {} });
});

// let k=1;
// app.post("/signup",(req,res)=>{
//   const sql="Insert into student (sid,firstname,lastname,PhoneNo,Email,Password) values(?,?,?,?,?,?);";
//   const student=[k++,req.body.fname,req.body.lname,req.body.phno,req.body.email,req.body.pwd];
//   db.run(sql,student,err=>{
//     if(err){
//       console.log(err.message);
//     }
//     res.redirect("/login");
//   });
// });

app.get("/tsignup", function (req, res) {
  res.render("teacher/tsignup", { model: {} });
});

// var tid=1;
// app.post("/tsignup",(req,res)=>{
//   const sql="Insert into teacher (tid,Fullname,Instname,PhoneNo,Email,Password,gender) values(?,?,?,?,?,?,?);";
//   const teacher=[tid++,req.body.fname,req.body.instname,req.body.phno,req.body.email,req.body.pwd,req.body.gender];
//   db.run(sql,teacher,err=>{
//     if(err){
//       console.log(err.message);
//     }
//     res.redirect("/tlogin");
//   })
// });

// app.get("/teacher",(req,res)=>{
//   const sql="SELECT * from course ORDER by cid";
//   db.all(sql,(err,rows)=>{
//       if(err){
//           return console.log(err.message);
//       }
//       res.render("teacher/teacher-home",{model:rows});
//   })
// });
app.get("/courseContent", function (req, res) {
  res.render("teacher/courseContent");
});
// app.get("/teacher/course/add",(req,res)=>{
//   res.render("teacher/add-course",{model:{}});
// });
app.get("/teacher/profile", (req, res) => {
  res.render("teacher/teacher-profile");
});
app.get("/teacher/edit-password", (req, res) => {
  res.render("teacher/edit-password");
});

// app.get("/teacher/course/:id",(req,res)=>{
//   var id=req.params.id;
//   console.log(id)
//   db.all("select * from course ",(err,courses)=>{
//       courses.forEach((course) =>{
//         if(course.cid == id){
//             res.render("teacher/coursedetail",{data:course});
//         }

//       })
//     });

//  });

//  app.get("/admindb/students/all",(req,res)=>{
//   const sql="SELECT * from student ORDER by sid";
//   db.all(sql,(err,rows)=>{
//       if(err){
//           return console.log(err.message);
//       }
//       res.render("admin/tstudents",{title:'All Students',model:rows});
//   })
// });

//  app.get("/admindb/teacher/all",(req,res)=>{
//   const sql="SELECT * from teacher ORDER by tid";
//   db.all(sql,(err,rows)=>{
//       if(err){
//           return console.log(err.message);
//       }
//       res.render("admin/tteachers",{title:'All Teachers',model:rows});
//   })
// });

// app.get("/admindb/course/all",(req,res)=>{
//   const sql="SELECT * from course ORDER by cid";
//   db.all(sql,(err,rows)=>{
//       if(err){
//           return console.log(err.message);
//       }
//       res.render("admin/tcourses",{title:'All courses',model:rows});
//   })
// });

//  app.get("/teacher/course/edit/:id",(req,res)=>{
//   var id=req.params.id;
//   console.log(id)
//   db.all("select * from course ",(err,courses)=>{
//       courses.forEach((course) =>{
//         if(course.cid == id){
//             res.render("teacher/course-edit",{course:course});
//         }

//       })
//     });

//  });

//  app.get("/teacher/course/upload/:id",(req,res)=>{
//   var id=req.params.id;
//   console.log(id)
//   db.all("select * from course ",(err,courses)=>{
//       courses.forEach((course) =>{
//         if(course.cid == id){
//             res.render("teacher/courseupload",{data:course});
//         }

//       })
//     });

//  });

// var c=1;
// app.post("/teacher/course/add",(req,res)=>{
//   const sql='Insert into course(cid,Name,Title,cost,Description) values(?,?,?,?,?);';
//   const course=[c++,req.body.nameCourse,req.body.title,req.body.Price,req.body.Description];
//   db.run(sql,course,err=>{
//     if(err){
//       console.log(err.message);
//     }
//     res.redirect("/teacher");
//   })
// });

// app.get("/admin/detail/course/:id",(req,res)=>{
//   var id=req.params.id;
//   console.log(id)
//   db.all("select * from course ",(err,courses)=>{
//       courses.forEach((course) =>{
//         if(course.cid == id){
//             res.render("admin/admincoursedetail",{data:course});
//         }

//       })
//     });

//  });

//  app.get("/admin/course/edit/:id",(req,res)=>{
//   var id=req.params.id;
//   console.log(id)
//   db.all("select * from course ",(err,courses)=>{
//       courses.forEach((course) =>{
//         if(course.cid == id){
//             res.render("admin/course-edit",{title:'Course edit',course:course});
//         }

//       })
//     });

//  });

//  app.post("/admin/course/edit/:id",(req,res)=>{
//   var id=req.params.id;
//   const course=[req.body.nameCourse,req.body.Description,req.body.title,req.body.Price,req.body.SaleCost,req.body.id];
//   const sql="Update course set Name=?, Description=?, Title=?, cost=?, salecost=? where (cid=?)";
//   db.run(sql,course,err=>{
//     if(err){
//       console.log(err.message);
//     }
//     res.redirect("/admindb/course/all");
//   })
//  });

//  app.get("/teacher/quiz/:id",(req,res)=>{
//   var id=req.params.id;
//   db.all("select * from course order by cid",(err,courses)=>{
//     courses.forEach((course)=>{
//       if(course.cid==id){
//         res.render("teacher/teacher-quiz",{course:course});
//       }
//     })
//   });
//  });

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
