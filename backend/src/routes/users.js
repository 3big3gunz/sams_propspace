const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getUsers,
  getUser,
  getSavedProperties,
  updateUser,
  deleteUser
} = require('../controllers/users');

router.get('/saved', protect, getSavedProperties);
router.get('/', protect, authorize('admin'), getUsers);
router.route('/:id')
  .get(getUser)
  .put(protect, authorize('admin'), updateUser)
  .delete(protect, authorize('admin'), deleteUser);

module.exports = router;
