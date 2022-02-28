const User = require("../../../models/User.js");
const crypto = require("crypto");
require("dotenv").config();
const alert = require("alert");
const { emailValidation } = require("../utils/regex");
const { BYTES, BASE, ITERATIONS, LONG_ENCRYPTION, ENCRYPT_ALGORITHM } =
  process.env;

const register = async (req, res) => {
  let { name, lastname, email, username, password, repitePassword, avatar } =
    req.body;
  try {
    if (!emailValidation(email)) {
      alert("El email no es válido");
      return res.redirect("/users/register");
    }
    const emailUser = await User.findOne({ email: email.trim().toLowerCase() });
    if (emailUser) {
      alert("El email ya está en uso");
      return res.redirect("/users/register");
    }
    const usernameUser = await User.findOne({
      username: username.trim().toLowerCase(),
    });
    if (usernameUser) {
      alert("El username ya está en uso");
      return res.redirect("/users/register");
    }
    if (password !== repitePassword) {
      alert("Las contraseñas no coinciden");
      return res.redirect("/users/register");
    }
    if (password.length < 6) {
      alert("La contraseña debe tener al menos 6 caracteres");
      return res.redirect("/users/register");
    }
    if (!avatar) {
      avatar =
        "https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?s=200";
    }
    crypto.randomBytes(parseInt(BYTES), (error, salt) => {
      const newSalt = salt.toString(BASE);
      crypto.pbkdf2(
        password,
        newSalt,
        parseInt(ITERATIONS), //iteraciones para encriptar
        parseInt(LONG_ENCRYPTION), //longitud de la contraseña encriptada
        ENCRYPT_ALGORITHM, //algoritmo de encriptación
        async (error, key) => {
          const emailUser = await User.findOne({ email: email });
          if (emailUser) {
            alert("El email ya está en uso");
            return res.redirect("/users/register");
          }
          if (password !== repitePassword) {
            alert("Las contraseñas no coinciden");
            return res.redirect("/users/register");
          }

          const encryptedPassword = key.toString(BASE);
          const newUser = await User.create({
            name: name.trim().toLowerCase(),
            lastname: lastname.trim().toLowerCase(),
            email: email.trim().toLowerCase(),
            username: username.trim().toLowerCase(),
            password: encryptedPassword,
            salt: newSalt,
            avatar,
          });
          alert("Usuario creado correctamente");
          res.redirect("/");
        }
      );
    });
  } catch (error) {
    console.log(error);
    alert("Error al crear el usuario");
    res.redirect("/");
  }
};

module.exports = { register };
