const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { engine } = require("express-handlebars");
const mongoose = require("mongoose");
const productRouter = require("./routes/productRouter");
const cartRouter = require("./routes/cartRouter");
const { init, getIO } = require("./io");

const PORT = 3000;

const app = express();
const server = http.createServer(app);

init(server); 

const io = getIO();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./public"));

app.engine("handlebars", engine({
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
  }
}));
app.set("view engine", "handlebars");
app.set("views", "./src/views");

app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);

app.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/plain');
    res.status(200).send('OK');
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
