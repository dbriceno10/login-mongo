const User = require("../../../models/User");
const crypto = require("crypto");
require("dotenv").config();
const { BASE, ITERATIONS, LONG_ENCRYPTION, ENCRYPT_ALGORITHM } = process.env;

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user) {
      return res.status(404).send({ message: "El usuario no existe" });
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
          return res.status(404).send({ message: "Contraseña incorrecta" });
        }
        res
          .status(200)
          .send({ message: "Usuario logueado correctamente", id: user._id });
      }
    );
  } catch (error) {
    console.log(error);
    res.status(404).send(error);
  }
};

module.exports = {
  login,
};
