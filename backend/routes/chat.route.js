const express = require("express");
const router = express.Router();
const authMid = require("../middlewares/auth.mid");
const MongooseMsg = require("../models/mongoose_message.model");

// 獲取與特定用戶的私人聊天歷史
router.get(
  "/private/:receiver_id",
  authMid.authRequired(),
  async (req, res) => {
    try {
      const senderId = req.user.user_id;
      const { receiver_id } = req.params;
      const { page = 1, limit = 50 } = req.query;

      const offset = (parseInt(page) - 1) * parseInt(limit);

      const messages = await MongooseMsg.find({
        $or: [
          { senderId, receiverId: receiver_id },
          { senderId: receiver_id, receiverId: senderId },
        ],
      })
        .sort({ timestamp: -1 })
        .skip(offset)
        .limit(parseInt(limit));

      const totalCount = await MongooseMsg.countDocuments({
        $or: [
          { senderId, receiverId: receiver_id },
          { senderId: receiver_id, receiverId: senderId },
        ],
      });

      return res.status(200).json({
        success: true,
        data: {
          messages: messages.reverse(),
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(totalCount / parseInt(limit)),
            totalItems: totalCount,
          },
        },
      });
    } catch (error) {
      console.error("獲取私人聊天失敗:", error);
      return res.status(500).json({
        success: false,
        message: "獲取聊天記錄失敗",
      });
    }
  }
);

// 發送私人消息（REST API方式）
router.post(
  "/private/:receiver_id",
  authMid.authRequired(),
  async (req, res) => {
    try {
      const senderId = req.user.user_id;
      const { receiver_id } = req.params;
      const { content } = req.body;

      if (!content || content.trim() === "") {
        return res.status(400).json({
          success: false,
          message: "消息內容不能為空",
        });
      }

      const newMessage = new MongooseMsg({
        senderId,
        receiverId: receiver_id,
        content,
        timestamp: new Date(),
      });

      await newMessage.save();

      return res.status(201).json({
        success: true,
        data: newMessage,
      });
    } catch (error) {
      console.error("發送私人消息失敗:", error);
      return res.status(500).json({
        success: false,
        message: "發送消息失敗",
      });
    }
  }
);

// 獲取最近聊天的用戶列表
router.get("/recent", authMid.authRequired(), async (req, res) => {
  try {
    const userId = req.user.user_id;

    const messages = await MongooseMsg.find({
      $or: [{ senderId: userId }, { receiverId: userId }],
    }).sort({ timestamp: -1 });

    const chatPartners = new Set();
    const recentChats = [];

    messages.forEach((msg) => {
      const partnerId = msg.senderId === userId ? msg.receiverId : msg.senderId;

      if (!chatPartners.has(partnerId)) {
        chatPartners.add(partnerId);
        recentChats.push({
          userId: partnerId,
          lastMessage: msg.content,
          timestamp: msg.timestamp,
        });
      }
    });

    // 只返回前20個最近的聊天
    return res.status(200).json({
      success: true,
      data: recentChats.slice(0, 20),
    });
  } catch (error) {
    console.error("獲取最近聊天失敗:", error);
    return res.status(500).json({
      success: false,
      message: "獲取最近聊天失敗",
    });
  }
});

module.exports = router;
