import mongoose from "mongoose";
import CartModel from "./models/CartModel";

class CartManager {

    async createCart() {
        try {
            // Crear un nuevo carrito vacío
            const newCart = await CartModel.create({ products: [] });
            return newCart;
        } catch (error) {
            throw new Error("Error al crear el carrito: " + error.message);
        }
    }

    async addProductToCart(cartId, productId, quantity) {
        try {
            if (!mongoose.Types.ObjectId.isValid(cartId)) {
                throw new Error("El ID del carrito no es válido");
            }
    
            const cart = await CartModel.findById(cartId);
            if (!cart) {
                throw new Error("Carrito no encontrado");
            }
    
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
        } catch (error) {
            throw error;
        }
    }
    
    async getProductsInCart(cartId) {
        if (!Number.isInteger(cartId) || cartId <= 0) {
            throw new Error("El ID del carrito debe ser un número entero positivo");
        }

        try {
            const cart = await CartModel.findById(cartId);
            if (!cart) {
                throw new Error("Carrito no encontrado");
            }

            return cart.products;
        } catch (error) {
            throw error;
        }
    }

    async getCartById(cartId) {
        if (!Number.isInteger(cartId) || cartId <= 0) {
            throw new Error("El ID del carrito debe ser un número entero positivo");
        }

        try {
            const cart = await CartModel.findById(cartId);
            if (!cart) {
                throw new Error("Carrito no encontrado");
            }

            return cart;
        } catch (error) {
            throw error;
        }
    }

    async getProductByIdInCart(cartId, productId) {
        if (!Number.isInteger(cartId) || cartId <= 0 || !mongoose.Types.ObjectId.isValid(productId)) {
            throw new Error("Los IDs del carrito y del producto deben ser números enteros positivos y válidos");
        }
    
        try {
            const cart = await CartModel.findById(cartId);
            if (!cart) {
                throw new Error("Carrito no encontrado");
            }
    
            const product = cart.products.find(product => product.productId.equals(productId));
            if (!product) {
                throw new Error("Producto no encontrado en el carrito");
            }
    
            return product;
        } catch (error) {
            throw error;
        }
    }
      
}

module.exports = CartManager;

