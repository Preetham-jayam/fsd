const express = require("express");
const router = express.Router();
const teacherController = require("../controllers/teacher");
const courseController = require("../controllers/course");
const isAuth = require("../middleware/isAuth");
const multer = require("multer");

const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/images");
  },
  filename: (req, file, cb) => {
    const fileName = `${file.originalname}-${Date.now()}`;
    cb(null, fileName);
  }
});

const imageUpload = multer({ storage: imageStorage });

const videoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/videos");
  },
  filename: (req, file, cb) => {
    const fileName = `${file.originalname}-${Date.now()}`;
    cb(null, fileName);
  }
});

const videoUpload = multer({ storage: videoStorage });


router.param("cid", courseController.getcoursebyId);
router.get("/home", isAuth, teacherController.getHomepage);
router.get("/addCourse", isAuth, teacherController.getAddCourse);
router.post(
  "/addCourse",
  imageUpload.single("fuImage"),
  isAuth,
  teacherController.postAddCourse
);
router.get("/courseDetails/:cid", isAuth, teacherController.getSingleCourse);
router.get("/course/upload/:cid", isAuth, teacherController.upload);
router.post(
  "/course/upload/:cid",
  videoUpload.single("fuVideo"),
  isAuth,
  teacherController.postUpload
);
router.get("/course/edit/:id", isAuth, teacherController.getCourseEdit);
router.post("/course/edit/:id", isAuth, teacherController.postEditCourse);
router.get("/quiz/:cid", isAuth, teacherController.getQuizPage);
router.post("/quiz/:cid", isAuth, teacherController.PostaddQuestion);
router.get("/profile", isAuth, teacherController.getProfileEdit);
router.post("/profile", isAuth, teacherController.postProfileEdit);
router.get("/edit-password", isAuth, teacherController.getPasswordEdit);
router.post("/edit-password", isAuth, teacherController.postPasswordedit);

module.exports = router;
