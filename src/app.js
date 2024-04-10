const express = require("express");

const productRouter=require("./routes/productRouter")
const cartRouter=require("./routes/cartRouter")

const PORT = 3000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use("/api/products", productRouter)
app.use("/api/carts", cartRouter)

app.get('/',(req,res)=>{
    res.setHeader('Content-Type','text/plain');
    res.status(200).send('OK');
})


app.listen(PORT, () => console.log(`Servidor en línea en el puerto ${PORT}`));
