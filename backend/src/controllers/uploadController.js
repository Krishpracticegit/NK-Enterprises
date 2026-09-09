import cloudinary from '../config/cloudinary.js';

// @desc    Upload single image to Cloudinary
// @route   POST /api/upload
// @access  Private/Admin
export const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please attach an image file to upload' });
    }

    // Upload image buffer stream to Cloudinary
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'baby-store/products',
        resource_type: 'image'
      },
      (error, result) => {
        if (error) {
          console.error(`[Cloudinary Upload Error]: ${error.message}`);
          return res.status(500).json({ message: `Image upload failed: ${error.message}` });
        }
        return res.status(200).json({
          url: result.secure_url,
          public_id: result.public_id
        });
      }
    );

    uploadStream.end(req.file.buffer);
  } catch (error) {
    next(error);
  }
};
