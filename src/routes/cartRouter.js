import { Router } from 'express';
import path from 'path';
import CartManager from '../classes/CartManager';

const router = Router();

const cartFilePath = path.join(__dirname, '..', 'data', 'cart.json');
const cartManagerInstance = new CartManager(cartFilePath);

router.post("/", async (req, res) => {
    try {
        // Crear un nuevo carrito
        const newCart = cartManagerInstance.createCart();

        console.log(`Se creó el carrito con ID: ${newCart.id}`);

        res.status(201).json(newCart); // Devolver el nuevo carrito creado
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get("/:cid", async (req, res) => {
    try {
        const cartId = req.params.cid;

        // Obtener los productos del carrito
        const products = cartManagerInstance.getProductsInCart(cartId);

        res.json(products);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.post("/:cid/product/:pid", async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;

        if (!Number.isInteger(parseInt(cid)) || !Number.isInteger(parseInt(pid))) {
            throw new Error("Los ID del carrito y del producto deben ser números enteros positivos");
        }

        if (!Number.isInteger(quantity) || quantity <= 0) {
            throw new Error("La cantidad debe ser un número entero positivo");
        }

        // Obtener el carrito con el ID proporcionado
        const cartId = parseInt(cid);
        const productId = parseInt(pid);
        const cart = await cartManagerInstance.getCartById(cartId);
        if (!cart) {
            throw new Error("Carrito no encontrado");
        }

        // Agregar el producto al carrito con la cantidad especificada
        cartManagerInstance.addProductToCart(cartId, productId, quantity);

        res.status(200).json(cart); // Devolver el carrito actualizado
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

export default router;


