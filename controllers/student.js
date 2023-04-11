const Student = require("../models/student");
const Course=require('../models/course');
const Teacher=require('../models/teacher');

exports.getHomepage = (req, res, next) => {
  Student.findById(req.session.user.student)
  .populate('courses')
  .then((result) => {
    Course.find({})
      .then((courses) => {
        console.log(courses.length);
        let teachers = [];
        courses.forEach((course) => {
          teachers.push(Teacher.findById(course.teacher));
        });
  
        Promise.all(teachers)
          .then((teacherResults) => {
            console.log(result);
            res.render("student/shome", { user: req.session.user, student:result,courses: courses, teachers: teacherResults,scourses:result.courses});
            
          })
          .catch((err) => {
            console.log(err);
  
          });
      })
      .catch((err) => {
        console.log(err);
      });
    
  });
};


exports.enrolledcourse = (req, res) => {
  const { studentId, courseId } = req.body;
  Student.findById(studentId)
    .then((student) => {
      if (!student) {
        throw new Error(`Student not found`);
      }
      return Course.findById(courseId).populate('students');
    })
    .then((course) => {
      if (!course) {
        throw new Error(`Course not found`);
      }
      if (course.students.some((student) => student._id.toString() === studentId)) {
        console.log('Student is already enrolled in course');
        res.redirect("/student/courseContent/'+courseId'");
        return;
      }
      return Promise.all([
        Student.findByIdAndUpdate(studentId, { $push: { courses: courseId } }),
        Course.findByIdAndUpdate(courseId, { $push: { students: studentId } }),
      ]);
    })
    .then(() => {
      console.log(`Student has been enrolled in course`);
      res.redirect('/student/courseContent/:courseId');
      
    })
    .catch((err) => {
      console.error(`Error enrolling student in course: ${err.message}`);
    });
};


exports.getCourseDetails=(req,res)=>{
  const id=req.params.id;
  Student.findById(req.session.user.student).then((result) => {
    Course.findById(id)
    .populate('teacher')
    .populate({
      path: 'chapters',
      populate: {
        path: 'lessons',
        model: 'Lesson'
      }
    })
     .then(course=>{
              const chapters = course.chapters || [];
              const lessons = chapters.reduce((acc, chapter) => acc.concat(chapter.lessons), []);
        res.render('student/courseDetails',{data:course,teacher:course.teacher,student:result,chapters:chapters,lessons:lessons});
     })
     .catch(err => console.log(err));
    });
    

}

exports.getProfile = (req, res, next) => {
  res.render("student/sprofile");
};

exports.getCourseContent=(req,res)=>{
  const id=req.params.id;
  Student.findById(req.session.user.student).then((result) => {
    Course.findById(id)
    .populate('teacher')
    .populate({
      path: 'chapters',
      populate: {
        path: 'lessons',
        model: 'Lesson'
      }
    })
     .then(course=>{
              const chapters = course.chapters || [];
              const lessons = chapters.reduce((acc, chapter) => acc.concat(chapter.lessons), []);
        res.render('teacher/courseContent',{user: req.session.user,data:course,teacher:course.teacher,student:result,chapters:chapters,lessons:lessons});
     })
     .catch(err => console.log(err));
    });

};
