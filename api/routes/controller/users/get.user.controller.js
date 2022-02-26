const { User } = require("../../../models/User");

const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).send(users);
  } catch (error) {
    res.status(404).send(error);
  }
};

module.exports = {
  getUsers,
};
