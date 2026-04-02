const jwt = require("../utils/jwt");
const userlogout = async (req, res) => {
  try {
    res.cookie("jwt", "", {
      maxAge: 0,
    });
    res.status(200).send({ message: "User Logout" });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message || "Server Error",
    });
  }
};

module.exports = userlogout;