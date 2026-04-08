const jwt = require("jsonwebtoken");
const User = require("../Models/user");

const isLogin = async(req, res, next) => {
  try {
    let token = req.cookies.jwt;
    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }
    if (!token)
      return res.status(401).json({
        success: false,
        message: "Unauthorised User",
      });
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    if (!decode)
      return res.status(401).json({
        success: false,
        message: "Unauthorised User",
      });
    const user = await User.findById(decode.userID).select("-password");
    if (!user)
      return res.status(401).json({
        success: false,
        message: "Unauthorised User",
      });
    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Server Error",
    });
  }
};



module.exports = isLogin;