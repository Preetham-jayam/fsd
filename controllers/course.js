const Course=require('../models/course');
const Teacher=require('../models/teacher');
const User=require('../models/user');
const Student=require('../models/student');


exports.getcoursebyId = (req, res, next) => {
  const courseId = req.params.cid;
  Course.findById(courseId)
    .populate('teacher')
    .populate('students')
    .populate('chapters')
    .exec()
    .then(course => {
      if (!course) {
        console.log('Course not found');
        return;
      }
      req.course = course;
      next();
    })
    .catch(err => {
      console.log(err.message);
      next(err);
    });
}

exports.getAllCourses= (req, res) => {
    Course.find({})
      .then((courses) => {
        console.log(courses.length);
        let teachers = [];
        courses.forEach((course) => {
          teachers.push(Teacher.findById(course.teacher));
        });
  
        Promise.all(teachers)
          .then((teacherResults) => {
            res.render('teacher/courses', { courses: courses, teachers: teacherResults });
          })
          .catch((err) => {
            console.log(err);
  
          });
      })
      .catch((err) => {
        console.log(err);
      });
  };

exports.getSingleCourse=(req,res,next)=>{
    const course=req.course;
    res.render('courseDetail',{data:course,teacher:course.teacher});
};

exports.SearchCourse = (req, res) => {
    const word = req.body;
    const exp = new RegExp(word.sname, 'i');
    const price = parseInt(word.sname);
    Course.find( { $or : [
      {title: { $regex: exp}} ,
      {name: { $regex: exp}} ,
      {price: !isNaN(price) ? price : 0} 
      ]})
      .then((courses) => {
        console.log(courses.length);
        let teachers = [];
        courses.forEach((course) => {
          teachers.push(Teacher.findById(course.teacher));
        });
  
        Promise.all(teachers)
          .then((teacherResults) => {
            res.render('teacher/courses', { courses: courses, teachers: teacherResults });
          })
          .catch((err) => {
            console.log(err);
  
          });
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
          console.log('Student is already enrolled in course');
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
  


  exports.getCheckoutPage=(req,res)=>{
    res.render('checkout');
  }
