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
const {
  redirectHome,
  redirectLogin,
} = require("./controller/utils/middleware");

router.post("/register", redirectHome, register);
router.get("/", getUsers);
router.post("/login", redirectHome, login);
router.get("/detail/:id", getUser);
router.delete("/delete/:id", deleteUser);
router.post("/update", redirectLogin, updateUser);
router.post("/updatepassword", redirectLogin, updatePassword);
router.post("/verifypassword", redirectLogin, verifyPassword);
module.exports = router;
