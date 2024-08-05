const express = require('express');
const ProductsModel = require("../dao/models/ProductsModel");

const router = express.Router();

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

        res.render("index", {
            products: docs,
            categories,
            totalPages,
            prevPage,
            nextPage,
            page: parseInt(page, 10),
            hasPrevPage,
            hasNextPage,
            prevLink: hasPrevPage ? `/api/products?page=${prevPage}&limit=${limit}${sort ? `&sort=${sort}` : ''}${query ? `&query=${query}` : ''}${stockRange ? `&stockRange=${stockRange}` : ''}` : null,
            nextLink: hasNextPage ? `/api/products?page=${nextPage}&limit=${limit}${sort ? `&sort=${sort}` : ''}${query ? `&query=${query}` : ''}${stockRange ? `&stockRange=${stockRange}` : ''}` : null
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
