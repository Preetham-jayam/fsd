const express=require('express');
const router=express.Router();
const courseController=require('../controllers/course');
router.get('/courses',courseController.getAllCourses);
router.get('/courseDetail/:id',courseController.getSingleCourse);

module.exports=router;