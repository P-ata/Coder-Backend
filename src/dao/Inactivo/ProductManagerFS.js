const fs = require("fs");
const path=require("path")

class ProductManager {
  constructor(filePath) {
    this.path = filePath;
    this.products = this.loadProducts();
  }

  generateId() {
    // Esta función genera un id único basado en la longitud actual del array
    return this.products.length + 1;
  }

  loadProducts() {
    try {
      const data = fs.readFileSync(this.path, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      // Si el archivo no existe o está vacío, se devuelve un array vacío
      return [];
    }
  }

  saveProducts() {
    // Guarda los productos en el archivo
    fs.writeFileSync(this.path, JSON.stringify(this.products, null, 2), "utf-8");
  }

  getProducts() {
    return this.products;
  }

  addProduct({ title, description, price, thumbnail, code, stock }) {
    
    // Validación de los campos requeridos (corregido)
    if (!title || !description || !price || !thumbnail || !code || !stock) {
      throw new Error('Todos los campos son requeridos');
    }
    
    if (this.products.some(product => product.code === code)) {
      throw new Error("El código de producto ya existe");
    }

    const newProduct = {
      id: this.generateId(),
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    };

    this.products.push(newProduct);
    this.saveProducts(); // Guarda los productos después de agregar uno nuevo
    return newProduct;
  }

  getProductById(id) {
    const product = this.products.find(product => product.id === id);

    if (!product) {
      throw new Error("Producto no encontrado");
    }

    return product;
  }

  updateProduct(id, updatedFields) {
    const index = this.products.findIndex(product => product.id === id);

    if (index === -1) {
      throw new Error("Producto no encontrado");
    }

    // Actualiza los campos especificados sin cambiar el id
    this.products[index] = { ...this.products[index], ...updatedFields };

    this.saveProducts(); // Guarda los productos después de actualizar
    return this.products[index];
  }

  deleteProduct(id) {
    const index = this.products.findIndex(product => product.id === id);

    if (index === -1) {
      throw new Error("Producto no encontrado");
    }

    // Elimina el producto con el id especificado
    const deletedProduct = this.products.splice(index, 1)[0];

    this.saveProducts(); // Guarda los productos después de eliminar
    return deletedProduct;
  }
}

module.exports=ProductManager
