const express = require("express");
const router = express.Router();
const authMid = require("../middlewares/auth.mid");
const messagesCtrl = require("../controllers/messagesController");

// 獲取聊天室的所有訊息
router.get(
  "/chatroom/:chatroom_id",
  authMid.authRequired(),
  messagesCtrl.getChatroomMessages
);

// 發送訊息到聊天室
router.post(
  "/chatroom/:chatroom_id",
  authMid.authRequired(),
  messagesCtrl.sendMessage
);

// 刪除特定訊息
router.delete(
  "/:message_id",
  authMid.authRequired(),
  messagesCtrl.deleteMessage
);

module.exports = router;
