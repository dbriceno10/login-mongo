const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const { DB_HOST, DB_PORT, DB_NAME } = process.env;
const app = express();
const routes = require("./routes/index.js");
app.use(bodyParser.json()); //Indicamos que use body-parser, va a tomar lo que enviemos al bory y lo va a convertir en json
app.use(cors()); //Esto nos va a permitir acceder a nuestra aplicación de manera fácil desde cualquier entorno fuera de localhost

mongoose
  .connect(`mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((db) => {
    console.log("MongoDB conectado");
  })
  .catch((error) => console.log("error"));

app.use("/", routes);

app.listen(3001, () => {
  console.log("Servidor en puerto 3001");
});

module.exports = app;
