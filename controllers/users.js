const asyncHandler = require("express-async-handler");
const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/User");

// @desc    Get all users
// @route   GET /api/v1/users
// @access  Public
module.exports.getUsers = async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({ success: true, count: users.length, data: users });
};

// @desc    Get single user
// @route   GET /api/v1/users/:id
// @access  Public
module.exports.getUser = async (req, res, next) => {
  const user = await User.findById(req.params.id);

  // Continue from here!
  // TODO: Resolve this:
  // ! Error: Cast to ObjectId failed for value "5d7a514b5d2c12c7449be04" (type string) at path "_id" for model "User"
  // Response is not being sent!

  if (!user) {
    return next(
      new ErrorResponse(`User not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({ success: true, data: user });
};

// @desc    Get all builders
// @route   GET /api/v1/users/builders
// @access  Public
module.exports.getBuilders = async (req, res, next) => {
  const builders = await User.find({ role: "builder" }).populate({
    path: "projects",
    select: ["name"],
  });

  res
    .status(200)
    .json({ success: true, count: builders.length, data: builders });
};

// @desc    Get all customers
// @route   GET /api/v1/users/customers
// @access  Public
module.exports.getCustomers = async (req, res, next) => {
  const customers = await User.find({ role: "customer" });

  res
    .status(200)
    .json({ success: true, count: customers.length, data: customers });
};

// @desc    Get all brokers
// @route   GET /api/v1/users/brokers
// @access  Public
module.exports.getBrokers = async (req, res, next) => {
  const brokers = await User.find({ role: "broker" });

  res.status(200).json({ success: true, count: brokers.length, data: brokers });
};

// @desc    Create user
// @route   POST /api/v1/users/
// @access  Public
exports.createUser = asyncHandler(async (req, res, next) => {
  const { role, firstName, lastName, name, mobile, email, password, projects } =
    req.body;

  // Create user
  const user = await User.create({
    role,
    firstName,
    lastName,
    name,
    mobile,
    email,
    password,
    projects,
  });

  user.save({ validationBeforeSave: false });

  sendTokenResponse(user, 200, res);
});

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken;

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    token,
  });
};
