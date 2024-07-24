import { Router } from 'express';
import { io } from '../app';
import ProductsModel from "./models/ProductsModel";
import ProductManager from "../dao/ProductManager";
export const router = Router();


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
    // Verificar si se proporcionó el parámetro de la ruta ":pid"
    if (!req.params.pid || isNaN(req.params.pid)) {
        return res.status(400).json({ error: "ID de producto inválido" });
    }

    const productId = parseInt(req.params.pid); 

    try {
        const product = await productManagerInstance.getProductById(productId);

        socket.emit("productById", productId);
        
        res.json(product);
    } catch (error) {
        res.status(404).json({ error: "Producto no encontrado" });
    }
});

router.post("/", async (req, res) => {
    try {
        const { title, description, price, thumbnail, code, stock } = req.body;

        // Validar que todos los campos estén presentes
        if (!title || !description || !price || !thumbnail || !code || !stock) {
            throw new Error('Todos los campos son requeridos');
        }

        // Validar que el código del producto no exista previamente
        const existingProduct = await ProductsModel.findOne({ code });
        if (existingProduct) {
            throw new Error('El código de producto ya existe');
        }

        // Crear un nuevo producto utilizando el modelo ProductsModel
        const newProduct = new ProductsModel({
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
        });

        // Guardar el nuevo producto en la base de datos
        await productManagerInstance.addProduct(newProduct);

        console.log(`Producto agregado correctamente: ${newProduct}`);

        io.emit("productAdded", newProduct);

        res.status(201).json(newProduct);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.put("/:pid", async (req, res) => {
    try {
        const productId = parseInt(req.params.pid); 
        const updatedFields = req.body;

        // Verificar si se proporcionaron campos actualizados
        if (!Object.keys(updatedFields).length) {
            throw new Error("No se proporcionaron campos para actualizar");
        }

        // Obtener el producto
        const product = await productManagerInstance.getProductById(productId);
        if (!product) {
            throw new Error("Producto no encontrado");
        }

        // Actualizar el producto
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

        const products = await productManagerInstance.getProductById(productId); 
        if (!products) {
            throw new Error("Producto no encontrado");
        }

        const deletedProduct = await productManagerInstance.deleteProduct(productId);

        if (!deletedProduct) {
            throw new Error("Error al eliminar el producto");
        }

        console.log(`Producto eliminado correctamente: ${deletedProduct}`);

        io.emit("productDeleted", deletedProduct);
        
        res.json(deletedProduct);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


