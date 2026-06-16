const ErrorResponse = require('../utils/errorResponse');
const path = require('path');
const fs = require('fs');

// @desc    Upload property images (local)
// @route   POST /api/v1/upload
// @access  Private
exports.uploadImage = async (req, res, next) => {
  if (!req.files || !req.files.file) {
    return next(new ErrorResponse('Please upload a file', 400));
  }

  const file = req.files.file;

  // Check it's an image
  if (!file.mimetype.startsWith('image')) {
    return next(new ErrorResponse('Please upload an image file', 400));
  }

  // Check file size
  const maxSize = parseInt(process.env.MAX_FILE_UPLOAD) || 5000000;
  if (file.size > maxSize) {
    return next(new ErrorResponse(`Please upload an image less than ${maxSize / 1000000}MB`, 400));
  }

  // Create custom filename
  file.name = `photo_${Date.now()}${path.parse(file.name).ext}`;

  const uploadPath = path.join(__dirname, '../../public/uploads');

  // Create dir if not exists
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }

  file.mv(`${uploadPath}/${file.name}`, async (err) => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse('Problem with file upload', 500));
    }

    res.status(200).json({
      success: true,
      data: {
        url: `/uploads/${file.name}`,
        filename: file.name
      }
    });
  });
};
