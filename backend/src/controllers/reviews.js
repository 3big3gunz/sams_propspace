const Review = require('../models/Review');
const Property = require('../models/Property');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get reviews for a property
// @route   GET /api/v1/properties/:propertyId/reviews
// @access  Public
exports.getReviews = async (req, res, next) => {
  const reviews = await Review.find({ property: req.params.propertyId })
    .populate({ path: 'user', select: 'name avatar' })
    .sort('-createdAt');
  res.status(200).json({ success: true, count: reviews.length, data: reviews });
};

// @desc    Get single review
// @route   GET /api/v1/reviews/:id
// @access  Public
exports.getReview = async (req, res, next) => {
  const review = await Review.findById(req.params.id)
    .populate({ path: 'property', select: 'title' })
    .populate({ path: 'user', select: 'name avatar' });
  if (!review) {
    return next(new ErrorResponse(`No review found with id of ${req.params.id}`, 404));
  }
  res.status(200).json({ success: true, data: review });
};

// @desc    Add review
// @route   POST /api/v1/properties/:propertyId/reviews
// @access  Private
exports.addReview = async (req, res, next) => {
  req.body.property = req.params.propertyId;
  req.body.user = req.user.id;

  const property = await Property.findById(req.params.propertyId);
  if (!property) {
    return next(new ErrorResponse(`No property with the id of ${req.params.propertyId}`, 404));
  }

  const review = await Review.create(req.body);
  res.status(201).json({ success: true, data: review });
};

// @desc    Update review
// @route   PUT /api/v1/reviews/:id
// @access  Private
exports.updateReview = async (req, res, next) => {
  let review = await Review.findById(req.params.id);
  if (!review) {
    return next(new ErrorResponse(`No review with the id of ${req.params.id}`, 404));
  }
  if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized to update review', 401));
  }
  review = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  res.status(200).json({ success: true, data: review });
};

// @desc    Delete review
// @route   DELETE /api/v1/reviews/:id
// @access  Private
exports.deleteReview = async (req, res, next) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    return next(new ErrorResponse(`No review with the id of ${req.params.id}`, 404));
  }
  if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized to delete review', 401));
  }
  await review.deleteOne();
  res.status(200).json({ success: true, data: {} });
};
