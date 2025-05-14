const express = require("express");
const router = express.Router();
const authMid = require("../middlewares/auth.mid");
const uploadMid = require("../middlewares/upload.mid");
const foodCtrl = require("../controllers/foodController");

// POST /api/foods/upload - 上傳新食物圖片
router.post(
  "/upload",
  authMid.authRequired(),
  uploadMid.singleFoodImage,
  uploadMid.handleUploadError,
  foodCtrl.uploadFoodImage
);

// POST /api/foods - 建立新食物
router.post(
  "/",
  authMid.authRequired(),
  uploadMid.singleFoodImage,
  uploadMid.handleUploadError,
  foodCtrl.createFood
);

// GET /api/foods - 取得所有食物列表
router.get("/", foodCtrl.getAllFoods);

// GET /api/foods/:id - 取得單一食物詳情
router.get("/:id", foodCtrl.getFoodById);

// PUT /api/foods/:id - 更新食物資訊
router.put("/:id", authMid.authRequired(), foodCtrl.updateFood);

// DELETE /api/foods/:id - 撤回食物分享
router.delete("/:id", authMid.authRequired(), foodCtrl.withdrawFood);

// POST /api/foods/:id/reserve - 預約食物
router.post("/:id/reserve", authMid.authRequired(), foodCtrl.reserveFood);

// GET /api/foods/:id/reservations - 取得某食物的所有預約
router.get(
  "/:id/reservations",
  authMid.authRequired(),
  foodCtrl.getFoodReservations
);

// PUT /api/foods/:id/reservations/:reservationId - 處理食物預約 (接受或拒絕)
router.put(
  "/:id/reservations/:reservationId",
  authMid.authRequired(),
  foodCtrl.handleReservation
);

module.exports = router;
