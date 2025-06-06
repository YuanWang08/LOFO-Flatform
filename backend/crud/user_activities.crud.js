const {
  models: { items: Item, users: User, foods: Food },
} = require("../config/sequelize");

/**
 * 獲取用戶發布的物品列表
 * @param {string} userId - 用戶ID
 * @param {Object} query - 查詢參數
 * @returns {Promise<{items: Array, pagination: Object}>} - 用戶物品列表和分頁信息
 */
exports.getItemsByUserId = async (userId, query = {}) => {
  try {
    const { status, limit = 20, page = 1 } = query;

    const where = {
      created_by: userId,
    };

    if (status && status !== "all") {
      where.status = status;
    }

    const offset = (page - 1) * limit;

    const { count, rows } = await Item.findAndCountAll({
      where,
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });

    return {
      items: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit),
      },
    };
  } catch (error) {
    console.error("獲取用戶物品失敗:", error);
    throw error;
  }
};

/**
 * 獲取用戶發布的食物列表
 * @param {string} userId - 用戶ID
 * @param {Object} query - 查詢參數
 * @returns {Promise<{foods: Array, pagination: Object}>} - 用戶食物列表和分頁信息
 */
exports.getFoodsByUserId = async (userId, query = {}) => {
  try {
    const { status, limit = 20, page = 1 } = query;

    const where = {
      created_by: userId,
    };

    if (status && status !== "all") {
      where.status = status;
    }

    const offset = (page - 1) * limit;

    const { count, rows } = await Food.findAndCountAll({
      where,
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });

    return {
      foods: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit),
      },
    };
  } catch (error) {
    console.error("獲取用戶食物失敗:", error);
    throw error;
  }
};
