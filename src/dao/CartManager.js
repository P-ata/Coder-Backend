import mongoose from "mongoose";
import CartModel from "./models/CartModel";

class CartManager {

    async createCart() {
        // Crear un nuevo carrito vacío
        return await CartModel.create({ products: [] });
    }

    async addProductToCart(cartId, productId, quantity) {
        const cart = await CartModel.findById(cartId);
    
        const existingProductIndex = cart.products.findIndex(product => product.productId.equals(productId));
        if (existingProductIndex !== -1) {
            // Si el producto ya existe en el carrito, incrementar la cantidad
            cart.products[existingProductIndex].quantity += quantity;
            console.log(`Se agregaron ${quantity} unidades del producto ${productId} al carrito ${cartId}.`);
        } else {
            // Si el producto no existe en el carrito, agregarlo con la cantidad especificada
            cart.products.push({ productId, quantity });
            console.log(`Se agregaron ${quantity} unidades del producto ${productId} al carrito ${cartId}.`);
        }
    
        await cart.save();
    }
    
    async getProductsInCart(cartId) {
        return await CartModel.findById(cartId).select('products');
    }

    async getCartById(cartId) {
        return await CartModel.findById(cartId);
    }

    async getProductByIdInCart(cartId, productId) {
        const cart = await CartModel.findById(cartId);
        const product = cart.products.find(product => product.productId.equals(productId));
        return product;
    }
    
      
}

module.exports = CartManager;

