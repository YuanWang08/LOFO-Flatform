// chatrooms.route.js
const express = require("express");
const router = express.Router();
const authMid = require("../middlewares/auth.mid");
const chatroomsCtrl = require("../controllers/chatroomsController");

// 獲取用戶所有聊天室
router.get("/", authMid.authRequired(), chatroomsCtrl.getUserChatrooms);

// 創建新聊天室
router.post("/", authMid.authRequired(), chatroomsCtrl.createChatroom);

// 獲取特定聊天室詳情
router.get(
  "/:chatroom_id",
  authMid.authRequired(),
  chatroomsCtrl.getChatroomDetails
);

// 更新聊天室狀態
router.patch(
  "/:chatroom_id/status",
  authMid.authRequired(),
  chatroomsCtrl.updateChatroomStatus
);

// 添加參與者到聊天室
router.post(
  "/:chatroom_id/participants",
  authMid.authRequired(),
  chatroomsCtrl.addParticipantToChatroom
);

// 從聊天室移除參與者
router.delete(
  "/:chatroom_id/participants/:participant_id",
  authMid.authRequired(),
  chatroomsCtrl.removeParticipantFromChatroom
);

module.exports = router;
