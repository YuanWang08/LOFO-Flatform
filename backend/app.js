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

sequelizeCheck();

initializeNotificationScheduler();

const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

socketHandler(io);

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  // 測試通知功能
  testNotification();
});

app.use(logger("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static("public"));

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
