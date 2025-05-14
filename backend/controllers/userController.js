const jwt = require("jsonwebtoken");
const UserCrud = require("../crud/user.crud");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

// 用於儲存重設密碼的令牌
const resetTokens = {};

const getToken = async (id) => {
  return jwt.sign({}, process.env.JWT_SECRET, {
    subject: id,
    expiresIn: "1d",
    issuer: process.env.BACKEND_HOST,
  });
};

exports.auth = async (req, res) => {
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

  // return res.status(200).json({
  //   token: await getToken(user[0]["user_id"]),
  // });
  return res.redirect(
    `${process.env.FRONTEND_BASE_URL}/token?token=${await getToken(
      user[0]["user_id"]
    )}`
  );
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

    delete user.dataValues.user_id;
    delete user.dataValues.password_hash;
    delete user.dataValues.createdAt;
    delete user.dataValues.updatedAt;
    delete user.dataValues.deletedAt;
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

    // 驗證必填欄位
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "電子郵件和密碼為必填欄位",
      });
    }

    // 檢查電子郵件格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "請提供有效的電子郵件地址",
      });
    }

    // 檢查密碼長度
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "密碼長度必須至少為 8 個字元",
      });
    }

    // 檢查電子郵件是否已被使用
    const existingUser = await UserCrud.findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "此電子郵件已被註冊",
      });
    }

    // 建立新用戶，不指定 nickname，使用模型中的預設值
    const user = await UserCrud.createUser({
      email,
      password,
    });

    // 生成 JWT
    const token = await getToken(user.user_id);

    // 回傳成功訊息和令牌
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

    // 驗證必填欄位
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "電子郵件和密碼為必填欄位",
      });
    }

    // 查詢用戶
    const user = await UserCrud.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "電子郵件或密碼不正確",
      });
    }

    // 驗證密碼
    const isPasswordValid = await UserCrud.verifyPassword(user, password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "電子郵件或密碼不正確",
      });
    }

    // 生成 JWT
    const token = await getToken(user.user_id);

    // 回傳成功訊息和令牌
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

    // 檢查用戶是否存在
    const user = await UserCrud.findUserByEmail(email);
    if (!user) {
      // 為了安全，即使用戶不存在也返回相同的訊息
      return res.status(200).json({
        success: true,
        message: "如果此電子郵件已註冊，重設密碼指示將發送到您的信箱",
      });
    }

    // 生成重設令牌
    const resetToken = crypto.randomBytes(32).toString("hex");
    const expiresAt = Date.now() + 3600000; // 令牌有效期為一小時

    // 存儲令牌與用戶關聯
    resetTokens[resetToken] = {
      userId: user.user_id,
      expiresAt,
    };

    // 在真實環境中，這裡應該發送電子郵件
    // 為了示範，我們直接回傳令牌
    // TODO: 設定正確的郵件傳送系統

    // 返回令牌（實際應用中應發送電子郵件）
    return res.status(200).json({
      success: true,
      message: "如果此電子郵件已註冊，重設密碼指示將發送到您的信箱",
      resetToken: resetToken, // 僅供測試，實際環境中不應回傳
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

    // 檢查令牌是否有效
    const tokenData = resetTokens[resetToken];
    if (!tokenData || tokenData.expiresAt < Date.now()) {
      return res.status(401).json({
        success: false,
        message: "重設令牌無效或已過期",
      });
    }

    // 更新用戶密碼
    await UserCrud.updatePassword(tokenData.userId, newPassword);

    // 刪除使用過的令牌
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

// 更新密碼（已登入用戶）
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

    // 獲取用戶資訊
    const user = await UserCrud.findUserById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "用戶不存在",
      });
    }

    // 驗證當前密碼
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

    // 更新密碼
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
