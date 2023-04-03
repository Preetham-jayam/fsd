const express=require('express');
const router=express.Router();

const teacherController=require('../controllers/teacher');

router.get('/home',teacherController.getHomepage);
router.get('/addCourse',teacherController.getAddCourse);
router.post('/addCourse',teacherController.postAddCourse);
router.get('/courseDetails/:id',teacherController.getSingleCourse);
router.get('/course/upload/:id',teacherController.upload);
router.get('/course/edit/:id',teacherController.getCourseEdit);
router.post('/course/edit/:id',teacherController.postEditCourse);
router.get('/quiz/:id',teacherController.getQuizPage);


module.exports=router;