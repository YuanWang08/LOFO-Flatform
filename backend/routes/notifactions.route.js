const express = require("express");
const router = express.Router();
const authMid = require("../middlewares/auth.mid");
const notificationsCtrl = require("../controllers/notificationsController");

module.exports = router;
