const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");
require("dotenv").config();
const server = express();
const routes = require("./routes/index.js");
require("./database");
const { SESSION_NAME, SESSION_SECRET } = process.env;
server.name = "API";

server.use(cors());
server.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
server.use(bodyParser.json({ limit: "50mb" }));
server.use(cookieParser());
server.use(morgan("dev"));
server.use(
  session({
    name: SESSION_NAME,
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 5, // Está en milisegundos --> 5 min
    },
  })
);

// setInterval(() => {
//   console.log(req.session.maxAge);
// }, 1000 );

// server.use((req, res, next) => {
//   console.log(req.session);
//   next();
// });

server.use((req, res, next) => {
  // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  res.header("Access-Control-Expose-Headers", "Content-Range");
  res.header("Content-Range", "bytes:0-9/100");
  // console.log(req.session);
  next();
});

server.use("/", routes); //me traigo las rutas de quefiní para usarlas y generar mi enrutado

// Error catching endware.
server.use((err, req, res, next) => {
  // eslint-disable-line no-unused-vars
  const status = err.status || 500;
  const message = err.message || err;
  console.error(err);
  res.status(status).send(message);
});

server.listen(process.env.PORT, () => {
  console.log(`Servidor en puerto ${process.env.PORT}`);
});

module.exports = server;
