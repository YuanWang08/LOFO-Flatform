const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const UserPointLog = sequelize.define(
    "user_point_logs",
    {
      log_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
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
      },
      points_change: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      reason: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      timestamps: true,
      paranoid: true,
      tableName: "user_point_logs",
    }
  );

  return UserPointLog;
};
