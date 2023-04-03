const studentModel=require('../models/student');
const courseModel=require('../models/course');
const teacherModel=require('../models/teacher');

exports.getAllStudents=(req,res)=>{
    res.render('admin/tstudents',{title:'All Students'});
};
exports.getAllTeachers=(req,res)=>{
    res.render('admin/tteachers');
};
exports.getAllCourses=(req,res)=>{
    res.render('admin/tcourses');
};