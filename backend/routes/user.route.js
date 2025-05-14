const express = require("express");
const router = express.Router();
const authmid = require("../middlewares/auth.mid");
const userCtrl = require("../controllers/userController");

router.get("/check", authmid.authRequired(), userCtrl.check);
router.get("/info", authmid.authRequired(), userCtrl.getUserInfo);

// register
// router.post("/register", userCtrl.register);

// login
// router.post("/login", userCtrl.login);

// reset password
// router.post("/reset", userCtrl.resetPassword);

// update password
// router.put("/update", authmid.authRequired(), userCtrl.updatePassword);

// update user info
// router.put("/update", authmid.authRequired(), userCtrl.updateUserInfo);

module.exports = router;
