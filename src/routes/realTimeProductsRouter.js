const express = require('express');
const router = express.Router();
const ProductsModel = require("../dao/models/ProductsModel");

router.get("/", async (req, res) => {
    try {
        const { limit = 5, page = 1, sort, query, stockRange } = req.query;

        const options = {
            page: parseInt(page, 10),
            limit: parseInt(limit, 10),
            sort: sort ? { price: sort === 'asc' ? 1 : -1 } : undefined,
        };

        let queryObj = {};
        
        if (query) {
            queryObj.category = query;
        }
        
        if (stockRange) {
            const [min, max] = stockRange.split('-').map(Number);
            queryObj.stock = { $gte: min, $lte: max };
        }

        const result = await ProductsModel.paginate(queryObj, options);
        const categories = await ProductsModel.distinct("category");

        const { docs, totalPages, hasNextPage, hasPrevPage, nextPage, prevPage } = result;

        res.render("realTimeProducts", {
            products: docs,
            categories,
            totalPages,
            prevPage,
            nextPage,
            page: parseInt(page, 10),
            hasPrevPage,
            hasNextPage,
            prevLink: hasPrevPage ? `/api/realtimeproducts?page=${prevPage}&limit=${limit}${sort ? `&sort=${sort}` : ''}${query ? `&query=${query}` : ''}${stockRange ? `&stockRange=${stockRange}` : ''}` : null,
            nextLink: hasNextPage ? `/api/realtimeproducts?page=${nextPage}&limit=${limit}${sort ? `&sort=${sort}` : ''}${query ? `&query=${query}` : ''}${stockRange ? `&stockRange=${stockRange}` : ''}` : null
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post("/edit", async (req, res) => {
    try {
        const { productId, title, description, price, category, stock, image } = req.body;
        const updatedProduct = await ProductsModel.findByIdAndUpdate(productId, {
            title, description, price, category, stock, image
        }, { new: true });
        if (updatedProduct) {
            req.io.emit('productUpdated', updatedProduct);
            res.status(200).json({ status: 'success', message: 'Product updated', product: updatedProduct });
        } else {
            res.status(404).json({ status: 'error', message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

module.exports = router;
