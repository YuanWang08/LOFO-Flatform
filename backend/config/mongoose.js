const mongoose = require("mongoose");
require("dotenv").config();

const MONGO_URL = process.env.MONGO_URL;
console.log("Connecting to MongoDB at:", MONGO_URL);

mongoose
  .connect(MONGO_URL)
  .then(() => console.log("MongoDB 連接成功"))
  .catch((err) => console.error("MongoDB 連接失敗:", err));

module.exports = mongoose;
