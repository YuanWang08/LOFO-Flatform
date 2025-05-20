const Message = require("../models/mongoose_message.model");
const sequelize = require("../config/sequelize");
const { models } = require("../config/sequelize");
const jwt = require("jsonwebtoken");

function socketHandler(io) {
  // 身份驗證中間件
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;

      if (!token) {
        return next(new Error("身份驗證失敗"));
      }

      // 驗證token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 檢查必要的數據
      if (!decoded.sub && !decoded.user_id) {
        return next(new Error("無效的身份認證"));
      }

      const userId = decoded.sub || decoded.user_id;

      // 從資料庫取得用戶信息
      const user = await models.users.findOne({
        where: { user_id: userId },
      });

      if (!user) {
        return next(new Error("用戶不存在"));
      }

      // 將用戶信息存儲在socket對象中
      socket.user = {
        user_id: user.user_id,
        username: user.nickname || user.username,
      };

      return next();
    } catch (error) {
      console.error("Socket認證錯誤:", error);
      return next(new Error("身份驗證失敗"));
    }
  });

  io.on("connection", (socket) => {
    console.log(
      `用戶連接: ${socket.user.username}, ID: ${socket.user.user_id}`
    );

    // 將用戶加入以自己ID為名的房間，用於私人訊息
    socket.join(socket.user.user_id); // 用戶加入聊天室
    socket.on("join-chatroom", async (chatroomId) => {
      try {
        // 檢查用戶是否是聊天室的參與者
        const isParticipant = await models.chatroom_participants.findOne({
          where: {
            chatroom_id: chatroomId,
            user_id: socket.user.user_id,
          },
        });

        if (!isParticipant) {
          socket.emit("error", { message: "您不是此聊天室的參與者" });
          return;
        }

        // 加入特定聊天室的房間
        socket.join(`chatroom:${chatroomId}`);
        console.log(`用戶 ${socket.user.username} 加入聊天室 ${chatroomId}`);
      } catch (error) {
        console.error("加入聊天室錯誤:", error);
        socket.emit("error", { message: "加入聊天室失敗" });
      }
    });

    // 離開聊天室
    socket.on("leave-chatroom", (chatroomId) => {
      socket.leave(`chatroom:${chatroomId}`);
      console.log(`用戶 ${socket.user.username} 離開聊天室 ${chatroomId}`);
    });

    // 發送聊天訊息
    socket.on("send-message", async (data) => {
      try {
        const { chatroom_id, content } = data;

        // 檢查用戶是否是聊天室的參與者
        const isParticipant = await models.chatroom_participants.findOne({
          where: {
            chatroom_id,
            user_id: socket.user.user_id,
          },
        });

        if (!isParticipant) {
          socket.emit("error", { message: "您不是此聊天室的參與者" });
          return;
        }

        // 檢查聊天室是否已關閉
        const chatroom = await models.chatrooms.findByPk(chatroom_id);
        if (chatroom.status === "closed") {
          socket.emit("error", { message: "此聊天室已關閉" });
          return;
        } // 儲存訊息到資料庫
        const newMessage = await models.messages.create({
          chatroom_id,
          sender_id: socket.user.user_id,
          content,
        });

        // 獲取完整的訊息數據，包括發送者信息
        const messageWithSender = await models.messages.findOne({
          where: { message_id: newMessage.message_id },
          include: [
            {
              model: models.users,
              as: "sender",
              attributes: ["user_id", "username", "avatar"],
            },
          ],
        });

        // 廣播訊息給聊天室所有參與者
        io.to(`chatroom:${chatroom_id}`).emit("new-message", messageWithSender);

        // 通知聊天室的其他參與者
        const participants = await models.chatroom_participants.findAll({
          where: {
            chatroom_id,
            user_id: { [sequelize.Sequelize.Op.ne]: socket.user.user_id },
          },
        });

        // 獲取聊天室資訊
        const chatroomInfo = {
          chatroom_id,
          event_type: chatroom.event_type,
          event_id: chatroom.event_id,
          last_message: {
            content,
            created_at: newMessage.createdAt,
            sender_id: socket.user.user_id,
            sender_name: socket.user.username,
          },
        };

        // 向其他參與者發送通知
        participants.forEach((participant) => {
          socket.to(participant.user_id).emit("chatroom-update", chatroomInfo);
        });
      } catch (error) {
        console.error("發送訊息錯誤:", error);
        socket.emit("error", { message: "發送訊息失敗" });
      }
    });

    // 處理私人訊息
    socket.on("private-message", async (data) => {
      try {
        const { receiverId, content } = data;

        if (!receiverId || !content || content.trim() === "") {
          socket.emit("error", { message: "接收者ID和訊息內容不能為空" });
          return;
        }

        // 檢查接收者是否存在
        const receiverExists = await sequelize.models.users.findOne({
          where: { user_id: receiverId },
        });

        if (!receiverExists) {
          socket.emit("error", { message: "接收者不存在" });
          return;
        }

        // 儲存訊息到MongoDB
        const newMessage = new Message({
          senderId: socket.user.user_id,
          receiverId,
          content,
          timestamp: new Date(),
        });

        await newMessage.save();

        // 準備發送的訊息格式
        const messageData = {
          _id: newMessage._id,
          senderId: socket.user.user_id,
          senderName: socket.user.username,
          receiverId,
          content,
          timestamp: newMessage.timestamp,
        };

        // 發送訊息給接收者（如果在線）
        socket.to(receiverId).emit("private-message", messageData);

        // 向發送者確認訊息已送達系統
        socket.emit("message-sent", messageData);
      } catch (error) {
        console.error("發送私人訊息錯誤:", error);
        socket.emit("error", { message: "發送私人訊息失敗" });
      }
    });

    // 處理用戶正在輸入的狀態（聊天室）
    socket.on("typing", ({ chatroom_id, isTyping }) => {
      socket.to(`chatroom:${chatroom_id}`).emit("user-typing", {
        user_id: socket.user.user_id,
        username: socket.user.username,
        isTyping,
      });
    });

    // 處理用戶正在輸入的狀態（私人聊天）
    socket.on("private-typing", ({ receiverId, isTyping }) => {
      socket.to(receiverId).emit("private-user-typing", {
        user_id: socket.user.user_id,
        username: socket.user.username,
        isTyping,
      });
    });

    // 用戶離線
    socket.on("disconnect", () => {
      console.log(
        `用戶離線: ${socket.user.username}, ID: ${socket.user.user_id}`
      );
    });
  });
}

module.exports = socketHandler;
