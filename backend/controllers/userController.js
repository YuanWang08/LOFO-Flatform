const jwt = require("jsonwebtoken");
const UserCrud = require("../crud/user.crud");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const path = require("path");

const resetTokens = {};

const getToken = async (id) => {
  return jwt.sign({}, process.env.JWT_SECRET, {
    subject: id,
    expiresIn: "1d",
    issuer: process.env.BACKEND_HOST,
  });
};

exports.auth = async (req, res) => {
  // 檢查是否來自 Google 登入
  const isGoogleAuth = req.authInfo.provider === "google";
  let user;

  if (isGoogleAuth) {
    // 使用 email 作為識別符，尋找或創建用戶
    user = await UserCrud.findOrCreateByEmail(req.authInfo.profile.email, {
      provider: "google",
      name: req.authInfo.profile.name || null,
      profile_image: req.authInfo.profile.picture || null,
    });
  } else {
    // 原有的 Portal 登入流程
    user = await UserCrud.findOrCreate(req.authInfo.identifier);
  }

  if (!user) {
    return res.status(500).json({
      error: "creating user failed",
    });
  }

  if (req.query.notRedirect !== undefined) {
    return res.status(200).json({
      token: await getToken(user.id),
    });
  }

  // 處理重導向
  const userId = isGoogleAuth ? user.user_id : user[0]["user_id"];
  const token = await getToken(userId);
  return res.redirect(`${process.env.FRONTEND_BASE_URL}/token?token=${token}`);
};

exports.getFakeToken = async (req, res) => {
  const user = await UserCrud.findOrCreate(req.authInfo.identifier);
  if (!user) {
    return res.status(500).json({
      error: "creating user failed",
    });
  }

  if (req.query.notRedirect !== undefined) {
    return res.status(200).json({
      token: await getToken(user.id),
    });
  }

  return res.status(200).json({
    token: await getToken(user[0]["user_id"]),
  });
};

exports.getUserInfo = async (req, res) => {
  try {
    const user = await UserCrud.findUserById(req.id);

    delete user.dataValues.password_hash;
    delete user.dataValues.createdAt;
    delete user.dataValues.updatedAt;
    delete user.dataValues.deletedAt;

    // 加上 已發布遺失物數量
    const uploadItemsCount = await UserCrud.getUploadItemsCount(req.id);
    user.dataValues.upload_items_count = uploadItemsCount;
    // 加上 已發布食物數量
    const uploadFoodsCount = await UserCrud.getUploadFoodsCount(req.id);
    user.dataValues.upload_foods_count = uploadFoodsCount;
    // 加上 已幫助他人數量
    const helpCount = await UserCrud.getHelpCount(req.id);
    user.dataValues.help_count = helpCount;

    return res.status(200).json(user);
  } catch (error) {
    console.error("Error in getUserInfo:", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

exports.updateUserInfo = async (req, res) => {
  try {
    const userId = req.id;
    const { ...userInfo } = req.body;
    await UserCrud.updateUserInfo(userId, userInfo);
    return res.status(200).json({
      message: "User info updated successfully",
    });
  } catch (error) {
    console.error("Error in updateUserInfo:", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

exports.getUserPublicInfo = async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "用戶ID不能為空",
      });
    }

    // 從數據庫獲取用戶信息
    const user = await UserCrud.findUserById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "用戶不存在",
      });
    }

    // 返回公開的用戶信息
    return res.status(200).json({
      success: true,
      data: {
        user_id: user.user_id,
        nickname: user.nickname || "用戶",
        avatar_url: user.avatar_url || null,
      },
    });
  } catch (error) {
    console.error("獲取用戶公開信息失敗:", error);
    return res.status(500).json({
      success: false,
      message: "獲取用戶信息失敗",
    });
  }
};

exports.check = async (req, res) => {
  try {
    return res.status(200).json({
      message: "User is authenticated",
    });
  } catch (error) {
    console.error("Error in check:", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

// 註冊新用戶
exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "電子郵件和密碼為必填欄位",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "請提供有效的電子郵件地址",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "密碼長度必須至少為 8 個字元",
      });
    }

    const existingUser = await UserCrud.findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "此電子郵件已被註冊",
      });
    }

    // 建立新用戶
    const user = await UserCrud.createUser({
      email,
      password,
    });

    const token = await getToken(user.user_id);

    return res.status(201).json({
      success: true,
      message: "註冊成功",
      token,
    });
  } catch (error) {
    console.error("註冊失敗:", error);
    return res.status(500).json({
      success: false,
      message: "伺服器錯誤，註冊失敗",
      error: error.message,
    });
  }
};

// 用戶登入
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "電子郵件和密碼為必填欄位",
      });
    }

    const user = await UserCrud.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "電子郵件或密碼不正確",
      });
    }

    const isPasswordValid = await UserCrud.verifyPassword(user, password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "電子郵件或密碼不正確",
      });
    }

    const token = await getToken(user.user_id);

    return res.status(200).json({
      success: true,
      message: "登入成功",
      token,
    });
  } catch (error) {
    console.error("登入失敗:", error);
    return res.status(500).json({
      success: false,
      message: "伺服器錯誤，登入失敗",
      error: error.message,
    });
  }
};

// 發送重設密碼電子郵件
exports.resetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "請提供電子郵件地址",
      });
    }

    const user = await UserCrud.findUserByEmail(email);
    if (!user) {
      return res.status(200).json({
        success: true,
        message: "如果此電子郵件已註冊，重設密碼指示將發送到您的信箱",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const expiresAt = Date.now() + 3600000;

    // 存儲令牌與用戶關聯
    resetTokens[resetToken] = {
      userId: user.user_id,
      expiresAt,
    };

    // TODO: 設定正確的郵件傳送系統
    // 沒有要做

    // 返回令牌（實際應用中應發送電子郵件）
    return res.status(200).json({
      success: true,
      message: "如果此電子郵件已註冊，重設密碼指示將發送到您的信箱",
      resetToken: resetToken, // 僅供測試
    });
  } catch (error) {
    console.error("重設密碼請求失敗:", error);
    return res.status(500).json({
      success: false,
      message: "伺服器錯誤，無法處理重設密碼請求",
      error: error.message,
    });
  }
};

// 使用令牌重設密碼
exports.confirmResetPassword = async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;

    if (!resetToken || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "缺少必要參數",
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: "新密碼長度必須至少為 8 個字元",
      });
    }

    const tokenData = resetTokens[resetToken];
    if (!tokenData || tokenData.expiresAt < Date.now()) {
      return res.status(401).json({
        success: false,
        message: "重設令牌無效或已過期",
      });
    }

    await UserCrud.updatePassword(tokenData.userId, newPassword);

    delete resetTokens[resetToken];

    return res.status(200).json({
      success: true,
      message: "密碼已成功重設",
    });
  } catch (error) {
    console.error("重設密碼失敗:", error);
    return res.status(500).json({
      success: false,
      message: "伺服器錯誤，無法重設密碼",
      error: error.message,
    });
  }
};

// 更新密碼
exports.updatePassword = async (req, res) => {
  try {
    const userId = req.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "當前密碼和新密碼為必填欄位",
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: "新密碼長度必須至少為 8 個字元",
      });
    }

    const user = await UserCrud.findUserById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "用戶不存在",
      });
    }

    const isPasswordValid = await UserCrud.verifyPassword(
      user,
      currentPassword
    );
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "當前密碼不正確",
      });
    }

    await UserCrud.updatePassword(userId, newPassword);

    return res.status(200).json({
      success: true,
      message: "密碼已成功更新",
    });
  } catch (error) {
    console.error("更新密碼失敗:", error);
    return res.status(500).json({
      success: false,
      message: "伺服器錯誤，無法更新密碼",
      error: error.message,
    });
  }
};

// 簡易更新密碼（不需要驗證舊密碼）
exports.simpleUpdatePassword = async (req, res) => {
  try {
    const userId = req.id;
    const { newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({
        success: false,
        message: "新密碼為必填欄位",
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: "新密碼長度必須至少為 8 個字元",
      });
    }

    const user = await UserCrud.findUserById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "用戶不存在",
      });
    }

    await UserCrud.updatePassword(userId, newPassword);

    return res.status(200).json({
      success: true,
      message: "密碼已成功更新",
    });
  } catch (error) {
    console.error("更新密碼失敗:", error);
    return res.status(500).json({
      success: false,
      message: "伺服器錯誤，無法更新密碼",
      error: error.message,
    });
  }
};

// 上傳用戶頭像
exports.uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "沒有上傳任何頭像圖片",
      });
    }

    const userId = req.id;
    const relativePath = `/uploads/avatar/${path.basename(req.file.path)}`;
    await UserCrud.updateUserInfo(userId, { avatar_url: relativePath });

    return res.status(200).json({
      success: true,
      message: "頭像上傳成功",
      data: {
        avatar_url: relativePath,
      },
    });
  } catch (error) {
    console.error("頭像上傳失敗:", error);
    return res.status(500).json({
      success: false,
      message: "伺服器錯誤，無法上傳頭像",
      error: error.message,
    });
  }
};
