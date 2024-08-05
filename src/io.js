const { Server } = require('socket.io');
const ProductsModel = require('./dao/models/ProductsModel');
const ProductManager = require('./dao/ProductManager');
const CartManager = require('./dao/CartManager');
const cartManagerInstance = new CartManager();
const productManagerInstance = new ProductManager();

let io;

function init(server) {
    io = new Server(server);

    io.on('connection', (socket) => {
        console.log('Nuevo cliente conectado');

        socket.on('addProduct', async (newProductData) => {
            try {
                const newProduct = new ProductsModel(newProductData);
                const addedProduct = await productManagerInstance.addProduct(newProduct);
                const categories = await ProductsModel.distinct("category");
                io.emit('productAdded', addedProduct);
                io.emit('categoriesUpdated', categories);
            } catch (error) {
                console.error("Error al agregar producto:", error.message);
            }
        });

        socket.on('deleteProduct', async (productId) => {
            try {
                const product = await ProductsModel.findByIdAndDelete(productId);
                const remainingProducts = await ProductsModel.find({ category: product.category });
                const categories = await ProductsModel.distinct("category");

                if (remainingProducts.length === 0) {
                    io.emit('categoryEmpty', product.category);
                }

                io.emit('productDeleted', productId, product.category);
                io.emit('categoriesUpdated', categories);
            } catch (error) {
                console.error("Error al eliminar producto:", error.message);
            }
        });

        socket.on('editProduct', async (updatedProductData) => {
            try {
                const { productId, title, description, price, category, stock, image } = updatedProductData;
                const oldProduct = await ProductsModel.findById(productId);
                const updatedProduct = await ProductsModel.findByIdAndUpdate(productId, {
                    title, description, price, category, stock, image
                }, { new: true });

                io.emit('productUpdated', updatedProduct);

                if (oldProduct.category !== category) {
                    const remainingProducts = await ProductsModel.find({ category: oldProduct.category });
                    if (remainingProducts.length === 0) {
                        io.emit('categoryEmpty', oldProduct.category);
                    }
                    const categories = await ProductsModel.distinct("category");
                    io.emit('categoriesUpdated', categories);
                }
            } catch (error) {
                console.error("Error al editar producto:", error.message);
            }
        });

        socket.on('checkCategoryEmpty', async (category) => {
            try {
                const remainingProducts = await ProductsModel.find({ category });
                if (remainingProducts.length === 0) {
                    io.emit('categoryEmpty', category);
                    const categories = await ProductsModel.distinct("category");
                    io.emit('categoriesUpdated', categories);
                }
            } catch (error) {
                console.error("Error al verificar categoría vacía:", error.message);
            }
        });

        // Manejo de carritos
        socket.on('createCart', async ({ name }) => {
            try {
                const newCart = await cartManagerInstance.createCart(name);
                io.emit('cartCreated', newCart);
            } catch (error) {
                console.error("Error al crear carrito:", error.message);
            }
        });

        socket.on('addToCart', async ({ cartId, productId, quantity }) => {
            try {
                const updatedCart = await cartManagerInstance.addProductToCart(cartId, productId, quantity);
                io.emit('cartUpdated', updatedCart);
            } catch (error) {
                console.error("Error al agregar producto al carrito:", error.message);
            }
        });

        socket.on('deleteFromCart', async ({ cartId, productId }) => {
            try {
                const updatedCart = await cartManagerInstance.removeProductFromCart(cartId, productId);
                io.emit('cartUpdated', updatedCart);
            } catch (error) {
                console.error("Error al eliminar producto del carrito:", error.message);
            }
        });

        socket.on('updateCartProduct', async ({ cartId, productId, quantity }) => {
            try {
                const updatedCart = await cartManagerInstance.updateProductQuantity(cartId, productId, quantity);
                io.emit('cartUpdated', updatedCart);
            } catch (error) {
                console.error("Error al actualizar la cantidad del producto en el carrito:", error.message);
            }
        });

        socket.on('clearCart', async (cartId) => {
            try {
                await cartManagerInstance.removeAllProductsFromCart(cartId);
                io.emit('cartCleared', cartId);
            } catch (error) {
                console.error("Error al vaciar el carrito:", error.message);
            }
        });

        socket.on('deleteCart', async (cartId) => {
            try {
                await cartManagerInstance.deleteCart(cartId);
                io.emit('cartDeleted', cartId);
            } catch (error) {
                console.error("Error al eliminar el carrito:", error.message);
            }
        });
    });
}

function getIO() {
    if (!io) {
        throw new Error('Socket.io not initialized!');
    }
    return io;
}

module.exports = { init, getIO };
