const express = require("express")
const router = express.Router()
const userRegister = require("../RouteControllers/userroutecontroller")
const userlogin = require("../RouteControllers/userelogin")
const userlogout = require("../RouteControllers/userlogout")
const isLogin = require("../Middleware/isLogin")

router.post("/register",userRegister)

router.post("/login",userlogin)

router.post("/logout",userlogout)

router.get("/me", isLogin, (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user
  });
})

module.exports = router
