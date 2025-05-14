// config/sequelize.js
const { Sequelize } = require("sequelize");

const usersModel = require("../models/users.model");
const itemsModel = require("../models/items.model");
const itemClaimsModel = require("../models/item_claims.model");
const chatroomsModel = require("../models/chatrooms.model");
const chatroomParticipantsModel = require("../models/chatroom_participants.model");
const messagesModel = require("../models/messages.model");
const notificationsModel = require("../models/notifications.model");
const reportsModel = require("../models/reports.model");
const reservationsModel = require("../models/reservations.model");
const userPointLogModel = require("../models/user_point_log.model");
const foodsModel = require("../models/foods.model");

const modelAssociationSetup = require("../models/modelsAssociationSetup");

const sequelize = new Sequelize({
  dialect: "postgres",
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const modelDefiners = [
  usersModel,
  itemsModel,
  itemClaimsModel,
  chatroomsModel,
  chatroomParticipantsModel,
  messagesModel,
  notificationsModel,
  reportsModel,
  reservationsModel,
  userPointLogModel,
  foodsModel,
];

for (const modelDefiner of modelDefiners) {
  modelDefiner(sequelize);
}

modelAssociationSetup(sequelize);

module.exports = sequelize;

module.exports.sequelizeCheck = async () => {
  try {
    await sequelize
      .authenticate()
      .then(() => console.log("✅ Sequelize 成功連線到 PostgreSQL"))
      .catch((err) => console.error("❌ Sequelize 錯誤：", err));
    await sequelize.sync({ force: true }); // force: true will drop the table if it already exists
  } catch (error) {
    console.log("Unable to connect to the database:", error);
  }
};
