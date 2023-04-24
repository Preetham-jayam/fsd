const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    FullName: {
      type: String,
      required: true,
    },

    phoneNo: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;
