const {
  models: { users: User },
} = require("../config/sequelize");

const sequelize = require("../config/sequelize");
const bcrypt = require("bcrypt");

exports.findOrCreate = async (identifier) => {
  const user = await User.findOrCreate({
    where: { identifier },
  });
  return user;
};

exports.findUserById = async (userId) => {
  try {
    return await User.findByPk(userId);
  } catch (error) {
    console.error("Error finding user by id:", error.message);
    throw error;
  }
};

exports.findUserByEmail = async (email) => {
  try {
    return await User.findOne({
      where: { email },
    });
  } catch (error) {
    console.error("Error finding user by email:", error.message);
    throw error;
  }
};

// 根據 Email 查找用戶，若不存在則創建
exports.findOrCreateByEmail = async (email, additionalData = {}) => {
  try {
    let user = await User.findOne({
      where: { email },
    });

    if (!user) {
      user = await User.create({
        email,
        ...additionalData,
      });
    } else {
      // 如果用戶存在且有額外資料需要更新
      if (Object.keys(additionalData).length > 0) {
        await user.update(additionalData);
      }
    }

    return user;
  } catch (error) {
    console.error("Error finding or creating user by email:", error.message);
    throw error;
  }
};

exports.createUser = async (userData) => {
  try {
    // 雜湊密碼
    if (userData.password) {
      const salt = await bcrypt.genSalt(10);
      userData.password_hash = await bcrypt.hash(userData.password, salt);
      delete userData.password;
    }

    // 建立使用者
    const user = await User.create(userData);
    return user;
  } catch (error) {
    console.error("Error creating user:", error.message);
    throw error;
  }
};

exports.updateUserInfo = async (userId, payload) => {
  try {
    let transaction;
    transaction = await sequelize.transaction();
    await User.update(
      payload,
      { where: { user_id: userId } },
      {
        transaction,
      }
    );
    await transaction.commit();
  } catch (error) {
    if (transaction) {
      await transaction.rollback();
    }
    console.error("Error updating user info:", error.message);
    throw error;
  }
};

exports.updatePassword = async (userId, newPassword) => {
  try {
    let transaction;
    transaction = await sequelize.transaction();

    // 雜湊新密碼
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(newPassword, salt);

    // 更新密碼
    await User.update(
      { password_hash },
      {
        where: { user_id: userId },
        transaction,
      }
    );
    await transaction.commit();
    return true;
  } catch (error) {
    if (transaction) {
      await transaction.rollback();
    }
    console.error("Error updating password:", error.message);
    throw error;
  }
};

exports.verifyPassword = async (user, password) => {
  try {
    if (!user || !user.password_hash) return false;
    return await bcrypt.compare(password, user.password_hash);
  } catch (error) {
    console.error("Error verifying password:", error.message);
    return false;
  }
};
