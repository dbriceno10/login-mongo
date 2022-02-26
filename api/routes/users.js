const { Router } = require("express");
const router = Router();
const { register } = require("./controller/register/post.register.controller");
const { getUsers } = require("./controller/users/get.user.controller");

router.post("/register", register);
router.get("/", getUsers);

module.exports = router;