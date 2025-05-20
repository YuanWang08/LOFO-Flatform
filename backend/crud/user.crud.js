const {
  models: { users: User, items: Item },
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

exports.getUploadItemsCount = async (userId) => {
  try {
    const count = await Item.count({
      where: {
        created_by: userId,
      },
    });
    return count;
  } catch (error) {
    console.error("Error getting upload items count:", error.message);
    return 0;
  }
};

exports.getUploadFoodsCount = async (userId) => {
  try {
    // 引入 Food 模型
    const {
      models: { foods: Food },
    } = require("../config/sequelize");

    const count = await Food.count({
      where: {
        created_by: userId,
      },
    });
    return count;
  } catch (error) {
    console.error("Error getting upload foods count:", error.message);
    return 0;
  }
};

exports.getHelpCount = async (userId) => {
  try {
    // 引入必要的模型
    const {
      models: {
        items: Item,
        foods: Food,
        item_claims: ItemClaim,
        reservations: Reservation,
      },
    } = require("../config/sequelize");

    // 計算用戶發布的物品被他人認領並確認的數量
    // 首先找出用戶發布的所有物品ID
    const userItems = await Item.findAll({
      where: {
        created_by: userId,
      },
      attributes: ["item_id"],
    });

    const userItemIds = userItems.map((item) => item.item_id);

    // 然後計算這些物品中被他人成功認領的數量
    const itemsHelpCount =
      userItemIds.length > 0
        ? await ItemClaim.count({
            where: {
              item_id: userItemIds,
              status: "accepted",
            },
          })
        : 0;

    // 計算用戶分享食物幫助他人的數量（用戶是食物的創建者且狀態為已被領取）
    const foodsHelpCount = await Food.count({
      where: {
        created_by: userId,
        status: "claimed",
      },
    });

    // 計算用戶分享食物別人預約的數量
    // const reservationsCount = await Reservation.count({
    //   where: {
    //     food_id: userItemIds,
    //   },
    // });

    // 總協助數量是物品被成功認領的數量加上食物被成功領取的數量
    return itemsHelpCount + foodsHelpCount;
  } catch (error) {
    console.error("Error getting help count:", error.message);
    return 0;
  }
};
