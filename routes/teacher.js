const express = require("express");
const router = express.Router();
const teacherController = require("../controllers/teacher");
const courseController = require("../controllers/course");
const isAuth = require("../middleware/isAuth");
const multer = require("multer");
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const extension = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${timestamp}-${randomString}${extension}`);
  },
});

const imageUpload = multer({ dest: "uploads/images" });
const videoUpload = multer({ dest: "uploads/videos" });

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
router.get("/course/edit/:cid", isAuth, teacherController.getCourseEdit);
router.post("/course/edit/:cid", isAuth, teacherController.postEditCourse);
router.get("/quiz/:cid", isAuth, teacherController.getQuizPage);
router.post("/quiz/:cid", isAuth, teacherController.PostaddQuestion);
router.get("/profile", isAuth, teacherController.getProfileEdit);
router.post("/profile", isAuth, teacherController.postProfileEdit);
router.get("/edit-password", isAuth, teacherController.getPasswordEdit);
router.post("/edit-password", isAuth, teacherController.postPasswordedit);

module.exports = router;
