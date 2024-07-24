import { Router } from 'express';
import CartManager from '../dao/CartManager';
import { io } from '../app';

const router = Router();

const cartManagerInstance = new CartManager();

router.post("/", async (req, res) => {
    try {
        // Crear un nuevo carrito
        const newCart = await cartManagerInstance.createCart();

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

        // Validar que los ID del carrito y del producto sean válidos
        if (!mongoose.Types.ObjectId.isValid(cid) || !mongoose.Types.ObjectId.isValid(pid)) {
            throw new Error("Los ID del carrito y del producto deben ser válidos");
        }

        // Obtener el carrito con el ID proporcionado
        const cartId = parseInt(cid);
        const productId = parseInt(pid);
        const cart = await cartManagerInstance.getCartById(cartId);
        if (!cart) {
            throw new Error("Carrito no encontrado");
        }

        // Validar la cantidad del producto
        if (!Number.isInteger(quantity) || quantity <= 0) {
            throw new Error("La cantidad del producto debe ser un número entero positivo");
        }

        // Agregar el producto al carrito con la cantidad especificada
        await cartManagerInstance.addProductToCart(cartId, productId, quantity);

        res.status(200).json(cart); // Devolver el carrito actualizado
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

export default router;


