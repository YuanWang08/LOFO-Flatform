// socketService.js
const jwt = require("jsonwebtoken");
const db = require("./config/sequelize");

// 初始化Socket.IO
const initSocketIO = (server) => {
  const io = require("socket.io")(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:3000", // 前端網址
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  // socket.io中間件，進行身份驗證
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;

      if (!token) {
        return next(new Error("身份驗證失敗"));
      }

      // 驗證token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 從資料庫取得用戶信息
      const user = await db.users.findOne({
        where: { user_id: decoded.user_id },
      });

      if (!user) {
        return next(new Error("用戶不存在"));
      }

      // 將用戶信息存儲在socket對象中
      socket.user = {
        user_id: user.user_id,
        username: user.username,
      };

      return next();
    } catch (error) {
      console.error("Socket認證錯誤:", error);
      return next(new Error("身份驗證失敗"));
    }
  });

  // 連線處理
  io.on("connection", (socket) => {
    console.log(
      `用戶連接: ${socket.user.username}, ID: ${socket.user.user_id}`
    );

    // 將用戶加入以自己ID為名的房間，用於私人訊息
    socket.join(socket.user.user_id);

    // 用戶加入聊天室
    socket.on("join-chatroom", async (chatroomId) => {
      try {
        // 檢查用戶是否是聊天室的參與者
        const isParticipant = await db.chatroom_participants.findOne({
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
        const isParticipant = await db.chatroom_participants.findOne({
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
        const chatroom = await db.chatrooms.findByPk(chatroom_id);
        if (chatroom.status === "closed") {
          socket.emit("error", { message: "此聊天室已關閉" });
          return;
        }

        // 儲存訊息到資料庫
        const newMessage = await db.messages.create({
          chatroom_id,
          sender_id: socket.user.user_id,
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

        // 廣播訊息給聊天室所有參與者
        io.to(`chatroom:${chatroom_id}`).emit("new-message", messageWithSender);

        // 通知聊天室的其他參與者
        const participants = await db.chatroom_participants.findAll({
          where: {
            chatroom_id,
            user_id: { [db.Sequelize.Op.ne]: socket.user.user_id },
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

    // 處理用戶正在輸入的狀態
    socket.on("typing", ({ chatroom_id, isTyping }) => {
      socket.to(`chatroom:${chatroom_id}`).emit("user-typing", {
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

  return io;
};

module.exports = { initSocketIO };
