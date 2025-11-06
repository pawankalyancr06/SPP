const upload = require('../middlewares/uploadMiddleware');

// Upload single image
const uploadImage = upload.single('image');

// Upload multiple images
const uploadImages = upload.array('images', 10); // Max 10 images

module.exports = {
  uploadImage,
  uploadImages,
};

