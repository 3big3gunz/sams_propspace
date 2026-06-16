const Property = require('../models/Property');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const path = require('path');

// @desc    Get all properties
// @route   GET /api/v1/properties
// @access  Public
exports.getProperties = async (req, res, next) => {
  res.status(200).json(res.advancedResults);
};

// @desc    Get single property
// @route   GET /api/v1/properties/:id
// @access  Public
exports.getProperty = async (req, res, next) => {
  const property = await Property.findById(req.params.id)
    .populate({ path: 'owner', select: 'name email avatar phone bio' })
    .populate({ path: 'reviews', populate: { path: 'user', select: 'name avatar' } });

  if (!property) {
    return next(new ErrorResponse(`Property not found with id of ${req.params.id}`, 404));
  }

  // Increment views
  await Property.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });

  res.status(200).json({ success: true, data: property });
};

// @desc    Create new property
// @route   POST /api/v1/properties
// @access  Private
exports.createProperty = async (req, res, next) => {
  req.body.owner = req.user.id;

  // Placeholder image if none provided
  if (!req.body.images || req.body.images.length === 0) {
    req.body.images = [{
      url: `https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800`,
      caption: 'Property Image'
    }];
  }

  const property = await Property.create(req.body);
  res.status(201).json({ success: true, data: property });
};

// @desc    Update property
// @route   PUT /api/v1/properties/:id
// @access  Private
exports.updateProperty = async (req, res, next) => {
  let property = await Property.findById(req.params.id);
  if (!property) {
    return next(new ErrorResponse(`Property not found with id of ${req.params.id}`, 404));
  }
  if (property.owner.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized to update this property', 401));
  }
  property = await Property.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  res.status(200).json({ success: true, data: property });
};

// @desc    Delete property
// @route   DELETE /api/v1/properties/:id
// @access  Private
exports.deleteProperty = async (req, res, next) => {
  const property = await Property.findById(req.params.id);
  if (!property) {
    return next(new ErrorResponse(`Property not found with id of ${req.params.id}`, 404));
  }
  if (property.owner.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized to delete this property', 401));
  }
  await property.deleteOne();
  res.status(200).json({ success: true, data: {} });
};

// @desc    Get properties by owner
// @route   GET /api/v1/properties/my-listings
// @access  Private
exports.getMyListings = async (req, res, next) => {
  const properties = await Property.find({ owner: req.user.id }).sort('-createdAt');
  res.status(200).json({ success: true, count: properties.length, data: properties });
};

// @desc    Save / unsave a property
// @route   PUT /api/v1/properties/:id/save
// @access  Private
exports.saveProperty = async (req, res, next) => {
  const user = await User.findById(req.user.id);
  const propId = req.params.id;
  const isSaved = user.savedProperties.includes(propId);

  if (isSaved) {
    user.savedProperties = user.savedProperties.filter(id => id.toString() !== propId);
  } else {
    user.savedProperties.push(propId);
  }
  await user.save();

  res.status(200).json({
    success: true,
    saved: !isSaved,
    savedProperties: user.savedProperties
  });
};

// @desc    Get featured properties
// @route   GET /api/v1/properties/featured
// @access  Public
exports.getFeatured = async (req, res, next) => {
  const properties = await Property.find({ featured: true, status: 'active' })
    .populate('owner', 'name avatar')
    .limit(6)
    .sort('-createdAt');
  res.status(200).json({ success: true, count: properties.length, data: properties });
};

// @desc    Get property stats
// @route   GET /api/v1/properties/stats
// @access  Public
exports.getStats = async (req, res, next) => {
  const totalListings = await Property.countDocuments({ status: 'active' });
  const forSale = await Property.countDocuments({ listingType: 'sale', status: 'active' });
  const forRent = await Property.countDocuments({ listingType: 'rent', status: 'active' });
  const cities = await Property.distinct('address.city');

  res.status(200).json({
    success: true,
    data: { totalListings, forSale, forRent, cities: cities.length }
  });
};
