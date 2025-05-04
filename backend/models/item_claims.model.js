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
      message: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      is_resolved: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        validate: {
          isResolvedValid(value) {
            if (value && !this.resolved_at) {
              throw new Error("resolved_at 必須有值");
            }
          },
        },
      },
      resolved_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      reason: {
        type: DataTypes.TEXT,
        allowNull: true,
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
      tableName: "item_claims",
    }
  );

  return ItemClaim;
};
