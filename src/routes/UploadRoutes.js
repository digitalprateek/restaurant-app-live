const express = require('express');
const router = express.Router();
const multer  = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../cloudinaryConfig');

// Food images storage configuration
const foodStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'restaurant_app/food_images', // Cloudinary folder for food images
    allowed_formats: ['jpg', 'png', 'jpeg'],
  },
});
const foodUpload = multer({ storage: foodStorage });

// Restaurant images storage configuration
const restaurantStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'restaurant_app/restaurant_images', // Cloudinary folder for restaurant images
    allowed_formats: ['jpg', 'png', 'jpeg'],
  },
});
const restaurantUpload = multer({ storage: restaurantStorage });

// Endpoint for food image uploads
router.post('/food', foodUpload.single('image'), (req, res) => {
  // console.log("food route reached");
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  // Return both the URL and the public_id (from req.file.filename)
  res.status(200).json({ url: req.file.path, public_id: req.file.filename });
});

// Endpoint for restaurant image uploads
router.post('/restaurant', restaurantUpload.single('image'), (req, res) => {
  // console.log("restaurant img route reached");
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  res.status(200).json({ url: req.file.path, public_id: req.file.filename });
});

router.delete('/delete', async (req, res) => {
  // console.log("req reached to delete img from cloud");
  const { publicId } = req.body;
  // console.log("public id received", publicId);
  if (!publicId) {
    return res.status(400).json({ message: 'No public ID provided' });
  }
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    res.status(200).json({ message: 'Image deleted successfully', result });
  } catch (error) {
    // console.error('Error deleting image', error);
    res.status(500).json({ message: 'Error deleting image', error });
  }
});

module.exports = router;