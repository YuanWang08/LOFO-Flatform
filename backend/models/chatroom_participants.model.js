const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const ChatRoomParticipant = sequelize.define(
    "chatroom_participants",
    {
      chatroom_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "chatrooms",
          key: "chatroom_id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        primaryKey: true, // 設定為主鍵的一部分
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "user_id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        primaryKey: true, // 設定為主鍵的一部分
      },
    },
    {
      timestamps: true,
      paranoid: true,
      tableName: "chatroom_participants",
    }
  );

  return ChatRoomParticipant;
};
