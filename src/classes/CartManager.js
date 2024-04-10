const fs = require('fs');
const path = require('path');

class CartManager {
    constructor(filePath) {
        this.filePath = filePath;
        this.carts = this.loadCarts();
    }

    loadCarts() {
        try {
            const data = fs.readFileSync(this.filePath, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            // Si hay un error al leer el archivo o no existe, devolvemos un array vacío
            return [];
        }
    }

    saveCarts() {
        fs.writeFileSync(this.filePath, JSON.stringify(this.carts, null, 2), 'utf-8');
    }

    createCart() {
        const newCart = {
            id: this.generateId(), // Generar un ID único para el carrito
            products: [] // Array vacío para almacenar los productos del carrito
        };

        this.carts.push(newCart); // Agregar el nuevo carrito al array de carritos
        this.saveCarts(); // Guardar los cambios en el archivo
        return newCart; // Devolver el nuevo carrito creado
    }

    addProductToCart(cartId, productId, quantity) {
        if (!Number.isInteger(cartId) || cartId <= 0) {
            throw new Error("El ID del carrito debe ser un número entero positivo");
        }
    
        const cart = this.carts.find(cart => cart.id === cartId);
        if (!cart) {
            throw new Error("Carrito no encontrado");
        }
    
        const existingProductIndex = cart.products.findIndex(product => product.id === productId);
        if (existingProductIndex !== -1) {
            // Si el producto ya existe en el carrito, incrementar la cantidad
            cart.products[existingProductIndex].quantity += quantity;
            console.log(`Se agregaron ${quantity} unidades del producto ${productId} al carrito ${cartId}.`);
        } else {
            // Si el producto no existe en el carrito, agregarlo con la cantidad especificada
            cart.products.push({ id: productId, quantity });
            console.log(`Se agregaron ${quantity} unidades del producto ${productId} al carrito ${cartId}.`);
        }
    }
    

    getProductsInCart(cartId) {
        if (!Number.isInteger(cartId) || cartId <= 0) {
            throw new Error("El ID del carrito debe ser un número entero positivo");
        }

        const cart = this.carts.find(cart => cart.id === cartId);
        if (!cart) {
            throw new Error("Carrito no encontrado");
        }

        return cart.products;
    }

    getCartById(cartId) {
        return this.carts.find(cart => cart.id === cartId);
    }
    
    generateId() {
        // Generar un ID basado en la longitud actual del array de carritos
        return this.carts.length + 1;
    }
}

module.exports = CartManager;

