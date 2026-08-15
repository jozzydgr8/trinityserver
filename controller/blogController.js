const Blog = require('../schema/blogSchema');
const cloudinary = require('../config/cloudinary');
const mongoose = require('mongoose');

const getBlog = async(req,res)=>{
    try{
        const fetchBlog = await Blog.find({});
        res.status(200).json(fetchBlog);
    }catch(error){
        res.status(400).json({message: error.message});
    }
}
const createBlog = async (req, res) => {
  const { title,  excerpt, readingTime, featured } = req.body;

  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file uploaded' });
    }

    // Convert incoming string "true"/"false" to actual Boolean
    const isFeatured = featured === 'true';

    // 1. If this new blog is featured, reset all other blogs first
    if (isFeatured) {
      await Blog.updateMany({}, { featured: false });
    }

    // 2. Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path);

    // 3. Ensure Cloudinary properties exist
    if (!result || !result.public_id) {
      return res.status(500).json({ message: 'Cloudinary upload failed to yield public_id' });
    }

    // 4. Create the new blog post
    const data = await Blog.create({
      title,
      excerpt,
      readingTime,
      featured: isFeatured, 
      featuredImage: result.secure_url,
      image_id: result.public_id, 
    });

    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateBlog = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: 'Blog not found' });
  }

  try {
    const blogToUpdate = await Blog.findById(id);
    if (!blogToUpdate) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // 1. Handle featured string-to-boolean conversion if it's in the request body
    if (req.body.featured !== undefined) {
      req.body.featured = req.body.featured === 'true';
    }

    // 2. If this blog is being set as featured, reset all other blogs first
    if (req.body.featured === true) {
      // Exclude the current blog from being reset, just in case, 
      // though the subsequent findOneAndUpdate will set it to true anyway.
      await Blog.updateMany({ _id: { $ne: id } }, { featured: false });
    }

    // 3. Handle Cloudinary image replacement if a new file is uploaded
    if (req.file) {
      // Only destroy the old image if image_id exists
      if (blogToUpdate.image_id) {
        await cloudinary.uploader.destroy(blogToUpdate.image_id);
      }
      const result = await cloudinary.uploader.upload(req.file.path);
      req.body.featuredImage = result.secure_url;
      req.body.image_id = result.public_id;
    }

    // 4. Perform the update
    const updatedBlog = await Blog.findOneAndUpdate({ _id: id }, req.body, { new: true });
    
    res.status(200).json(updatedBlog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateLikes = async (req, res) => {
  const { id } = req.params;
  const { action } = req.body; // Expecting "increment" or "decrement"

  // 1. Validate the Blog ID format
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: 'Blog not found' });
  }

  // 2. Validate the action type
  if (action !== 'increment' && action !== 'decrement') {
    return res.status(400).json({ message: 'Invalid action. Must be "increment" or "decrement"' });
  }

  try {
    // 3. Determine the numerical change based on the action
    const incValue = action === 'increment' ? 1 : -1;

    // 4. Update the likes count directly using MongoDB's $inc operator
    // We also use $max to ensure the likes counter never drops below 0
    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      { $inc: { likes: incValue } },
      { new: true }
    );

    if (!updatedBlog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Safety check: If a decrement pushed it below 0, reset it to 0 and save
    if (updatedBlog.likes < 0) {
      updatedBlog.likes = 0;
      await updatedBlog.save();
    }

    res.status(200).json(updatedBlog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const updateShareCount = async (req, res) => {
  const { id } = req.params;

  // 1. Validate the Blog ID format
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: 'Blog not found' });
  }

  try {
    // 2. Direct atomic increment by 1
    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      { $inc: { shareCount: 1 } },
      { new: true }
    )

    if (!updatedBlog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // 3. Return the updated blog document
    res.status(200).json(updatedBlog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const deleteBlog = async(req,res)=>{
    const {id} = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({message: 'Blog not found'});
    }try{
        
        const deleteBlog = await Blog.findById(id);
        if(!deleteBlog){
            return res.status(404).json({message: 'Blog not found'});
        }
        await cloudinary.uploader.destroy(deleteBlog.image_id);

        await deleteBlog.deleteOne();
        res.status(200).json({message: 'Blog deleted successfully'});
    
    }catch(error){
        res.status(500).json({message: error.message});
    }
}

module.exports ={getBlog, createBlog, updateBlog, deleteBlog, updateLikes, updateShareCount}