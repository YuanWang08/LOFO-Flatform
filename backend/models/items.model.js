// items.model.js
const e = require("express");
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Item = sequelize.define(
    "items",
    {
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
        type: DataTypes.STRING(8),
        allowNull: false,
      },
      location: {
        type: DataTypes.STRING(32),
        allowNull: false,
      },
      discover_time: {
        type: DataTypes.DATE,
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
      keywords: {
        type: DataTypes.ARRAY(DataTypes.TEXT), // 使用 ARRAY 和 TEXT
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM("lost", "found"),
        allowNull: false,
        defaultValue: "lost",
      },
      holding_state: {
        type: DataTypes.STRING(32),
        allowNull: false,
        defaultValue: "holding",
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      view_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
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
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      timestamps: false,
    }
  );

  return Item;
};
