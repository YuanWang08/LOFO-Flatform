// messagesController.js
const db = require("../config/sequelize");
const { Op } = require("sequelize");
const { v4: uuidv4 } = require("uuid");

// 獲取聊天室的所有訊息
const getChatroomMessages = async (req, res) => {
  try {
    const { user_id } = req.user;
    const { chatroom_id } = req.params;
    const { page = 1, limit = 50 } = req.query;

    // 檢查用戶是否為聊天室參與者
    const isParticipant = await db.chatroom_participants.findOne({
      where: {
        chatroom_id,
        user_id,
      },
    });

    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: "您不是此聊天室的參與者",
      });
    }

    // 計算分頁
    const offset = (page - 1) * limit;

    // 獲取訊息並進行分頁
    const messages = await db.messages.findAndCountAll({
      where: { chatroom_id },
      include: [
        {
          model: db.users,
          as: "sender",
          attributes: ["user_id", "username", "avatar"],
        },
      ],
      order: [["createdAt", "DESC"]],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    res.status(200).json({
      success: true,
      data: {
        messages: messages.rows,
        total: messages.count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(messages.count / limit),
      },
    });
  } catch (error) {
    console.error("獲取聊天訊息失敗:", error);
    res.status(500).json({
      success: false,
      message: "獲取聊天訊息失敗",
      error: error.message,
    });
  }
};

// 發送新訊息
const sendMessage = async (req, res) => {
  try {
    const { user_id } = req.user;
    const { chatroom_id } = req.params;
    const { content } = req.body;

    // 檢查用戶是否為聊天室參與者
    const isParticipant = await db.chatroom_participants.findOne({
      where: {
        chatroom_id,
        user_id,
      },
    });

    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: "您不是此聊天室的參與者",
      });
    }

    // 檢查聊天室是否關閉
    const chatroom = await db.chatrooms.findByPk(chatroom_id);
    if (chatroom.status === "closed") {
      return res.status(400).json({
        success: false,
        message: "此聊天室已關閉，無法發送新訊息",
      });
    }

    // 創建新訊息
    const newMessage = await db.messages.create({
      chatroom_id,
      sender_id: user_id,
      content,
    });

    // 獲取完整的訊息數據，包括發送者信息
    const messageWithSender = await db.messages.findOne({
      where: { message_id: newMessage.message_id },
      include: [
        {
          model: db.users,
          as: "sender",
          attributes: ["user_id", "username", "avatar"],
        },
      ],
    });

    // 使用 Socket.IO 進行實時通知
    const io = req.app.get("io");
    if (io) {
      // 向聊天室所有成員廣播新訊息
      io.to(`chatroom:${chatroom_id}`).emit("new-message", messageWithSender);

      // 向聊天室的其他參與者發送通知
      const participants = await db.chatroom_participants.findAll({
        where: {
          chatroom_id,
          user_id: { [db.Sequelize.Op.ne]: user_id },
        },
      });

      // 聊天室更新訊息
      const chatroomInfo = {
        chatroom_id,
        event_type: chatroom.event_type,
        event_id: chatroom.event_id,
        last_message: {
          content,
          created_at: newMessage.createdAt,
          sender_id: user_id,
        },
      };

      // 向其他參與者發送更新通知
      participants.forEach((participant) => {
        io.to(participant.user_id).emit("chatroom-update", chatroomInfo);
      });
    }

    res.status(201).json({
      success: true,
      data: messageWithSender,
      message: "訊息發送成功",
    });
  } catch (error) {
    console.error("發送訊息失敗:", error);
    res.status(500).json({
      success: false,
      message: "發送訊息失敗",
      error: error.message,
    });
  }
};

// 刪除訊息
const deleteMessage = async (req, res) => {
  try {
    const { user_id } = req.user;
    const { message_id } = req.params;

    // 查找訊息並檢查權限
    const message = await db.messages.findByPk(message_id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "訊息不存在",
      });
    }

    if (message.sender_id !== user_id) {
      return res.status(403).json({
        success: false,
        message: "您只能刪除自己發送的訊息",
      });
    }

    // 進行軟刪除
    await message.destroy();

    res.status(200).json({
      success: true,
      message: "訊息已刪除",
    });
  } catch (error) {
    console.error("刪除訊息失敗:", error);
    res.status(500).json({
      success: false,
      message: "刪除訊息失敗",
      error: error.message,
    });
  }
};

module.exports = {
  getChatroomMessages,
  sendMessage,
  deleteMessage,
};
