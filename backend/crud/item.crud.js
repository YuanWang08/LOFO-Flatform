const { Op } = require("sequelize");
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

    const where = {};

    if (category) {
      where.category = category;
    }

    // active/claimed/closed/withdrawn
    if (status) {
      where.status = status;
    }

    if (keyword) {
      where[sequelize.Op.or] = [
        { title: { [sequelize.Op.iLike]: `%${keyword}%` } },
        { keywords: { [sequelize.Op.contains]: [keyword] } },
      ];
    }

    const offset = (page - 1) * limit;

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
    const transaction = await sequelize.transaction();

    try {
      const item = await Item.findByPk(itemId, { transaction });
      if (!item) {
        throw new Error("物品不存在");
      }

      if (item.status !== "active") {
        throw new Error("物品狀態不允許認領");
      }

      const claim = await ItemClaim.create(
        {
          item_id: itemId,
          claimed_by: userId,
          status: "accepted",
        },
        { transaction }
      );

      await item.update({ status: "claimed" }, { transaction });

      await transaction.commit();

      return { item, claim };
    } catch (error) {
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
        item_id: { [Op.ne]: itemId },
      },
      limit: 3,
    });

    return similarItems;
  } catch (error) {
    console.error("獲取相似物品失敗:", error);
    throw error;
  }
};
