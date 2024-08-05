const express = require('express');
const CartManager = require('../dao/CartManager');
const cartRouter = express.Router();
const cartManagerInstance = new CartManager();


cartRouter.get('/', async (req, res) => {
    try {
        const carts = await cartManagerInstance.getAllCarts();
        res.render('carts', { carts });
    } catch (error) {
        res.status(500).send({ status: 'error', message: error.message });
    }
});


cartRouter.get('/:cid', async (req, res) => {
    const { cid } = req.params;
    try {
        const cart = await cartManagerInstance.getCartWithProducts(cid);
        res.render('cart', { cartId: cid, products: cart.products });
    } catch (error) {
        res.status(500).send({ status: 'error', message: error.message });
    }
});


cartRouter.post('/add', async (req, res) => {
    const { cartId, productId, quantity } = req.body;
    if (!cartId || !productId || !quantity) {
        return res.status(400).send({ status: 'error', message: 'Missing parameters' });
    }
    try {
        await cartManagerInstance.addProductToCart(cartId, productId, quantity);
        res.status(200).send({ status: 'success', message: 'Product added to cart' });
    } catch (error) {
        res.status(500).send({ status: 'error', message: error.message });
    }
});


cartRouter.put('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    if (!quantity || typeof quantity !== 'number' || quantity < 1) {
        return res.status(400).send({ status: 'error', message: 'Invalid quantity' });
    }
    try {
        await cartManagerInstance.updateProductQuantity(cid, pid, quantity);
        res.status(200).send({ status: 'success', message: 'Product quantity updated' });
    } catch (error) {
        console.error("Error al actualizar la cantidad del producto:", error);
        res.status(500).send({ status: 'error', message: error.message });
    }
});


cartRouter.delete('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    try {
        await cartManagerInstance.removeProductFromCart(cid, pid);
        res.status(200).send({ status: 'success', message: 'Product removed from cart' });
    } catch (error) {
        res.status(500).send({ status: 'error', message: error.message });
    }
});


cartRouter.delete('/:cid/products', async (req, res) => {
    const { cid } = req.params;
    try {
        await cartManagerInstance.removeAllProductsFromCart(cid);
        res.status(200).send({ status: 'success', message: 'All products removed from cart' });
    } catch (error) {
        res.status(500).send({ status: 'error', message: error.message });
    }
});


cartRouter.delete('/:cid', async (req, res) => {
    const { cid } = req.params;
    try {
        await cartManagerInstance.deleteCart(cid);
        res.status(200).send({ status: 'success', message: 'Cart deleted' });
    } catch (error) {
        res.status(500).send({ status: 'error', message: error.message });
    }
});

module.exports = cartRouter;
