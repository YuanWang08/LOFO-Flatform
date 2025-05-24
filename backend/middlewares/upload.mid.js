const multer = require("multer");
const path = require("path");
const fs = require("fs");

// 根據請求路徑確定存儲位置的通用函數
const createStorage = (folderName) => {
  return multer.diskStorage({
    destination: function (req, file, cb) {
      const uploadPath = path.join(__dirname, `../uploads/${folderName}`);

      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }

      cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
      // 生成唯一的文件名 (時間戳 + 原始文件名)
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const extname = path.extname(file.originalname);
      cb(null, uniqueSuffix + extname);
    },
  });
};

// 文件類型過濾
const fileFilter = (req, file, cb) => {
  // 只允許圖片文件
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("只允許上傳圖片文件!"), false);
  }
};

// 創建 multer 實例
const itemUpload = multer({
  storage: createStorage("item"),
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 限制上傳大小為 5MB
  },
});

// 創建食物圖片上傳的 multer 實例
const foodUpload = multer({
  storage: createStorage("food"),
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

// 創建頭像上傳的 multer 實例
const avatarUpload = multer({
  storage: createStorage("avatar"),
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

// 單一圖片上傳中介件
exports.singleItemImage = itemUpload.single("image");
exports.singleFoodImage = foodUpload.single("image");
exports.singleAvatar = avatarUpload.single("avatar");

// 錯誤處理中介件
exports.handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // Multer 錯誤處理
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "檔案過大，最大限制為 5MB",
      });
    }
    return res.status(400).json({
      success: false,
      message: "檔案上傳錯誤: " + err.message,
    });
  } else if (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
  next();
};
