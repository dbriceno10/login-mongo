const User = require("../../../models/User");
const crypto = require("crypto");
require("dotenv").config();
const { BYTES, BASE, ITERATIONS, LONG_ENCRYPTION, ENCRYPT_ALGORITHM } =
  process.env;

const updateUser = async (req, res) => {
  const { id } = req.params;
  let { username, name, lastname, email, avatar } = req.body;
  username = username.trim().toLowerCase();
  name = name.trim().toLowerCase();
  lastname = lastname.trim().toLowerCase();
  email = email.trim().toLowerCase();
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).send({ message: "Usuario no encontrado" });
    }
    const userEmail = await User.findOne({ email: email.trim().toLowerCase() });
    if (userEmail && userEmail._id !== id) {
      return res.status(404).send({ message: "Email ya existe" });
    }
    const userUsername = await User.findOne({ username: username.trim().toLowerCase() });
    if (userUsername && userUsername._id !== id) {
      return res.status(404).send({ message: "Username ya existe" });
    }
    await User.findByIdAndUpdate(id, {
      username: username ? username : user.username,
      name: name ? name : user.name,
      lastname: lastname ? lastname : user.lastname,
      email: email ? email : user.email,
      avatar: avatar ? avatar : user.avatar,
    });
    res.status(200).send({ message: "Usuario actualizado correctamente" });
  } catch (error) {
    console.log(error);
    res.status(404).send(error);
  }
};

const verifyPassword = async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;
  try {
    const user = await User.findById(id);
    if (!user) {
      console.log("Usuario no encontrado");
      return res.status(404).send({ message: "Usuario no encontrado" });
    }
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
        res.status(200).send({ message: "Contraseña correcta" });
      }
    );
  } catch (error) {
    console.log(error);
    res.status(404).send(error);
  }
};

const updatePassword = async (req, res) => {
  const { id } = req.params;
  const { newPassword, repiteNewPassword } = req.body;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).send({ message: "Usuario no encontrado" });
    }
    if (newPassword !== repiteNewPassword) {
      return res.status(404).send({ message: "Las contraseñas no coinciden" });
    }
    if(newPassword.length < 6){
      return res.status(404).send({ message: "La contraseña debe tener al menos 6 caracteres" });
    }
    crypto.randomBytes(parseInt(BYTES), (error, salt) => {
      const newSalt = salt.toString(BASE);
      crypto.pbkdf2(
        newPassword,
        newSalt,
        parseInt(ITERATIONS), //iteraciones para encriptar
        parseInt(LONG_ENCRYPTION), //longitud de la contraseña encriptada
        ENCRYPT_ALGORITHM, //algoritmo de encriptación
        async (error, key) => {
          const encryptedPassword = key.toString(BASE);
          await User.findByIdAndUpdate(id, {
            password: encryptedPassword,
            salt: newSalt,
          });
        }
      );
    });
    res.status(200).send({ message: "Contraseña actualizada correctamente" });
  } catch (error) {
    console.log(error);
    res.status(404).send(error);
  }
};

module.exports = {
  updateUser,
  updatePassword,
  verifyPassword,
};
