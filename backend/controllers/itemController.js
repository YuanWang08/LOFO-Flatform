const ItemCrud = require("../crud/item.crud");

// 創建新的物品
exports.createItem = async (req, res) => {
  try {
    // 從認證中獲取用戶ID
    const userId = req.id;

    // 準備payload，添加用戶ID作為創建者
    const payload = {
      ...req.body,
      created_by: userId,
    };

    // 檢查必要的欄位
    const requiredFields = [
      "title",
      "category",
      "location",
      "discover_time",
      "latitude",
      "longitude",
      "holding_state",
    ];
    for (const field of requiredFields) {
      if (!payload[field]) {
        return res.status(400).json({
          success: false,
          message: `缺少必要欄位: ${field}`,
        });
      }
    }

    // 創建物品
    const item = await ItemCrud.createItem(payload);

    return res.status(201).json({
      success: true,
      message: "物品創建成功",
      data: item,
    });
  } catch (error) {
    console.error("創建物品失敗:", error);
    return res.status(500).json({
      success: false,
      message: "伺服器錯誤，無法創建物品",
      error: error.message,
    });
  }
};

// 獲取所有物品，支持分頁和篩選
exports.getAllItems = async (req, res) => {
  try {
    // 從查詢參數獲取篩選條件
    const { category, status, keyword, page, limit } = req.query;

    // 獲取物品列表
    const result = await ItemCrud.getAllItems({
      category,
      status,
      keyword,
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 20,
    });

    return res.status(200).json({
      success: true,
      message: "獲取物品列表成功",
      data: result.items,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error("獲取物品列表失敗:", error);
    return res.status(500).json({
      success: false,
      message: "伺服器錯誤，無法獲取物品列表",
      error: error.message,
    });
  }
};

// 根據ID獲取單一物品
exports.getItemById = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await ItemCrud.getItemById(id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "找不到指定物品",
      });
    }

    return res.status(200).json({
      success: true,
      message: "獲取物品成功",
      data: item,
    });
  } catch (error) {
    console.error("獲取物品失敗:", error);
    return res.status(500).json({
      success: false,
      message: "伺服器錯誤，無法獲取物品",
      error: error.message,
    });
  }
};
