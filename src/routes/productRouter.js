const express = require('express');
const router = express.Router();
const ProductsModel = require("../dao/models/ProductsModel");
const ProductManager = require("../dao/ProductManager");
const { getIO } = require("../io");

const productManagerInstance = new ProductManager();

router.get("/", async (req, res) => {
    try {
        let limit = req.query.limit; 
        let products = await productManagerInstance.getProducts();

        if (limit && !isNaN(limit) && parseInt(limit) > 0) {
            products = products.slice(0, parseInt(limit));
        }

        res.render("realTimeProducts", { products });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/:pid", async (req, res) => {
    if (!req.params.pid || isNaN(req.params.pid)) {
        return res.status(400).json({ error: "ID de producto inválido" });
    }

    const productId = parseInt(req.params.pid); 

    try {
        const product = await productManagerInstance.getProductById(productId);
        res.json(product);
    } catch (error) {
        res.status(404).json({ error: "Producto no encontrado" });
    }
});

router.post("/", async (req, res) => {
    try {
        const { title, description, price, thumbnail, code, stock } = req.body;

        if (!title || !description || !price || !thumbnail || !code || !stock) {
            throw new Error('Todos los campos son requeridos');
        }

        const existingProduct = await ProductsModel.findOne({ code });
        if (existingProduct) {
            throw new Error('El código de producto ya existe');
        }

        const newProduct = new ProductsModel({
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
        });

        const addedProduct = await productManagerInstance.addProduct(newProduct);
        getIO().emit("productAdded", addedProduct); // Usa getIO en lugar de io
        res.status(201).json(addedProduct);
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
        getIO().emit("productUpdated", updatedProduct); // Usa getIO en lugar de io
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
        getIO().emit("productDeleted", deletedProduct); // Usa getIO en lugar de io
        res.json(deletedProduct);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
