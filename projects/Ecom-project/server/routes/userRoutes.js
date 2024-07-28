const express = require("express");
const userController = require("../controllers/userController");
const auth = require("../middleware/auth");
const router = express.Router();

router.post("/register", userController.register);
router.post("/refreshtoken", userController.refreshToken);
router.post("/login", userController.login);
router.get("/logout", userController.logout);
router.get("/info", auth, userController.getUser);

module.exports = router;
