require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../utils/singToken");

function singToken(_id) {
  return jwt.sign({ _id }, process.env.SECRET_STRING, {
    expiresIn: 60 * 5, //esto es un objeto de configuración, se encarga de dar el tiempo de duración del token segundos * minutos * horas * dias
  });
}

const isAuthenticated = (request, response, next) => {
  //Cambiamos a exportar por defecto
  const token = request.headers.authorization; //el token se suele sacar dentro de la cabecera autorization, pero podría salir de otro lugar, dependiendo del caso
  if (!token) {
    return response.sendStatus(403);
  }
  jwt.verify(token, process.env.SECRET_STRING, (error, decoded) => {
    const { _id } = decoded;
    User.findOne({ _id })
      .exec()
      .then((user) => {
        request.user = user;
        next();
      });
  });
};

module.exports = { singToken, isAuthenticated };
