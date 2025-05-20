const express = require("express");
const router = express.Router();
const authMid = require("../middlewares/auth.mid");
const uploadMid = require("../middlewares/upload.mid");
const geminiCtrl = require("../controllers/geminiController");

// 分析遺失物品圖片
router.post(
  "/analyze-item",
  authMid.authRequired(),
  uploadMid.singleItemImage,
  geminiCtrl.analyzeItem
);

// 分析食物圖片
router.post(
  "/analyze-food",
  authMid.authRequired(),
  uploadMid.singleFoodImage,
  geminiCtrl.analyzeFood
);

module.exports = router;
