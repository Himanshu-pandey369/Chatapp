const express = require("express")
const isLogin = require("../Middleware/isLogin")
const router = express.Router()
const getUserBySearch =require("../RouteControllers/userSearch")
const getCurrentChatters=require("../RouteControllers/currentChatters")


router.get("/search",isLogin,getUserBySearch)
router.get("/currentchatters",isLogin,getCurrentChatters)

module.exports = router