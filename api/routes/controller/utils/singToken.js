require("dotenv").config();
const jwt = require("jsonwebtoken");

function signToken(_id) {
  return jwt.sign({ _id }, process.env.SECRET_STRING, {
    expiresIn: 60 * 60 * 24 * 365, //esto es un objeto de configuración, se encarga de dar el tiempo de duración del token segundos * minutos * horas * dias
  });
}

module.exports = { signToken };
