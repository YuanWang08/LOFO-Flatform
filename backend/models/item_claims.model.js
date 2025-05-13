// item_claims.model.js
const e = require("express");
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const ItemClaim = sequelize.define(
    "item_claims",
    {
      claim_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      item_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "items",
          key: "item_id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      claimed_by: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "user_id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      status: {
        type: DataTypes.ENUM("pending", "accepted", "rejected"),
        allowNull: false,
        defaultValue: "pending",
      },
    },
    {
      timestamps: true, // 啟用時間戳記
      paranoid: true, // 啟用軟刪除
      tableName: "item_claims",
    }
  );

  return ItemClaim;
};
