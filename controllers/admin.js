const studentModel=require('../models/student');
const courseModel=require('../models/course');
const teacherModel=require('../models/teacher');
const User=require('../models/user');

exports.getDashboard=(req,res)=>{
    res.render('admin/admindb',{title:'Admin Dashboard'});
}

exports.getAllStudents=(req,res)=>{
    User.find({role:0})
    .populate({
      path: 'student',
      populate: {
        path: 'courses',
        model: 'Course'
      }
    })
    .then((result)=>{
      result.forEach((user)=>{
        res.render('admin/tstudents',{title:'All Students',users:result,courses:user.student.courses});
      })
        })
    
    .catch(err=>{
            console.log(err); 
    })
};


// exports.getAllTeachers=(req,res)=>{
//     teacherModel.find({})
//     .then((result)=>{
//         let courses=[]
//         result.forEach((teacher)=>{
//             teacher.courses.forEach((course)=>{
//                 courseModel.findById(course)
//                 .then((result)=>{
//                     courses.push(result);
//                 })
               
//                 res.render('admin/tteachers',{title:'All Teachers',teachers:result,courses:courses});
//             })
//         })
             
//     })
//     .catch(err=>{
//         console.log(err); 
// });
// };
exports.getAllTeachers = (req, res) => {
    teacherModel.find({})
    .then((teachers) => {
        let courses = [];

        // Create an array of promises that resolve with the course models
        const coursePromises = teachers.map((teacher) => {
            return Promise.all(teacher.courses.map((courseId) => {
                return courseModel.findById(courseId);
            }));
        });

        // Wait for all promises to resolve and populate the courses array
        Promise.all(coursePromises)
        .then((courseResults) => {
            courseResults.forEach((courseArray) => {
                courses.push(...courseArray);
            });

            // Render the view with the populated courses array
            res.render('admin/tteachers', {
                title: 'All Teachers',
                teachers: teachers,
                courses: courses
            });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send('Error retrieving courses');
        });
    })
    .catch((err) => {
        console.log(err);
        res.status(500).send('Error retrieving teachers');
    });
};

exports.getAllCourses=(req,res)=>{
    courseModel.find({})
      .then((courses) => {
        console.log(courses.length);
        let teachers = [];
        courses.forEach((course) => {
          teachers.push(teacherModel.findById(course.teacher));
        });
  
        Promise.all(teachers)
          .then((teacherResults) => {
            res.render('admin/tcourses', {title:'All Courses', courses: courses, teachers: teacherResults });
          })
          .catch((err) => {
            console.log(err);
  
          });
      })
      .catch((err) => {
        console.log(err);
      });
};

exports.BlockUser = (req, res) => {
  // const id = req.params.uid;
  // const user=req.data;
  // User.findOne(user)
  //   .then(user => {
  //     if (!user) {
  //       throw new Error('User not found');
  //     }
  //     if (user.flag == 0) {
  //       user.flag = 1;
  //     } else {
  //       user.flag = 0;
  //     }
  //     return user.save();
  //   })
  //   .then(() => {
  //     res.redirect('/admin/all/students');
  //   })
  //   .catch(err => {
  //     console.log(err);
  //   });
  // console.log(user);

 
    const userId = req.params.id;
    User.findById(userId)
      .then(user => {
        if (!user) {
          throw new Error('User not found.');
        }
        user.flag = user.flag === 1 ? 0 : 1;
        return user.save();
      })
      .then(updatedUser => {
        if(updatedUser.flag === 1){
          console.log('User blocked successfully.');
        } else{'User unblocked successfully.';}
       res.redirect('/admin/all/students');
      })
      .catch(err => {
        console.error(err);
      });

  
};

exports.DeleteUser = (req, res) => {
  const id = req.params.uid;
  console.log(id);

  studentModel.findByIdAndDelete(id)
    .then(user => {
      if (!user) {
        return res.status(404).send("User not found");
      }
      return res.status(200).send("User deleted successfully");
    })
    .catch(err => {
      console.log(err);
      return res.status(500).send("Internal server error");
    });
};


