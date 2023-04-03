const express=require('express');
const router=express.Router();
const studentController=require('../controllers/student');
const isAuth = require("../middleware/isAuth");
router.get('/student/shome',isAuth,studentController.getHomepage);
router.get('student/account/profile',isAuth,studentController.getProfile);

module.exports=router;