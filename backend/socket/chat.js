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

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (!decoded.sub && !decoded.user_id) {
        return next(new Error("無效的身份認證"));
      }

      const userId = decoded.sub || decoded.user_id;

      const user = await models.users.findOne({
        where: { user_id: userId },
      });

      if (!user) {
        return next(new Error("用戶不存在"));
      }

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
    socket.join(socket.user.user_id);
    socket.on("join-chatroom", async (chatroomId) => {
      try {
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

        socket.join(`chatroom:${chatroomId}`);
        console.log(`用戶 ${socket.user.username} 加入聊天室 ${chatroomId}`);
      } catch (error) {
        console.error("加入聊天室錯誤:", error);
        socket.emit("error", { message: "加入聊天室失敗" });
      }
    });

    socket.on("leave-chatroom", (chatroomId) => {
      socket.leave(`chatroom:${chatroomId}`);
      console.log(`用戶 ${socket.user.username} 離開聊天室 ${chatroomId}`);
    });

    socket.on("send-message", async (data) => {
      try {
        const { chatroom_id, content } = data;

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

        const chatroom = await models.chatrooms.findByPk(chatroom_id);
        if (chatroom.status === "closed") {
          socket.emit("error", { message: "此聊天室已關閉" });
          return;
        }
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

        io.to(`chatroom:${chatroom_id}`).emit("new-message", messageWithSender);

        const participants = await models.chatroom_participants.findAll({
          where: {
            chatroom_id,
            user_id: { [sequelize.Sequelize.Op.ne]: socket.user.user_id },
          },
        });

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

        const receiverExists = await sequelize.models.users.findOne({
          where: { user_id: receiverId },
        });

        if (!receiverExists) {
          socket.emit("error", { message: "接收者不存在" });
          return;
        }

        const newMessage = new Message({
          senderId: socket.user.user_id,
          receiverId,
          content,
          timestamp: new Date(),
        });

        await newMessage.save();

        const messageData = {
          _id: newMessage._id,
          senderId: socket.user.user_id,
          senderName: socket.user.username,
          receiverId,
          content,
          timestamp: newMessage.timestamp,
        };

        socket.to(receiverId).emit("private-message", messageData);
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

    socket.on("disconnect", () => {
      console.log(
        `用戶離線: ${socket.user.username}, ID: ${socket.user.user_id}`
      );
    });
  });
}

module.exports = socketHandler;
