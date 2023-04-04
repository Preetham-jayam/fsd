const express=require('express');
const router=express.Router();
const teacherController=require('../controllers/teacher');
const isAuth = require("../middleware/isAuth");

router.get('/home',isAuth,teacherController.getHomepage);
router.get('/addCourse',isAuth,teacherController.getAddCourse);
router.post('/addCourse',isAuth,teacherController.postAddCourse);
router.get('/courseDetails/:id',isAuth,teacherController.getSingleCourse);
router.get('/course/upload/:id',isAuth,teacherController.upload);
router.get('/course/edit/:id',isAuth,teacherController.getCourseEdit);
router.post('/course/edit/:id',isAuth,teacherController.postEditCourse);
router.get('/quiz/:id',isAuth,teacherController.getQuizPage);


module.exports=router;