const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = mongoose.model(
  "User",
  new Schema(
    {
      username: { type: String, unique: true },
      name: String,
      lastname: String,
      email: { type: String, unique: true, required: true },
      password: String,
      avatar: {
        type: String,
        default:
          "https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?s=200",
      },
      salt: String, //salt es un string que vamos a utilizar para encriptar nuestra contraseña
      role: { type: String, default: "user" }, //podría ser también un admin, por ejemplo
      date: { type: Date, default: Date.now },
    }
    // {
    //   timestamps: true,
    //   versionKey: false,
    // }
  )
);

module.exports = User;
