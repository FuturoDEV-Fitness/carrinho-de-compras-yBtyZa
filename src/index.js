const express = require("express");

const clientesRoutes = require("./routers/clientes.routes");
const productsRoutes = require("./routers/products.routes");

const app = express();
const port = 3000;  
app.use(express.json())

app.use('/clientes', clientesRoutes)
app.use('/products', productsRoutes)

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`)
})