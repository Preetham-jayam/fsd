const express=require('express');
const router=express.Router();

const adminController=require('../controllers/admin');
const userController=require('../controllers/user');
router.param('uid',userController.getUserById);
router.get('/admindb',adminController.getDashboard);
router.get('/all/students',adminController.getAllStudents);
router.get('/all/teachers',adminController.getAllTeachers);
router.get('/all/courses',adminController.getAllCourses);
router.get('/block/:id',adminController.BlockUser);
router.get('/student/delete/:uid',adminController.DeleteUser);

module.exports=router;