const { Router } = require("express");
const router = Router();
const { register } = require("./controller/users/post.register.controller");
const { getUsers, getUser } = require("./controller/users/get.user.controller");
const { login } = require("./controller/users/post.login.controller");
const { deleteUser } = require("./controller/users/delete.user.controller");
const {
  updateUser,
  updatePassword,
  verifyPassword,
} = require("./controller/users/update.user.controller");

router.post("/register", register);
router.get("/", getUsers);
router.post("/login", login);
router.get("/detail/:id", getUser);
router.delete("/delete/:id", deleteUser);
router.put("/update/:id", updateUser);
router.put("/updatepassword/:id", updatePassword);
router.post("/verifypassword/:id", verifyPassword);
module.exports = router;
