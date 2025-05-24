const express = require("express");
const router = express.Router();
const authMid = require("../middlewares/auth.mid");
const chatroomsCtrl = require("../controllers/chatroomsController");

router.get("/", authMid.authRequired(), chatroomsCtrl.getUserChatrooms);

router.post("/", authMid.authRequired(), chatroomsCtrl.createChatroom);

router.get(
  "/:chatroom_id",
  authMid.authRequired(),
  chatroomsCtrl.getChatroomDetails
);

router.patch(
  "/:chatroom_id/status",
  authMid.authRequired(),
  chatroomsCtrl.updateChatroomStatus
);

router.post(
  "/:chatroom_id/participants",
  authMid.authRequired(),
  chatroomsCtrl.addParticipantToChatroom
);

router.delete(
  "/:chatroom_id/participants/:participant_id",
  authMid.authRequired(),
  chatroomsCtrl.removeParticipantFromChatroom
);

module.exports = router;
