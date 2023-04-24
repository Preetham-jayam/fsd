const express = require("express");
const router = express.Router();
const studentController = require("../controllers/student");
const isAuth = require("../middleware/isAuth");
const multer = require("multer");
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, file.filename + "-" + file.originalname);
  },
});
const profileUpload = multer({ dest: "uploads/images" });
router.get("/", studentController.getIndex);
router.get("/about", studentController.getAboutpage);
router.get("/help", studentController.getHelpPage);
router.get("/contact", studentController.getContactPage);
router.get("/student/about", studentController.getAboutpage);
router.get("/student/help", studentController.getHelpPage);
router.get("/student/contact", studentController.getContactPage);
router.get("/student/shome", isAuth, studentController.getHomepage);
router.get("/student/profile", isAuth, studentController.getProfile);
router.get("/student/account", isAuth, studentController.getPasswordEdit);
router.post(
  "/student/edit-password",
  isAuth,
  studentController.postPasswordedit
);
router.post(
  "/student/profile/edit",
  profileUpload.single("profile"),
  isAuth,
  studentController.postProfileEdit
);
router.get("/student/course-list", isAuth, studentController.myLearning);
router.get(
  "/student/courseContent/:id",
  isAuth,
  studentController.getCourseContent
);
router.get(
  "/student/courseDetails/:id",
  isAuth,
  studentController.getCourseDetails
);
router.get("/payment/:id/:sid", isAuth, studentController.getPaymentpage);
router.post("/student/enroll", isAuth, studentController.enrolledcourse);
router.get("/student/quiz/:id", isAuth, studentController.studentQuiz);
router.post("/student/submitQuiz", isAuth, studentController.postsubmitQuiz);
router.post("/student/reviews/:id", isAuth, studentController.postAddreview);
router.get(
  "/certificate/:studentId/:courseId",
  studentController.generateCertificate
);

module.exports = router;
