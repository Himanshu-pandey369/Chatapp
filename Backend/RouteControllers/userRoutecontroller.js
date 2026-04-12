const User = require("../Models/user");
const bcrypt = require("bcrypt");
const jwt = require("../utils/jwt");
const userRegister = async (req, res) => {
  try {
    const { username, name, email, gender, password, profilepic } = req.body;

    const user = await User.findOne({ $or: [{ username }, { email }, {name}] });

    if (user) {
      return res.status(409).send({
        success: false,
        message: "Username or email already exists",
      });
    }
    const style = "lorelei";
    const avatarUrl = `https://api.dicebear.com/9.x/${style}/svg?seed=${encodeURIComponent(username)}`;
    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      name,
      email,
      gender,
      password: hashPassword,
      profilepic: avatarUrl,
    });

    if (newUser) {
      await newUser.save();
      jwt(newUser._id, res);
    } else {
      return res.status(409).send({
        success: false,
        message: "an error occoured",
      });
    }

    res.status(201).send({
      success: true,
      message: "user created",
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        username: newUser.username,
        profilepic: newUser.profilepic,
      },
      token,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message || "Server Error",
    });
  }
};

module.exports = userRegister;
