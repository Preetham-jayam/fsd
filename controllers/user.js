const User = require("../models/user");
exports.getUserById = (req, res, next, id) => {
  User.findById(id)
    .then((user) => {
      if (!user) {
        console.log("user not found");
      }
      req.data = user;
      next();
    })
    .catch((err) => {
      console.log("Couldnot retrieve users");
    });
};
