// items.model.js
const e = require("express");
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Item = sequelize.define(
    "items",
    {
      created_by: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "user_id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      item_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING(32),
        allowNull: false,
      },
      category: {
        type: DataTypes.ENUM(
          "保溫瓶",
          "手錶",
          "鑰匙",
          "雨傘",
          "有價票券",
          "3C電子",
          "身分證件",
          "運動物品",
          "眼鏡服裝",
          "文具書籍",
          "其他"
        ),
        allowNull: false,
      },
      location: {
        type: DataTypes.STRING(32),
        allowNull: false,
      },

      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      contact: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      image_url: {
        type: DataTypes.STRING(256),
        allowNull: false,
        defaultValue:
          "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-978409_1280.png",
      },
      latitude: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      longitude: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      discover_time: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      keywords: {
        type: DataTypes.ARRAY(DataTypes.TEXT),
        allowNull: true,
      },
      is_with_owner: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      allow_message: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },

      view_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      status: {
        type: DataTypes.ENUM("active", "claimed", "closed", "withdrawn"),
        allowNull: false,
        defaultValue: "active",
      },
    },
    {
      timestamps: true, // 啟用時間戳記
      paranoid: true, // 啟用軟刪除
      tableName: "items",
    }
  );

  return Item;
};
