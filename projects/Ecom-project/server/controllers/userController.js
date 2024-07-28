const Users = require("../models/userModel");
const bcrypt = require("bcrypt");


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


          const newUsers = new Users({
            name,email,password
          })

          await newUsers.save()

      res.json({ msg: `${name}registerd success` });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
};

module.exports = userController;
