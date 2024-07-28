const Users = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const userController = {
  register: async (req, res) => {
    try {
      // take creadentials from users.
      const { name, email, password } = req.body;

      // check email already exist or not.
      const user = await Users.findOne({ email });
      if (user)
        return res.status(400).json({ msg: "Email Already Registered" });

      // check password length is more than or equal to 6 digits.
      if (password.length < 6)
        return res
          .status(400)
          .json({ msg: "Password is atleast 6 character." });

      // password bcypted
      const passwordHash = await bcrypt.hash(password, 10);

      // create new user for storing data into database.
      const newUsers = new Users({
        name,
        email,
        password: passwordHash,
      });

      // save data to user table
      await newUsers.save();

      // create jwt token for user
      const accessToken = createAccessToken({ id: newUsers._id });

      // refresh token
      const refreshToken = createRefreshToken({ id: newUsers._id });

      // adding cookie
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        path: "/user/refreshtoken",
      });

      res.json({ msg: accessToken });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },

  refreshToken: async (req, res) => {
    try {
      const rf_token = req.cookies.refreshToken;

      if (!rf_token) {
        return res.status(400).json({ msg: "Please login or registered." });
      }

      jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err)
          return res.status(400).json({ msg: "Please login or register." });

        const accessToken = createAccessToken({ id: user.id });

        res.json({ user, accessToken });
      });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await Users.findOne({ email });

      if (!user) return res.status(400).json({ msg: "User does not exists." });

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) return res.status(400).json({ msg: "Incorrect Password." });

      const accessToken = createAccessToken({ id: user._id });
      const refreshToken = createRefreshToken({ id: user._id });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        path: "/user/refreshtoken",
      });

      res.json({ msg: accessToken });
    } catch (error) {
      res.status(500).json({ msg: error });
    }
  },

  logout: async (req, res) => {
    try {
      res.clearCookie("refreshToken", { path: "/user/refreshtoken" });

      return res.status(200).json({ msg: "Log Out" });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  },

  getUser: async (req, res) => {
    try {
      const user = await Users.findById(req.user.id).select("-password");

      if (!user) return res.status(400).json({ msg: "User not found." });

      res.json(user);
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
