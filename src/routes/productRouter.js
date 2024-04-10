import { Router } from 'express';
export const router=Router()

const ProductManager = require("../classes/ProductManager");

const productFilePath = path.join(__dirname, '..', 'data', 'products.json');
const productManagerInstance = new ProductManager(productFilePath);

router.get("/", async (req, res) => {
    try {
        let limit = req.query.limit; 
        let productos = await productManagerInstance.getProducts();

        // Verificar si se proporcionó un límite y si es válido
        if (limit && !isNaN(limit) && parseInt(limit) > 0) {
            productos = productos.slice(0, parseInt(limit));
        }

        res.json(productos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/:pid", async (req, res) => {
    try {
        // Verificar si se proporcionó el parámetro de la ruta ":id"
        if (!req.params.id || isNaN(req.params.pid)) {
            throw new Error("ID de producto inválido");
        }

        const productId = parseInt(req.params.id); 

        const product = await productManagerInstance.getProductById(productId);
        
        res.json(product);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

router.post("/", async (req, res) => {
    try {
        const { title, description, price, code, stock, category, thumbnails } = req.body;

        // Asegurar que se proporcionen todos los campos requeridos
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
            thumbnails: thumbnails || [], // Si no se proporciona, se establece como un array vacío
            status: true // Establecer el estado como true por defecto
        });

        console.log(`Producto creado exitosamente: ${newProduct}`);

        res.status(201).json(newProduct); // Devolver el nuevo producto creado
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

        const product = await productManagerInstance.getProductById(productId); // Verificar si el producto existe
        if (!product) {
            throw new Error("Producto no encontrado");
        }

        const updatedProduct = await productManagerInstance.updateProduct(productId, updatedFields);
        
        console.log(`Producto actualizado correctamente: ${updatedProduct}`);

        res.json(updatedProduct);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


router.delete("/:pid", async (req, res) => {
    try {
        const productId = parseInt(req.params.pid); 

        const product = await productManagerInstance.getProductById(productId); // Verificar si el producto existe
        if (!product) {
            throw new Error("Producto no encontrado");
        }

        const deletedProduct = await productManagerInstance.deleteProduct(productId);

        console.log(`Producto eliminado correctamente: ${deletedProduct}`);
        
        res.json(deletedProduct);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});
