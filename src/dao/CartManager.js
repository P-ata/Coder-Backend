const mongoose = require('mongoose');
const CartModel = require('./models/CartModel');
const ProductsModel = require('./models/ProductsModel');

class CartManager {
    async createCart(name) {
        const cartId = new mongoose.Types.ObjectId().toString();
        return await CartModel.create({ _id: cartId, name: name, products: [] });
    }

    async addProductToCart(cartId, productId, quantity) {
        try {
            let cart = await CartModel.findById(cartId);
            if (!cart) {
                throw new Error(`Cart with ID ${cartId} not found.`);
            }

            const product = await ProductsModel.findById(productId);
            if (!product) {
                throw new Error(`Product with ID ${productId} not found.`);
            }

            const existingProductIndex = cart.products.findIndex(p => p.product.equals(productId));
            if (existingProductIndex !== -1) {
                cart.products[existingProductIndex].quantity += quantity;
            } else {
                cart.products.push({ 
                    product: productId, 
                    name: product.title,
                    category: product.category,
                    quantity 
                });
            }

            await cart.save();
        } catch (error) {
            console.error("Error en addProductToCart:", error);
            throw error;
        }
    }

    async getAllCarts() {
        try {
            const carts = await CartModel.find().populate('products.product');
            return carts;
        } catch (error) {
            throw new Error("Error al obtener todos los carritos: " + error.message);
        }
    }

    async removeProductFromCart(cartId, productId) {
        const cart = await CartModel.findById(cartId);
        cart.products = cart.products.filter(product => !product.product.equals(productId));
        await cart.save();
    }

    async updateProductQuantity(cartId, productId, quantity) {
        const cart = await CartModel.findById(cartId);
        const productIndex = cart.products.findIndex(product => product.product.equals(productId));
        if (productIndex !== -1) {
            cart.products[productIndex].quantity = quantity;
            cart.products[productIndex].name = cart.products[productIndex].name || "Default Name";  
            cart.products[productIndex].category = cart.products[productIndex].category || "Default Category"; 
            await cart.save();
        } else {
            throw new Error('Product not found in cart');
        }
    }

    async removeAllProductsFromCart(cartId) {
        const cart = await CartModel.findById(cartId);
        cart.products = [];
        await cart.save();
    }

    async deleteCart(cartId) {
        await CartModel.findByIdAndDelete(cartId);
    }

    async getCartWithProducts(cid) {
        try {
            const cart = await CartModel.findById(cid).populate('products.product');
            return cart;
        } catch (error) {
            throw new Error("Error al obtener el carrito con productos: " + error.message);
        }
    }
}

module.exports = CartManager;
