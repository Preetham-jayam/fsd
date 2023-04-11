const express=require('express');
const router=express.Router();
const studentController=require('../controllers/student');
const isAuth = require("../middleware/isAuth");

router.get('/student/shome',isAuth,studentController.getHomepage);
router.get('student/account/profile',isAuth,studentController.getProfile);
router.get('/student/courseContent/:id',isAuth,studentController.getCourseContent);
router.get('/student/courseDetails/:id',isAuth,studentController.getCourseDetails);
router.post('/student/enroll',isAuth,studentController.enrolledcourse);

module.exports=router;