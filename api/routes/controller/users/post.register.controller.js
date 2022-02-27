const User = require("../../../models/User.js");
const crypto = require("crypto");
require("dotenv").config();
const { BYTES, BASE, ITERATIONS, LONG_ENCRYPTION, ENCRYPT_ALGORITHM } =
  process.env;

const register = async (req, res) => {
  let { name, lastname, email, username, password, repitePassword, avatar } =
    req.body;
  try {
    const emailUser = await User.findOne({ email: email.trim().toLowerCase() });
    if (emailUser) {
      return res.status(404).send({ message: "El email ya se ha registrado" });
    }
    const usernameUser = await User.findOne({
      username: username.trim().toLowerCase(),
    });
    if (usernameUser) {
      return res.status(404).send({ message: "El username ya se ha registrado" });
    }
    if (password !== repitePassword) {
      return res.status(404).send({ message: "Las contraseñas no coinciden" });
    }
    if(password.length < 6){
      return res.status(404).send({ message: "La contraseña debe tener al menos 6 caracteres" });
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
            return res.status(404).send({ message: "El usuario ya existe" });
          }
          if (password !== repitePassword) {
            return res
              .status(404)
              .send({ message: "Las contraseñas no coinciden" });
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

          res
            .status(200)
            .send({ message: "Usuario creado correctamente", id: newUser._id });
        }
      );
    });
  } catch (error) {
    console.log(error);
    res.status(404).send(error);
  }
};

module.exports = { register };
