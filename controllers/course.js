const Course=require('../models/course');
const Teacher=require('../models/teacher');
const User=require('../models/user');

exports.getAllCourses=(req,res)=>{
    Course.find({})
    .then((courses)=>{
        courses.forEach((course)=>{
            Teacher.findById(course.teacher)
            .then((teacher)=>{
                res.render('teacher/courses',{courses:courses,teacher:teacher});
            })
        })   
    })  
    .catch(err => console.log(err));  
}
exports.getSingleCourse=(req,res,next)=>{
    const id=req.params.id;
    Course.findById(id)
    .populate('teacher')
     .then(course=>{
        res.render('teacher/coursedetail',{data:course,teacher:course.teacher});
     })
     .catch(err => console.log(err));
};