const express = require("express");

const clientesRoutes = require("./routers/clientes.routes");

const app = express();
const port = 3000;  
app.use(express.json())

app.use('/clientes', clientesRoutes)

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`)
})