const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const advancedResults = require('../utils/advancedResults');
const Property = require('../models/Property');
const {
  getProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty,
  getMyListings,
  saveProperty,
  getFeatured,
  getStats
} = require('../controllers/properties');

// Include review router
const reviewRouter = require('./reviews');
router.use('/:propertyId/reviews', reviewRouter);

router.get('/featured', getFeatured);
router.get('/stats', getStats);
router.get('/my-listings', protect, getMyListings);

router.route('/')
  .get(advancedResults(Property, { path: 'owner', select: 'name avatar phone' }), getProperties)
  .post(protect, createProperty);

router.route('/:id')
  .get(getProperty)
  .put(protect, updateProperty)
  .delete(protect, deleteProperty);

router.put('/:id/save', protect, saveProperty);

module.exports = router;
