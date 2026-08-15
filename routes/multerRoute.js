const router = require('express').Router();
const multerUpload = require('../config/multerConfig');
const cloudinary = require('../config/cloudinary');
const Blog = require('../schema/blogSchema');
const fs = require('fs');


router.post('/single', multerUpload.single('image'), async (req, res) => {
  const { title, description, size, cost } = req.body;

  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file uploaded' });
    }

    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path);
    
    // Delete temporary file from your server
    fs.unlinkSync(req.file.path);
    //optimize image
    const optimizedUrl = cloudinary.url(result.public_id, {
        fetch_format: "auto",
        quality: "auto"
    });
    // Save to MongoDB
    const data = await Blog.create({
      title,
      description,
      size,
      cost,
      featuredImage: optimizedUrl,
      image_id: result.public_id
    });

    res.status(200).json(data);
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
});


router.post('/multiple', multerUpload.array('images', 3), async (req, res) => {
    const {title, description, cost, size} = req.body;
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'No files uploaded' });
        }

        const uploadPromises = req.files.map(file =>
            cloudinary.uploader.upload(file.path)
        );

        
        const results = await Promise.all(uploadPromises);
        // Delete temporary Multer files
        req.files.forEach(file => {
            fs.unlinkSync(file.path);
        });
        const imageUrls = results.map(result =>
            cloudinary.url(result.public_id, {
                fetch_format: "auto",
                quality: "auto"
            })
        );
        const imageIds = results.map(r => r.public_id);
        const data = await Blog.create({title, cost, size, description, featuredImage: imageUrls, image_id: imageIds});
        res.status(200).json(data);
        

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Upload failed', error: err.message });
    }
});


module.exports=router;