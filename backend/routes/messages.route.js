const express = require("express");
const router = express.Router();
const authMid = require("../middlewares/auth.mid");
const messagesCtrl = require("../controllers/messagesController");

module.exports = router;
