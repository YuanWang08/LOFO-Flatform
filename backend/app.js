// app.js
const express = require("express");
var createError = require("http-errors");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const path = require("path");
const http = require("http");
const socketIo = require("socket.io");
const socketHandler = require("./socket/chat");
const {
  initializeNotificationScheduler,
  testNotification,
} = require("./services/notification.service");
require("dotenv").config();
const port = process.env.PORT || 3000;
var { sequelizeCheck } = require("./config/sequelize");

var indexRouter = require("./routes/index.route");

var app = express();
app.use(express.json());

// 檢查並設定合適的資料庫連接
sequelizeCheck();

// 初始化通知排程服務
initializeNotificationScheduler();

// 創建HTTP服務器實例
const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

socketHandler(io);

// 啟動HTTP伺服器（而不是Express應用）
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  // 測試通知功能
  testNotification();
});

app.use(logger("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static("public"));

// 設置上傳文件的靜態訪問路徑
app.use("/api/uploads", express.static(path.join(__dirname, "uploads")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Authorization"
  );
  next();
});

app.use("/api", indexRouter);
