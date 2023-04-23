const express=require('express');
const router=express.Router();
const authController=require('../controllers/auth');
router.get('/login',authController.getLogin);
router.post('/login',authController.postLogin)
router.get('/signup',authController.getSignUp);
router.get('/tsignup',authController.gettsignup);
router.post('/signup',authController.postSignUp);
router.post('/tsignup',authController.postSignUp);
router.get("/logout",authController.Logout);


module.exports=router;