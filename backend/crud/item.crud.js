const {
  models: { items: Item, users: User, item_claims: ItemClaim },
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

    // 如果提供了狀態(active/claimed/closed/withdrawn)，加入查詢條件
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

exports.claimItem = async (itemId, userId) => {
  try {
    // 開始事務
    const transaction = await sequelize.transaction();

    try {
      // 檢查物品是否存在且狀態為 active
      const item = await Item.findByPk(itemId, { transaction });
      if (!item) {
        throw new Error("物品不存在");
      }

      if (item.status !== "active") {
        throw new Error("物品狀態不允許認領");
      }

      // 創建物品認領記錄
      const claim = await ItemClaim.create(
        {
          item_id: itemId,
          claimed_by: userId,
          status: "accepted", // 直接設定為已接受，無論是否允許私訊
        },
        { transaction }
      );

      // 更改物品狀態為已認領
      await item.update({ status: "claimed" }, { transaction });

      // 提交事務
      await transaction.commit();

      return { item, claim };
    } catch (error) {
      // 回滾事務
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error("認領物品失敗:", error);
    throw error;
  }
};

// 更新物品狀態
exports.updateItemStatus = async (itemId, status) => {
  try {
    const item = await Item.findByPk(itemId);
    if (!item) {
      throw new Error("物品不存在");
    }

    await item.update({ status });
    return item;
  } catch (error) {
    console.error("更新物品狀態失敗:", error);
    throw error;
  }
};

// 更新物品資訊
exports.updateItem = async (itemId, updateData) => {
  try {
    const item = await Item.findByPk(itemId);
    if (!item) {
      throw new Error("物品不存在");
    }

    await item.update(updateData);
    return item;
  } catch (error) {
    console.error("更新物品資訊失敗:", error);
    throw error;
  }
};

exports.getSimilarItems = async (itemId) => {
  try {
    const item = await Item.findByPk(itemId);
    if (!item) {
      throw new Error("物品不存在");
    }

    const similarItems = await Item.findAll({
      where: {
        category: item.category,
        // item_id: { [sequelize.Op.ne]: itemId },
      },
      limit: 3,
    });

    return similarItems;
  } catch (error) {
    console.error("獲取相似物品失敗:", error);
    throw error;
  }
};
