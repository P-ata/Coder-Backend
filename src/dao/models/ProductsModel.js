const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const productsSchema = new mongoose.Schema({
    id: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
        unique: true
    },
    title: String,
    price: Number,
    description: String,
    category: String,
    image: String,
    stock: Number
});

productsSchema.plugin(mongoosePaginate);

const ProductsModel = mongoose.model('Products', productsSchema);

module.exports = ProductsModel;
