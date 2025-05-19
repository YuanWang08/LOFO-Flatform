const express = require("express");
const router = express.Router();
const authMid = require("../middlewares/auth.mid");
const uploadMid = require("../middlewares/upload.mid");
const itemCtrl = require("../controllers/itemController");

// POST /api/items/upload - 上傳物品圖片
router.post(
  "/upload",
  authMid.authRequired(),
  uploadMid.singleItemImage,
  uploadMid.handleUploadError,
  itemCtrl.uploadItemImage
);

// POST /api/items - 建立新物品
router.post(
  "/",
  authMid.authRequired(),
  uploadMid.singleItemImage,
  uploadMid.handleUploadError,
  itemCtrl.createItem
);

// GET /api/items - 取得所有物品列表
router.get("/", itemCtrl.getAllItems);

// GET /api/items/:id - 取得單一物品詳情
router.get("/:id", itemCtrl.getItemById);

// PUT /api/items/:id/claim - 認領物品
router.post("/:id/claim", authMid.authRequired(), itemCtrl.claimItem);

// PUT /api/items/:id - 更新物品資訊
router.put("/:id", authMid.authRequired(), itemCtrl.updateItem);

module.exports = router;
