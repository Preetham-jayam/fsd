const express=require('express');
const router=express.Router();

const adminController=require('../controllers/admin');

router.get('/all/students',adminController.getAllStudents);
router.get('/all/teachers',adminController.getAllTeachers);
router.get('/all/courses',adminController.getAllCourses);


module.exports=router;