const mongoose = require('mongoose');

const productsCollection = "products"; 
const productsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  thumbnail: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  stock: { type: Number, required: true },
  image: { type: String, required: true } 
},
{
    timestamps: true,
});

const ProductsModel = mongoose.model(productsCollection, productsSchema);
module.exports = ProductsModel;
