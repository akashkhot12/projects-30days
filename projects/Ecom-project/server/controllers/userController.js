const Users = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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
                path: "/user/refresh_token",
            });

            res.json({ msg: accessToken });
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },
};

const createAccessToken = (payload) => {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRETE, {
        expiresIn: "1d",
    });
};

const createRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRETE, {
        expiresIn: "7d",
    });
};

module.exports = userController;
