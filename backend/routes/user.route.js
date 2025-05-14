const express = require("express");
const router = express.Router();
const authmid = require("../middlewares/auth.mid");
const userCtrl = require("../controllers/userController");

router.get("/check", authmid.authRequired(), userCtrl.check);
router.get("/info", authmid.authRequired(), userCtrl.getUserInfo);

// 註冊新用戶
router.post("/register", userCtrl.register);

// 用戶登入
router.post("/login", userCtrl.login);

// 發送重設密碼電子郵件
router.post("/reset-password", userCtrl.resetPassword);

// 使用令牌確認重設密碼
router.post("/confirm-reset", userCtrl.confirmResetPassword);

// 已登入用戶更新密碼
router.put("/password", authmid.authRequired(), userCtrl.updatePassword);

// 更新用戶資訊
router.put("/update", authmid.authRequired(), userCtrl.updateUserInfo);

module.exports = router;
