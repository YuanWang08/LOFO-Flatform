const express = require("express");
const router = express.Router();
const authMid = require("../middlewares/auth.mid");
const uploadMid = require("../middlewares/upload.mid");
const itemCtrl = require("../controllers/itemController");

// 上傳物品圖片
router.post(
  "/upload",
  authMid.authRequired(),
  uploadMid.singleItemImage,
  uploadMid.handleUploadError,
  itemCtrl.uploadItemImage
);

// 建立新物品
router.post(
  "/",
  authMid.authRequired(),
  uploadMid.singleItemImage,
  uploadMid.handleUploadError,
  itemCtrl.createItem
);

// 取得所有物品列表
router.get("/", itemCtrl.getAllItems);

// 取得單一物品詳情
router.get("/:id", itemCtrl.getItemById);

// 認領物品
router.post("/:id/claim", authMid.authRequired(), itemCtrl.claimItem);

router.put("/:id", authMid.authRequired(), itemCtrl.updateItem);

router.get("/:id/similar", itemCtrl.getSimilarItems);

module.exports = router;
