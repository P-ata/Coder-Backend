const express = require('express');
const router = express.Router();
const path = require('path');
const { io } = require('../app');
const ProductManager = require("../classes/ProductManager");

const productFilePath = path.join(__dirname, '..', 'data', 'products.json');
const productManagerInstance = new ProductManager(productFilePath);

router.get('/', async (req, res) => {
    try {
        const products = await productManagerInstance.getProducts();
        res.render('realTimeProducts', { products });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post("/", async (req, res) => {
    try {
        const { title, description, price, code, stock, category, thumbnails } = req.body;

        if (!title || !description || !price || !code || !stock || !category) {
            throw new Error('Todos los campos son requeridos, excepto "thumbnails"');
        }

        const newProduct = await productManagerInstance.addProduct({
            title,
            description,
            price,
            code,
            stock,
            category,
            thumbnails: thumbnails || [],
            status: true
        });

        console.log(`Producto creado exitosamente: ${newProduct}`);

        // Emitir evento de WebSocket con los productos actualizados
        io.emit('productAdded', newProduct);

        res.status(201).json(newProduct);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.put("/:pid", async (req, res) => {
    try {
        const productId = parseInt(req.params.pid);
        const updatedFields = req.body;

        if (!Object.keys(updatedFields).length) {
            throw new Error("No se proporcionaron campos para actualizar");
        }

        const product = await productManagerInstance.getProductById(productId);
        if (!product) {
            throw new Error("Producto no encontrado");
        }

        const updatedProduct = await productManagerInstance.updateProduct(productId, updatedFields);

        console.log(`Producto actualizado correctamente: ${updatedProduct}`);

        // Emitir evento de WebSocket con el producto actualizado
        io.emit('productUpdated', updatedProduct);

        res.json(updatedProduct);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.delete("/:pid", async (req, res) => {
    try {
        const productId = parseInt(req.params.pid);

        const product = await productManagerInstance.getProductById(productId);
        if (!product) {
            throw new Error("Producto no encontrado");
        }

        const deletedProduct = await productManagerInstance.deleteProduct(productId);

        console.log(`Producto eliminado correctamente: ${deletedProduct}`);

        // Emitir evento de WebSocket con el producto eliminado
        io.emit('productDeleted', deletedProduct);

        res.json(deletedProduct);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
