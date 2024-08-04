const { Router } = require('express');
const mongoose = require('mongoose');
const CartManager = require('../dao/CartManager');
const { getIO } = require('../io');  // Importar getIO

const router = Router();
const cartManagerInstance = new CartManager();

router.get("/", async (req, res) => {
    try {
        const carts = await cartManagerInstance.getAllCarts();
        res.status(200).json(carts);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get("/:cid", async (req, res) => {
    try {
        const cartId = req.params.cid;
        const products = await cartManagerInstance.getProductsInCart(cartId);
        res.json(products);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.post("/", async (req, res) => {
    try {
        const newCart = await cartManagerInstance.createCart();
        console.log(`Se creó el carrito con ID: ${newCart._id}`);
        getIO().emit("cartCreated", newCart); // Usa getIO().emit si es necesario
        res.status(201).json(newCart);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.post("/:cid/product/:pid", async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;

        if (!mongoose.Types.ObjectId.isValid(cid) || !mongoose.Types.ObjectId.isValid(pid)) {
            throw new Error("Los ID del carrito y del producto deben ser válidos");
        }

        const cart = await cartManagerInstance.getCartById(cid);
        if (!cart) {
            throw new Error("Carrito no encontrado");
        }

        if (!Number.isInteger(quantity) || quantity <= 0) {
            throw new Error("La cantidad del producto debe ser un número entero positivo");
        }

        await cartManagerInstance.addProductToCart(cid, pid, quantity);
        getIO().emit("productAddedToCart", { cartId: cid, productId: pid, quantity }); // Usa getIO().emit si es necesario
        res.status(200).json(cart);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
