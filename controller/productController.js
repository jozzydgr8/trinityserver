const Product = require('../schema/ProductSchema');
const cloudinary = require('../config/cloudinary');
const mongoose = require('mongoose');

const getProduct = async(req,res)=>{
    try{
        const fetchProduct = await Product.find({});
        res.status(200).json(fetchProduct);
    }catch(error){
        res.status(400).json({message: error.message});
    }
}
const createProduct = async (req, res) => {
  const { title,  description, link, category } = req.body;

  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file uploaded' });
    }


    // 2. Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path);

    // 3. Ensure Cloudinary properties exist
    if (!result || !result.public_id) {
      return res.status(500).json({ message: 'Cloudinary upload failed to yield public_id' });
    }

    // 4. Create the new Product post
    const data = await Product.create({
      title,
      description,
      link,
      category,
      featuredImage: result.secure_url,
      image_id: result.public_id, 
    });

    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateProduct = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: 'Product not found' });
  }

  try {
    const ProductToUpdate = await Product.findById(id);
    if (!ProductToUpdate) {
      return res.status(404).json({ message: 'Product not found' });
    }

   

    // 3. Handle Cloudinary image replacement if a new file is uploaded
    if (req.file) {
      // Only destroy the old image if image_id exists
      if (ProductToUpdate.image_id) {
        await cloudinary.uploader.destroy(ProductToUpdate.image_id);
      }
      const result = await cloudinary.uploader.upload(req.file.path);
      req.body.featuredImage = result.secure_url;
      req.body.image_id = result.public_id;
    }

    // 4. Perform the update
    const updatedProduct = await Product.findOneAndUpdate({ _id: id }, req.body, { new: true });
    
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



const deleteProduct = async(req,res)=>{
    const {id} = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({message: 'Product not found'});
    }try{
        
        const deleteProduct = await Product.findById(id);
        if(!deleteProduct){
            return res.status(404).json({message: 'Product not found'});
        }
        await cloudinary.uploader.destroy(deleteProduct.image_id);

        await deleteProduct.deleteOne();
        res.status(200).json({message: 'Product deleted successfully'});
    
    }catch(error){
        res.status(500).json({message: error.message});
    }
}

module.exports ={getProduct, createProduct, updateProduct, deleteProduct}