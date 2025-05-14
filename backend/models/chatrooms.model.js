//chatrooms.model.js
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const ChatRoom = sequelize.define(
    "chatrooms",
    {
      chatroom_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      event_type: {
        type: DataTypes.ENUM("lost", "food"),
        allowNull: false,
      },
      event_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("open", "closed"),
        allowNull: false,
        defaultValue: "open",
      },
    },
    {
      timestamps: true, // 啟用時間戳記
      paranoid: true, // 啟用軟刪除
      tableName: "chatrooms",
    }
  );

  return ChatRoom;
};
