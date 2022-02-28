const User = require("../../../models/User");
const crypto = require("crypto");
require("dotenv").config();
const alert = require("alert");
const { emailValidation } = require("../utils/regex");
const { BYTES, BASE, ITERATIONS, LONG_ENCRYPTION, ENCRYPT_ALGORITHM } =
  process.env;

const updateUser = async (req, res) => {
  const { userId } = req.session;
  let { username, name, lastname, email, avatar } = req.body;
  username = username.trim().toLowerCase();
  name = name.trim().toLowerCase();
  lastname = lastname.trim().toLowerCase();
  email = email.trim().toLowerCase();
  try {
    const user = await User.findById(userId);
    if (!user) {
      alert("No existe el usuario");
      return res.redirect("/users/update");
    }
    if(email) {
      if (!emailValidation.test(email)) {
        alert("El email no es válido");
        return res.redirect("/users/update");
      }
    }
    const userEmail = await User.findOne({ email: email.trim().toLowerCase() });
    if (userEmail && userEmail._id !== userId) {
      alert("El email ya está en uso");
      return res.redirect("/users/update");
    }
    const userUsername = await User.findOne({
      username: username.trim().toLowerCase(),
    });
    if (userUsername && userUsername._id !== userId) {
      alert("El username ya está en uso");
      return res.redirect("/users/update");
    }
    await User.findByIdAndUpdate(userId, {
      username: username ? username : user.username,
      name: name ? name : user.name,
      lastname: lastname ? lastname : user.lastname,
      email: email ? email : user.email,
      avatar: avatar ? avatar : user.avatar,
    });
    alert("Usuario actualizado");
    res.redirect("/home");
  } catch (error) {
    console.log(error);
    alert("Ha ocurrido un error");
    res.redirect("/users/update");
  }
};

const verifyPassword = async (req, res) => {
  const { userId } = req.session;
  const { password } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) {
      alert("No existe el usuario");
      return res.redirect("/users/verifypassword");
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
          alert("Contraseña incorrecta");
          return res.redirect("/users/verifypassword");
        }
        res.redirect("/users/updatepassword");
      }
    );
  } catch (error) {
    console.log(error);
    alert("Ha ocurrido un error");
    res.redirect("/users/verifypassword");
  }
};

const updatePassword = async (req, res) => {
  const { userId } = req.session;
  const { newPassword, repiteNewPassword } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) {
      alert("No existe el usuario");
      return res.redirect("/users/updatepassword");
    }
    if (newPassword !== repiteNewPassword) {
      alert("Las contraseñas no coinciden");
      return res.redirect("/users/updatepassword");
    }
    if (newPassword.length < 6) {
      alert("La contraseña debe tener al menos 6 caracteres");
      return res.redirect("/users/updatepassword");
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
          await User.findByIdAndUpdate(userId, {
            password: encryptedPassword,
            salt: newSalt,
          });
        }
      );
    });
    alert("Contraseña actualizada");
    res.redirect("/home");
  } catch (error) {
    console.log(error);
    alert("Ha ocurrido un error");
    res.redirect("/users/updatepassword");
  }
};

module.exports = {
  updateUser,
  updatePassword,
  verifyPassword,
};
