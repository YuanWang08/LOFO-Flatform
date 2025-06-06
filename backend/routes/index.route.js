const express = require("express");
const router = express.Router();

const authRouter = require("./auth.route");
const itemsRouter = require("./items.route");
const userRouter = require("./user.route");
const foodsRouter = require("./foods.route");
const chatroomsRouter = require("./chatrooms.route");
const messagesRouter = require("./messages.route");
const geminiRouter = require("./gemini.route");
const chatRouter = require("./chat.route");

const app = require("../app");

router.get("/", function (req, res, next) {
  res.status(200).json({
    response: "ok",
  });
});

router.use("/auth", authRouter);
router.use("/items", itemsRouter);
router.use("/user", userRouter);
router.use("/foods", foodsRouter);
router.use("/chatrooms", chatroomsRouter);
router.use("/messages", messagesRouter);
router.use("/gemini", geminiRouter);
router.use("/chat", chatRouter);

module.exports = router;
