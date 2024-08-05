const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { engine } = require("express-handlebars");
const mongoose = require("mongoose");
const productRouter = require("./routes/productRouter");
const realTimeProductsRouter = require("./routes/realTimeProductsRouter");
const cartRouter = require("./routes/cartRouter");
const { init, getIO } = require("./io");
const ProductManager = require("./dao/ProductManager");
const ProductsModel = require("./dao/models/ProductsModel");

const PORT = 3000;

const app = express();
const server = http.createServer(app);

init(server);

const io = getIO();
const productManagerInstance = new ProductManager();

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
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.engine("handlebars", engine({
  defaultLayout: 'main',
  layoutsDir: './src/views/layouts',
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
  }
}));
app.set("view engine", "handlebars");
app.set("views", "./src/views");

app.use("/api/products", productRouter);
app.use("/api/realtimeproducts", realTimeProductsRouter);
app.use("/api/carts", cartRouter);

app.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/plain');
    res.status(200).send('OK');
});


app.use((req, res, next) => {
    res.status(404).send("File not found");
});

server.listen(PORT, () => console.log(`Servidor en línea en el puerto ${PORT}`));

const connDB = async () => {
    try {
        await mongoose.connect(
            "mongodb+srv://Briar:Panchardium00.@cluster0.qbpticw.mongodb.net/ecommerce",
        );
        console.log("Conexión a la base de datos 'ecommerce' establecida");
    } catch (error) {
        console.log("Error al conectar a DB", error.message);
    }
};

connDB();
