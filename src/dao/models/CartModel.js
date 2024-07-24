import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
    cartId: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true },
    products: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true }
    }]
}, { 
    timestamps: true 
});

const CartModel = mongoose.model('Cart', cartSchema);
export default CartModel;
