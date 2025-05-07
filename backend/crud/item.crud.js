const {
  models: { items: Item, users: User },
} = require("../config/sequelize");

const sequelize = require("../config/sequelize");

exports.createItem = async (payload) => {
  try {
    const item = await Item.create(payload);
    return item;
  } catch (error) {
    console.error("創建物品失敗:", error);
    throw error;
  }
};

exports.getAllItems = async (query = {}) => {
  try {
    const { category, status, keyword, limit = 20, page = 1 } = query;

    // 建立查詢條件
    const where = {};

    // 如果提供了類別，加入查詢條件
    if (category) {
      where.category = category;
    }

    // 如果提供了狀態(遺失/尋獲)，加入查詢條件
    if (status) {
      where.status = status;
    }

    // 如果提供了關鍵字，搜尋標題和關鍵字欄位
    if (keyword) {
      where[sequelize.Op.or] = [
        { title: { [sequelize.Op.iLike]: `%${keyword}%` } },
        { keywords: { [sequelize.Op.contains]: [keyword] } },
      ];
    }

    // 只取得活躍的物品
    where.is_active = true;

    // 計算分頁
    const offset = (page - 1) * limit;

    // 執行查詢
    const { count, rows } = await Item.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: "creator",
          attributes: ["user_id", "nickname", "avatar_url"],
        },
      ],
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });

    // 返回結果
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
    console.error("獲取物品列表失敗:", error);
    throw error;
  }
};

exports.getItemById = async (itemId) => {
  try {
    const item = await Item.findByPk(itemId, {
      include: [
        {
          model: User,
          as: "creator",
          attributes: ["user_id", "nickname", "avatar_url"],
        },
      ],
    });

    if (!item) {
      throw new Error("物品不存在");
    }

    // 更新瀏覽次數
    await item.increment("view_count");

    return item;
  } catch (error) {
    console.error("獲取物品失敗:", error);
    throw error;
  }
};
