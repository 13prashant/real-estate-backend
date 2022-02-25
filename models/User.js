const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ["builder", "customer", "broker"],
    required: true,
  },
  firstName: {
    type: String,
    required: [
      function () {
        return this.role === "customer" || this.role === "broker";
      },
      "Please add your first name",
    ],
  },
  lastName: {
    type: String,
    required: [
      function () {
        return this.role === "customer" || this.role === "broker";
      },
      "Please add your first name",
    ],
  },
  fullName: String,
  name: {
    type: String,
    required: [
      function () {
        return this.role === "builder";
      },
      "Please add builder's name",
    ],
    trim: true,
  },
  mobile: {
    type: String,
    // unique: true,
  },
  email: {
    type: String,
    required: [true, "Please add an email"],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please add a valid email",
    ],
  },
  password: {
    type: String,
    required: [true, "Please add a password"],
    minlength: 8,
    select: false,
  },
  projects: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Project",
  },
});

UserSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  if (this.role === "customer" || this.role === "broker") {
    this.fullName = `${this.firstName} ${this.lastName}`;
    this.projects = undefined;
  }
});

// Encrypt password usning bcryptjs
// UserSchema.pre("save", async function (next) {
//   const salt = await bcrypt.genSalt(10);
//   this.password = bcrypt.hash(this.password, salt);
// });

// Sign jwt and return
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

module.exports = mongoose.model("User", UserSchema);
