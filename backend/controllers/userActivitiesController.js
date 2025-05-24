const UserActivitiesCrud = require("../crud/user_activities.crud");

exports.getUserItems = async (req, res) => {
  try {
    const userId = req.id;
    const { status, page, limit } = req.query;

    // 獲取用戶物品列表
    const result = await UserActivitiesCrud.getItemsByUserId(userId, {
      status,
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 20,
    });

    return res.status(200).json({
      success: true,
      message: "獲取用戶物品列表成功",
      data: result.items,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error("獲取用戶物品列表失敗:", error);
    return res.status(500).json({
      success: false,
      message: "伺服器錯誤，無法獲取用戶物品列表",
      error: error.message,
    });
  }
};

exports.getUserFoods = async (req, res) => {
  try {
    const userId = req.id;
    const { status, page, limit } = req.query;

    // 獲取用戶食物列表
    const result = await UserActivitiesCrud.getFoodsByUserId(userId, {
      status,
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 20,
    });

    return res.status(200).json({
      success: true,
      message: "獲取用戶食物列表成功",
      data: result.foods,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error("獲取用戶食物列表失敗:", error);
    return res.status(500).json({
      success: false,
      message: "伺服器錯誤，無法獲取用戶食物列表",
      error: error.message,
    });
  }
};
