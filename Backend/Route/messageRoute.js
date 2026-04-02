const express = require("express");
const router = express.Router();
const sendmessage = require("../RouteControllers/messageController");
const isLogin = require("../Middleware/isLogin");
const getmessage = require("../RouteControllers/reciveControllers");

router.post("/send/:id", isLogin, sendmessage);

router.get("/:id", isLogin, getmessage);

module.exports = router;
