const express = require("express");
const ProductManager = require("./classes/ProductManager");

const PORT = 3000;
const app = express();

const productManagerInstance = new ProductManager("./src/data/products.json");

app.get("/products", async (req, res) => {
    try {
        let productos = await productManagerInstance.getProducts();
        res.json(productos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }


});

app.get("/products", async (req, res) => {
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

app.get("/products/:id", async (req, res) => {
    try {
        const productId = req.params.id; // Obtener el ID del parámetro de ruta
        const product = await productManagerInstance.getProductById(productId);
        
        res.json(product);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});


app.listen(PORT, () => console.log(`Servidor en línea en el puerto ${PORT}`));
