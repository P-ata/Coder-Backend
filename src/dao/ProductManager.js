import mongoose from "mongoose";
import ProductsModel from "./models/ProductsModel";

class ProductManager {

  async getProducts() {
    try {
      // Consultar todos los productos desde la base de datos
      return await ProductsModel.find();
    } catch (error) {
      
      throw new Error('Error al cargar los productos desde la base de datos');
    }
  }

  async addProduct({ title, description, price, thumbnail, code, stock }) {
    try {
      
      if (!title || !description || !price || !thumbnail || !code || !stock) {
        throw new Error('Todos los campos son requeridos');
      }
  
      
      const existingProduct = await ProductsModel.findOne({ code });
      if (existingProduct) {
        throw new Error('El código de producto ya existe');
      }
  
      // Crear un nuevo producto utilizando el modelo ProductsModel
      const newProduct = new ProductsModel({
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
      });
      
      // Guardar el nuevo producto en la base de datos
      await newProduct.save();
  
      return newProduct;
    } catch (error) {
      
      throw error;
    }
  }
  

  async getProductById(id) {
    try {
      const foundProduct = await ProductsModel.findById(id);
      
      if (!foundProduct) {
        throw new Error('Producto no encontrado');
      }
  
      return foundProduct;
    } catch (error) {
      throw error;
    }
  }
  
  async updateProduct(id, updatedFields) {
    try {
      const foundProduct = await ProductsModel.findByIdAndUpdate(id, updatedFields, { new: true });
  
      if (!foundProduct) {
        throw new Error("Producto no encontrado");
      }
  
      return foundProduct; 
    } catch (error) {
      throw error;
    }
}

  async deleteProduct(id) {
    try {
        const deletedProduct = await ProductsModel.findByIdAndDelete(id);
        
        if (!deletedProduct) {
          throw new Error("Producto no encontrado");
        }

        return deletedProduct;
    } catch (error) {
       throw error;
    }
  }

}

module.exports=ProductManager

