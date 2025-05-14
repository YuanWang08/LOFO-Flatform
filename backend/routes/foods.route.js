const express = require("express");
const router = express.Router();
const authMid = require("../middlewares/auth.mid");

// POST /api/foods/upload - 上傳新食物圖片
// POST /api/foods - 建立新食物
// GET /api/foods - 取得所有食物列表
// GET /api/foods/:id - 取得單一食物詳情

module.exports = router;
