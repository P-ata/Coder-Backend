const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
import { engine } from "express-handlebars";
import mongoose from "mongoose";

const productRouter = require("./routes/productRouter")
const cartRouter = require("./routes/cartRouter")
const realTimeProductsRouter = require('./routes/realTimeProductsRouter');

const PORT = 3000;

const app = express();

const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static("./public"))

app.engine("handlebars", engine())
app.set("view engine", "handlebars")
app.set("views", "./views")

app.use("/api/products", productRouter)
app.use("/api/carts", cartRouter)
app.use("/api/realTimeProducts", realTimeProductsRouter)

app.get('/',(req,res)=>{
    res.setHeader('Content-Type','text/plain');
    res.status(200).send('OK');
})

io.on("connection", (socket) => {
  console.log("Nuevo cliente conectado");
  
  socket.on("getAllProducts", async () => {
    try {
      
      socket.emit("productList", products);
    } catch (error) {
      console.error("Error al obtener todos los productos:", error);
    }
  });

  socket.on("getProductById", async (productId) => {
    try {
      
      socket.emit("productById", productId);
    } catch (error) {
      console.error("Error al obtener el producto por ID:", error);
    }
  });
  
  socket.on("addProduct", async (newProduct) => {
    try {
      
      io.emit("productAdded", newProduct);
    } catch (error) {
      console.error("Error al agregar el producto:", error);
    }
  });

  socket.on("updateProduct", async (updatedProduct) => {
    try {
      
      io.emit("productUpdated", updatedProduct);
    } catch (error) {
      console.error("Error al actualizar el producto:", error);
    }
  });

  socket.on("deleteProduct", async (deletedProduct) => {
    try {
      
      io.emit("productDeleted", deletedProduct);
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
    }
  });

});



app.listen(PORT, () => console.log(`Servidor en línea en el puerto ${PORT}`));

const connDB=async()=>{
  try{
    await mongoose.connect(
      "mongodb+srv://Briar:Panchardium00.@cluster0.qbpticw.mongodb.net/ecommerce",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true
      }
    );
    console.log("Conexión a la base de datos 'ecommerce' establecida");

  }
  catch(error) {
    console.log("Error al conectar a DB", error.message)
  }
}

connDB()


module.exports = { io };









