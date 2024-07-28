const Users = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const userController = {
  register: async (req, res) => {
    try {
      // take credentials from users.
      const { name, email, password } = req.body;

      // check if email already exists.
      const user = await Users.findOne({ email });
      if (user)
        return res.status(400).json({ msg: "Email Already Registered" });

      // check if password length is more than or equal to 6 characters.
      if (password.length < 6)
        return res
          .status(400)
          .json({ msg: "Password is at least 6 characters." });

      // hash the password
      const passwordHash = await bcrypt.hash(password, 10);

      // create a new user to store data in the database.
      const newUsers = new Users({
        name,
        email,
        password: passwordHash,
      });

      // save data to the user table
      await newUsers.save();

      // create jwt token for user
      const accessToken = createAccessToken({ id: newUsers._id });

      // refresh token
      const refreshToken = createRefreshToken({ id: newUsers._id });

      // set cookie
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        path: "/user/refresh_token",
      });

      res.json({ accessToken });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },

  refreshToken: async (req, res) => {
    try {
      const rf_token = req.cookies.refreshToken;

      if (!rf_token) {
        return res.status(400).json({ msg: "Please login or register." });
      }

      jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) {
          console.error("JWT verify error:", err); // Log the error for debugging
          return res.status(400).json({ msg: "Please login or register." });
        }

        const accessToken = createAccessToken({ id: user.id });

        res.json({ user, accessToken });
      });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  },
};

const createAccessToken = (payload) => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1d",
  });
};

const createRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
};

module.exports = userController;
