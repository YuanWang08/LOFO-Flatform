const express = require("express");
const router = express.Router();
const authMid = require("../middlewares/auth.mid");
const reportsCtrl = require("../controllers/reportsController");

module.exports = router;
