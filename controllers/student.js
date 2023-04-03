const Student = require("../models/student");
exports.getHomepage = (req, res, next) => {
  Student.findById(req.session.user.student).then((result) => {
    console.log(result);
    res.render("student/shome", { user: req.session.user,student:result});
  });
  // if(!user){
  //     return res.redirect('/login');
  // }
};

exports.getProfile = (req, res, next) => {
  res.render("student/sprofile");
};
