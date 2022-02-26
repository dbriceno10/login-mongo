const { User } = require("../../../models/User");

const register = async (req, res) => {
  const { name, lastname, email, username, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) return res.status(404).send({ message: "El usuario ya existe" });
    const newUser = await User.create({
      name,
      lastname,
      email,
      username,
      password,
    });
    res.status(200).send({ message: "Usuario creado correctamente", newUser });
  } catch (error) {
    console.log(error);
    res.status(404).send("Error: ", error);
  }
};

module.exports = { register };
