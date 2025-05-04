const express = require("express");
const router = express.Router();
const authMid = require("../middlewares/auth.mid");
const itemCtrl = require("../controllers/itemController");

// POST /api/items - 建立新物品
router.post("/", authMid.authRequired(), itemCtrl.createItem);

// GET /api/items - 取得所有物品列表
router.get("/", itemCtrl.getAllItems);

// GET /api/items/:id - 取得單一物品詳情
router.get("/:id", itemCtrl.getItemById);

// PUT /api/items/:id/claim - 申領物品
router.put("/:id/claim", authMid.authRequired(), async (req, res) => {
  res.status(200).json({
    response: "ok",
  });
});

module.exports = router;
