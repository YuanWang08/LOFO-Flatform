const express = require("express");
const router = express.Router();
const authmid = require("../middlewares/auth.mid");
const userCtrl = require("../controllers/userController");

router.get("/check", authmid.authRequired(), userCtrl.check);
router.get("/info", authmid.authRequired(), userCtrl.getUserInfo);
// router.put("/info", authmid.authRequired(), userCtrl.updateUserInfo);

module.exports = router;
