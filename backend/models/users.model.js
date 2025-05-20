// users.model.js
const e = require("express");
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const User = sequelize.define(
    "users",
    {
      user_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      identifier: {
        type: DataTypes.STRING(16),
        allowNull: true,
        unique: true,
      },
      nickname: {
        type: DataTypes.STRING(16),
        allowNull: false,
        defaultValue: "new user",
      },
      email: {
        type: DataTypes.STRING(64),
        allowNull: true,
        unique: true,
      },
      avatar_url: {
        type: DataTypes.STRING(256),
        allowNull: true,
        defaultValue: "https://cdn2.ettoday.net/images/5268/5268947.jpg",
      },
      level: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      points: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      password_hash: {
        type: DataTypes.STRING(128),
        allowNull: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      phone: {
        type: DataTypes.STRING(16),
        allowNull: true,
      },
      discord_webhook: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      enabled_discord_notifacation: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      enable_email_notifacation: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      tableName: "users",
      timestamps: true, // 啟用時間戳記
      paranoid: true, // 啟用軟刪除
    }
  );

  return User; // ✅ 一定要 return 出來！
};
