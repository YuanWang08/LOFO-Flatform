const express = require("express");
const router = express.Router();
const authMid = require("../middlewares/auth.mid");
const MongooseMsg = require("../models/mongoose_message.model");

module.exports = router;
