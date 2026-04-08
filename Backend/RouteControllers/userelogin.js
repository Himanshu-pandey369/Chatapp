const User = require("../Models/user");
const bcrypt = require("bcrypt");
const jwtToken = require("../utils/jwt");
const userlogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

    // Set default profile pic if not set
    if (!user.profilepic) {
      user.profilepic = `https://api.dicebear.com/9.x/lorelei/svg?seed=${encodeURIComponent(user.username)}`;
      await user.save();
    }

    jwtToken(user._id, res);
    return res.status(200).json({
      success: true,
      message: "Login successful",
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Server Error",
    });
  }
};

module.exports = userlogin;
