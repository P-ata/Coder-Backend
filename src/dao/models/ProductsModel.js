const mongoose = require('mongoose');

const productsCollection = "products"; 
const productsSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  thumbnail: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  stock: { type: Number, required: true }
},
{
    timestamps: true,
});

export default mongoose.model(productsCollection, productsSchema);