const express = require("express");
const router = express.Router();
const authMid = require("../middlewares/auth.mid");
const uploadMid = require("../middlewares/upload.mid");
const geminiCtrl = require("../controllers/geminiController");

router.post(
  "/analyze-item",
  authMid.authRequired(),
  uploadMid.singleItemImage,
  geminiCtrl.analyzeItem
);

router.post(
  "/analyze-food",
  authMid.authRequired(),
  uploadMid.singleFoodImage,
  geminiCtrl.analyzeFood
);

module.exports = router;
