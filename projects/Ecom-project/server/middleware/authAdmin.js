const Users = require("../models/userModel");

const authAdmin = async (req, res, next) => {
  try {
    const user = await Users.findOne({ id: req.user._id });

    if (!user) return res.status(400).json({ msg: "User not found." });

    if (user.role === 0)
      return res.status(400).json({ msg: "Admin Resources Access Denied" });

    next();
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

module.exports = authAdmin;
