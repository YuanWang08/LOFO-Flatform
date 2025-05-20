const express = require("express");
const router = express.Router();
const authmid = require("../middlewares/auth.mid");
const userCtrl = require("../controllers/userController");
const userActivitiesCtrl = require("../controllers/userActivitiesController");

router.get("/check", authmid.authRequired(), userCtrl.check);
router.get("/info", authmid.authRequired(), userCtrl.getUserInfo);

// 獲取用戶發布的物品列表
router.get("/items", authmid.authRequired(), userActivitiesCtrl.getUserItems);

// 獲取用戶發布的食物列表
router.get("/foods", authmid.authRequired(), userActivitiesCtrl.getUserFoods);

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

// 已登入用戶簡易更新密碼（不需要驗證舊密碼）
router.put(
  "/simple-password",
  authmid.authRequired(),
  userCtrl.simpleUpdatePassword
);

// 更新用戶資訊
router.put("/update", authmid.authRequired(), userCtrl.updateUserInfo);

module.exports = router;
