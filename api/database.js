const mongoose = require("mongoose");
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((db) => {
    console.log(`MongoDB conectado`);
  })
  .catch((error) => console.log("Error: ", error));
