const User = require("../../../models/User");

const deleteUser = async (req, res) => {
  const { id } = req.params;
  try{
    const user = await User.findOneAndDelete({ _id: id });
    if(!user){
      return res.status(404).send({ message: "Usuario no encontrado" });
    }
    const deletedUser = {
      usename: user.username,
      name: user.name,
      lastname: user.lastname,
      email: user.email,
    }
    res.status(200).send({ message: "Usuario eliminado correctamente", deletedUser });
  }catch(error){
    console.log(error);
    res.status(404).send(error);
  }
}

module.exports = {
  deleteUser,
}