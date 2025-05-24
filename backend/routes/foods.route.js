const express = require("express");
const router = express.Router();
const authMid = require("../middlewares/auth.mid");
const uploadMid = require("../middlewares/upload.mid");
const foodCtrl = require("../controllers/foodController");

// 上傳新食物圖片
router.post(
  "/upload",
  authMid.authRequired(),
  uploadMid.singleFoodImage,
  uploadMid.handleUploadError,
  foodCtrl.uploadFoodImage
);

// 建立新食物
router.post(
  "/",
  authMid.authRequired(),
  uploadMid.singleFoodImage,
  uploadMid.handleUploadError,
  foodCtrl.createFood
);

// 取得所有食物列表
router.get("/", foodCtrl.getAllFoods);

// 取得單一食物詳情
router.get("/:id", foodCtrl.getFoodById);

// 獲取食物公開資訊（無需登入）
router.get("/:id/public-info", foodCtrl.getFoodPublicInfo);

router.put("/:id", authMid.authRequired(), foodCtrl.updateFood);

router.delete("/:id", authMid.authRequired(), foodCtrl.withdrawFood);

router.post("/:id/reserve", authMid.authRequired(), foodCtrl.reserveFood);

// 取得某食物的所有預約
router.get(
  "/:id/reservations",
  authMid.authRequired(),
  foodCtrl.getFoodReservations
);

// 處理食物預約 (接受或拒絕)
router.put(
  "/:id/reservations/:reservationId",
  authMid.authRequired(),
  foodCtrl.handleReservation
);

// 標記自取食物已被拿走
router.post(
  "/:id/self-pickup",
  authMid.authRequired(),
  foodCtrl.markAsSelfPickedUp
);

// 獲取相似食物
router.get("/:id/similar", foodCtrl.getSimilarFoods);

module.exports = router;
