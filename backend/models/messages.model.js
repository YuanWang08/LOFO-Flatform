const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Message = sequelize.define(
    "messages",
    {
      message_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      chatroom_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "chatrooms",
          key: "chatroom_id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      sender_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "user_id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      timestamps: true,
      paranoid: true,
      tableName: "messages",
    }
  );

  return Message;
};
