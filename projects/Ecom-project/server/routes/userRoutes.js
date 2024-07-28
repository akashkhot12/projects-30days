const express = require("express");
const userController = require("../controllers/userController");
const router = express.Router();

router.post("/register", userController.register);
router.post("/refreshtoken", userController.refreshToken);

module.exports = router;
