const User = require("../../../models/User");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const alert = require("alert");
const {emailValidation}= require("../utils/regex")
const { singToken, isAuthenticated } = require("../utils/singToken");
const { BASE, ITERATIONS, LONG_ENCRYPTION, ENCRYPT_ALGORITHM } = process.env;

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if(!emailValidation(email)){
      alert("El email no es válido");
      return res.redirect("/users/login");
    }
    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user) {
      alert("El usuario no existe");
      return res.redirect("/users/login");
    }
    const salt = user.salt;
    crypto.pbkdf2(
      password,
      user.salt,
      parseInt(ITERATIONS), //iteraciones para encriptar
      parseInt(LONG_ENCRYPTION), //longitud de la contraseña encriptada
      ENCRYPT_ALGORITHM, //algoritmo de encriptación
      async (error, key) => {
        const encryptedPassword = key.toString(BASE);
        if (encryptedPassword !== user.password) {
          alert("La contraseña no es válida");
          return res.redirect("/users/login");
        }
        req.session.userId = user._id;
        res.redirect("/home");
      }
    );
  } catch (error) {
    console.log(error);
    alert("Ha ocurrido un error");
    res.redirect("/users/login");
  }
};

module.exports = {
  login,
};
