// chatroomsController.js
const db = require("../config/sequelize");
const { Op } = require("sequelize");
const { v4: uuidv4 } = require("uuid");

// 獲取使用者的所有聊天室
const getUserChatrooms = async (req, res) => {
  try {
    const { user_id } = req.user;

    // 找出用戶參與的所有聊天室
    const userChatrooms = await db.chatroom_participants.findAll({
      where: { user_id },
      include: [
        {
          model: db.chatrooms,
          include: [
            {
              model: db.chatroom_participants,
              as: "roomParticipants",
              include: [
                {
                  model: db.users,
                  attributes: ["user_id", "username", "avatar"],
                },
              ],
            },
            {
              model: db.messages,
              limit: 1,
              order: [["createdAt", "DESC"]],
            },
          ],
        },
      ],
      order: [[db.chatrooms, db.messages, "createdAt", "DESC"]],
    });

    // 整理數據格式，使它更易於前端處理
    const formattedChatrooms = userChatrooms.map((participation) => {
      const chatroom = participation.chatroom;
      return {
        chatroom_id: chatroom.chatroom_id,
        event_type: chatroom.event_type,
        event_id: chatroom.event_id,
        status: chatroom.status,
        participants: chatroom.roomParticipants.map((p) => ({
          user_id: p.user.user_id,
          username: p.user.username,
          avatar: p.user.avatar,
        })),
        last_message:
          chatroom.messages.length > 0
            ? {
                content: chatroom.messages[0].content,
                created_at: chatroom.messages[0].createdAt,
                sender_id: chatroom.messages[0].sender_id,
              }
            : null,
        created_at: chatroom.createdAt,
        updated_at: chatroom.updatedAt,
      };
    });

    res.status(200).json({
      success: true,
      data: formattedChatrooms,
    });
  } catch (error) {
    console.error("獲取聊天室列表失敗:", error);
    res.status(500).json({
      success: false,
      message: "獲取聊天室列表失敗",
      error: error.message,
    });
  }
};

// 建立新的聊天室
const createChatroom = async (req, res) => {
  try {
    const { user_id } = req.user;
    const { event_type, event_id, participant_ids } = req.body;

    // 確保event_id存在且有效
    if (!event_id) {
      return res.status(400).json({
        success: false,
        message: "缺少必要參數: event_id",
      });
    }

    // 確保參與者包含當前用戶
    const allParticipants = Array.from(
      new Set([user_id, ...(participant_ids || [])])
    );

    // 檢查是否已經存在相同事件的聊天室
    const existingChatroom = await db.chatrooms.findOne({
      where: { event_type, event_id },
      include: [
        {
          model: db.chatroom_participants,
          as: "roomParticipants",
          where: { user_id },
        },
      ],
    });

    if (existingChatroom) {
      return res.status(200).json({
        success: true,
        data: { chatroom_id: existingChatroom.chatroom_id },
        message: "聊天室已存在",
      });
    }

    // 創建新聊天室
    const newChatroom = await db.chatrooms.create({
      event_type,
      event_id,
    });

    // 添加參與者
    await Promise.all(
      allParticipants.map((participantId) =>
        db.chatroom_participants.create({
          chatroom_id: newChatroom.chatroom_id,
          user_id: participantId,
        })
      )
    );

    res.status(201).json({
      success: true,
      data: { chatroom_id: newChatroom.chatroom_id },
      message: "聊天室創建成功",
    });
  } catch (error) {
    console.error("創建聊天室失敗:", error);
    res.status(500).json({
      success: false,
      message: "創建聊天室失敗",
      error: error.message,
    });
  }
};

// 獲取特定聊天室的詳細信息
const getChatroomDetails = async (req, res) => {
  try {
    const { user_id } = req.user;
    const { chatroom_id } = req.params;

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

    // 獲取聊天室詳情
    const chatroom = await db.chatrooms.findOne({
      where: { chatroom_id },
      include: [
        {
          model: db.chatroom_participants,
          as: "roomParticipants",
          include: [
            {
              model: db.users,
              attributes: ["user_id", "username", "avatar"],
            },
          ],
        },
      ],
    });

    if (!chatroom) {
      return res.status(404).json({
        success: false,
        message: "聊天室不存在",
      });
    }

    // 整理數據格式
    const formattedChatroom = {
      chatroom_id: chatroom.chatroom_id,
      event_type: chatroom.event_type,
      event_id: chatroom.event_id,
      status: chatroom.status,
      participants: chatroom.roomParticipants.map((p) => ({
        user_id: p.user.user_id,
        username: p.user.username,
        avatar: p.user.avatar,
      })),
      created_at: chatroom.createdAt,
      updated_at: chatroom.updatedAt,
    };

    res.status(200).json({
      success: true,
      data: formattedChatroom,
    });
  } catch (error) {
    console.error("獲取聊天室詳情失敗:", error);
    res.status(500).json({
      success: false,
      message: "獲取聊天室詳情失敗",
      error: error.message,
    });
  }
};

// 更新聊天室狀態
const updateChatroomStatus = async (req, res) => {
  try {
    const { user_id } = req.user;
    const { chatroom_id } = req.params;
    const { status } = req.body;

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

    // 更新聊天室狀態
    await db.chatrooms.update({ status }, { where: { chatroom_id } });

    res.status(200).json({
      success: true,
      message: "聊天室狀態更新成功",
    });
  } catch (error) {
    console.error("更新聊天室狀態失敗:", error);
    res.status(500).json({
      success: false,
      message: "更新聊天室狀態失敗",
      error: error.message,
    });
  }
};

// 添加參與者到聊天室
const addParticipantToChatroom = async (req, res) => {
  try {
    const { user_id } = req.user;
    const { chatroom_id } = req.params;
    const { participant_id } = req.body;

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

    // 檢查新參與者是否已經在聊天室中
    const existingParticipant = await db.chatroom_participants.findOne({
      where: {
        chatroom_id,
        user_id: participant_id,
      },
    });

    if (existingParticipant) {
      return res.status(400).json({
        success: false,
        message: "該用戶已經是聊天室的參與者",
      });
    }

    // 添加新參與者
    await db.chatroom_participants.create({
      chatroom_id,
      user_id: participant_id,
    });

    res.status(200).json({
      success: true,
      message: "成功添加參與者到聊天室",
    });
  } catch (error) {
    console.error("添加參與者失敗:", error);
    res.status(500).json({
      success: false,
      message: "添加參與者失敗",
      error: error.message,
    });
  }
};

// 從聊天室移除參與者
const removeParticipantFromChatroom = async (req, res) => {
  try {
    const { user_id } = req.user;
    const { chatroom_id, participant_id } = req.params;

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

    // 不能移除自己
    if (user_id === participant_id) {
      return res.status(400).json({
        success: false,
        message: "您不能移除自己",
      });
    }

    // 移除參與者
    const removed = await db.chatroom_participants.destroy({
      where: {
        chatroom_id,
        user_id: participant_id,
      },
    });

    if (removed === 0) {
      return res.status(404).json({
        success: false,
        message: "該用戶不是聊天室的參與者",
      });
    }

    res.status(200).json({
      success: true,
      message: "成功從聊天室移除參與者",
    });
  } catch (error) {
    console.error("移除參與者失敗:", error);
    res.status(500).json({
      success: false,
      message: "移除參與者失敗",
      error: error.message,
    });
  }
};

module.exports = {
  getUserChatrooms,
  createChatroom,
  getChatroomDetails,
  updateChatroomStatus,
  addParticipantToChatroom,
  removeParticipantFromChatroom,
};
