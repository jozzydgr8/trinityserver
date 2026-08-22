const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    link: {
      type: String,
      required: true,
    
    },
    featuredImage: {
      type: String,
      required: true,
    },
   
    description: {
      type: String,
      required: true,
    },

    image_id: {
      type: String,
      required: true,
    },
    category:{
      type: String,
      required: true,
    }
  },
  {
    timestamps: true, // adds createdAt & updatedAt automatically (Date type)
  }
);

module.exports = mongoose.model('Product', productSchema);