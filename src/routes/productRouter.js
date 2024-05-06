import { Router } from 'express';
export const router=Router()
const { io } = require('../app');

const ProductManager = require("../dao/ProductManager");


const productManagerInstance = new ProductManager();

router.get("/", async (req, res) => {
    try {
        let limit = req.query.limit; 
        let products = await productManagerInstance.getProducts();

        // Verificar si se proporcionó un límite y si es válido
        if (limit && !isNaN(limit) && parseInt(limit) > 0) {
            products = products.slice(0, parseInt(limit));
        }

        res.json(products);

        socket.emit("productList", products);

        res.render("pages", { body: "pages", products: products });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/:pid", async (req, res) => {
    try {
        // Verificar si se proporcionó el parámetro de la ruta ":pid"
        if (!req.params.pid || isNaN(req.params.pid)) {
            throw new Error("ID de producto inválido");
        }

        const productId = parseInt(req.params.pid); 

        const products = await productManagerInstance.getProductById(productId);

        socket.emit("productById", productId);
        
        res.json(products);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

router.post("/", async (req, res) => {
    try {
        const newProduct = await productManagerInstance.addProduct(req.body);

        console.log(`Producto creado exitosamente: ${newProduct}`);

        io.emit("productAdded", newProduct);

        res.status(201).json(newProduct);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


router.put("/:pid", async (req, res) => {
    try {
        const productId = parseInt(req.params.pid); 

        const updatedFields = req.body; // Obtener los campos actualizados del cuerpo de la solicitud

        // Verificar si se proporcionaron campos actualizados
        if (!Object.keys(updatedFields).length) {
            throw new Error("No se proporcionaron campos para actualizar");
        }

        const products = await productManagerInstance.getProductById(productId); // Verificar si el producto existe
        if (!products) {
            throw new Error("Producto no encontrado");
        }

        const updatedProduct = await productManagerInstance.updateProduct(productId, updatedFields);
        
        console.log(`Producto actualizado correctamente: ${updatedProduct}`);

        io.emit("productUpdated", updatedProduct);

        res.json(updatedProduct);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


router.delete("/:pid", async (req, res) => {
    try {
        const productId = parseInt(req.params.pid); 

        const products = await productManagerInstance.getProductById(productId); // Verificar si el producto existe
        if (!products) {
            throw new Error("Producto no encontrado");
        }

        const deletedProduct = await productManagerInstance.deleteProduct(productId);

        console.log(`Producto eliminado correctamente: ${deletedProduct}`);

        io.emit("productDeleted", deletedProduct);
        
        res.json(deletedProduct);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

