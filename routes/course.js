const express=require('express');
const router=express.Router();
const isAuth = require("../middleware/isAuth");

const courseController=require('../controllers/course');
router.param('cid',courseController.getcoursebyId);
// router.get('/courses',courseController.getAllCourses);
router.get('/courses',courseController.getCourses);

router.get('/courseDetail/:cid',courseController.getSingleCourse);
router.post('/course/search',courseController.SearchCourse);
router.get('/checkout',isAuth,courseController.getCheckoutPage);
module.exports=router;