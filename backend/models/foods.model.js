// foods.model.js
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Food = sequelize.define(
    "foods",
    {
      food_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
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
      title: {
        type: DataTypes.STRING(32),
        allowNull: false,
      },
      category: {
        type: DataTypes.ENUM(
          "即期品",
          "水果",
          "蔬菜",
          "飲料",
          "零食",
          "烘焙食品",
          "剩菜"
        ),
        allowNull: false,
      },
      image_url: {
        type: DataTypes.STRING(256),
        allowNull: true,
        defaultValue:
          "https://cdn.pixabay.com/photo/2016/12/26/17/28/food-1932466_1280.jpg",
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      expire_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      location: {
        type: DataTypes.STRING(32),
        allowNull: false,
      },
      latitude: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      longitude: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      pickup_method: {
        type: DataTypes.ENUM("self", "reserve"),
        allowNull: false,
      },
      allow_message: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      view_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      status: {
        type: DataTypes.ENUM("active", "claimed", "expired", "withdrawn"),
        allowNull: false,
      },
    },
    {
      timestamps: true, // 啟用時間戳記
      paranoid: true, // 啟用軟刪除
      tableName: "foods",
    }
  );

  return Food;
};
