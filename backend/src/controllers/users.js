const User = require('../models/User');
const Property = require('../models/Property');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all users
// @route   GET /api/v1/users
// @access  Private/Admin
exports.getUsers = async (req, res, next) => {
  const users = await User.find().sort('-createdAt');
  res.status(200).json({ success: true, count: users.length, data: users });
};

// @desc    Get single user
// @route   GET /api/v1/users/:id
// @access  Public
exports.getUser = async (req, res, next) => {
  const user = await User.findById(req.params.id).select('-savedProperties');
  if (!user) {
    return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
  }
  const properties = await Property.find({ owner: req.params.id, status: 'active' }).limit(6);
  res.status(200).json({ success: true, data: { ...user.toObject(), properties } });
};

// @desc    Get saved properties for current user
// @route   GET /api/v1/users/saved
// @access  Private
exports.getSavedProperties = async (req, res, next) => {
  const user = await User.findById(req.user.id).populate({
    path: 'savedProperties',
    populate: { path: 'owner', select: 'name avatar' }
  });
  res.status(200).json({ success: true, count: user.savedProperties.length, data: user.savedProperties });
};

// @desc    Update user (admin)
// @route   PUT /api/v1/users/:id
// @access  Private/Admin
exports.updateUser = async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  res.status(200).json({ success: true, data: user });
};

// @desc    Delete user (admin)
// @route   DELETE /api/v1/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res, next) => {
  await User.findByIdAndDelete(req.params.id);
  res.status(200).json({ success: true, data: {} });
};
