const User = require("../../../models/User");

const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    let arrayUsers = [];
    let aux;
    for (const user of users) {
      aux = await getInfoUser(user._id);
      arrayUsers.push(aux);
    }
    res.status(200).send(arrayUsers);
  } catch (error) {
    res.status(404).send(error);
  }
};

const getUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await getInfoUser(id);
    if (!user) {
      return res.status(404).send({ message: "Usuario no encontrado" });
    }
    res.status(200).send(user);
  } catch (error) {
    console.log(error);
    res.status(404).send(error);
  }
};

const getInfoUser = async (id) => {
  console.log(id)
  try {
    const user = await User.findById(id);
    const userInfo = {
      id: user._id,
      username: user.username,
      name: user.name,
      lastname: user.lastname,
      email: user.email,
      avatar: user.avatar,
    };
    return userInfo;
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getUsers,
  getUser,
};
