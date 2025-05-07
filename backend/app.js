// app.js
const express = require("express");
var createError = require("http-errors");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const path = require("path");
require("dotenv").config();
const port = process.env.PORT || 3000;
var { sequelizeCheck } = require("./config/sequelize");

var indexRouter = require("./routes/index.route");

var app = express();
app.use(express.json());

// 檢查並設定合適的資料庫連接
sequelizeCheck();

// 啟動伺服器
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

app.use(logger("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static("public"));

// 設置上傳文件的靜態訪問路徑
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

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
