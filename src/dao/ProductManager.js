import mongoose from "mongoose";
import ProductsModel from "./models/ProductsModel";

class ProductManager {

  async getProducts() {
    return await ProductsModel.find(); 
  }

  async addProduct(newProduct) {
    return await newProduct.save();
  } 
  
  async getProductById(id) {
    return await ProductsModel.findById(id);
  }

  async updateProduct(id, updatedFields) {
    return await ProductsModel.findByIdAndUpdate(id, updatedFields, { new: true });
  }

  async deleteProduct(id) {
    return await ProductsModel.findByIdAndDelete(id);
  }

}

module.exports=ProductManager

