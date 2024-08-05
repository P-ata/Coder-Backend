const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartSchema = new Schema({
    _id: { type: String, required: true },
    name: { type: String, required: true },
    products: [
        {
            product: { type: Schema.Types.ObjectId, ref: 'Products' },
            name: { type: String, required: true },
            category: { type: String, required: true },
            quantity: { type: Number, required: true }
        }
    ]
}, {
    timestamps: true
});

const CartModel = mongoose.model('Cart', cartSchema);
module.exports = CartModel;
