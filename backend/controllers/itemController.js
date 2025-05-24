const ItemCrud = require("../crud/item.crud");
const path = require("path");

// 創建新的物品
exports.createItem = async (req, res) => {
  try {
    const userId = req.id;

    const payload = {
      ...req.body,
      created_by: userId,
    };

    // 特別處理 keywords 欄位，確保它是陣列格式
    if (req.body.keywords) {
      if (typeof req.body.keywords === "string") {
        try {
          if (req.body.keywords.trim().startsWith("[")) {
            payload.keywords = JSON.parse(req.body.keywords);
          } else {
            payload.keywords = [req.body.keywords];
          }
        } catch (e) {
          payload.keywords = [req.body.keywords];
        }
      } else if (Array.isArray(req.body.keywords)) {
        payload.keywords = req.body.keywords;
      } else {
        payload.keywords = [req.body.keywords].filter(Boolean);
      }
    } else {
      payload.keywords = [];
    }

    // 確保 keywords 是陣列類型
    if (!Array.isArray(payload.keywords)) {
      payload.keywords = [];
    }

    const requiredFields = [
      "title",
      "category",
      "location",
      "discover_time",
      "latitude",
      "longitude",
      "description",
      "contact",
      "status",
      "is_with_owner",
      "allow_message",
    ];
    for (const field of requiredFields) {
      if (!payload[field]) {
        return res.status(400).json({
          success: false,
          message: `缺少必要欄位: ${field}`,
        });
      }
    }

    // 處理上傳的圖片
    if (req.file) {
      const relativePath = `/uploads/item/${path.basename(req.file.path)}`;
      payload.image_url = relativePath;
    }

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

// 上傳物品圖片
exports.uploadItemImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "沒有上傳任何圖片",
      });
    }

    const relativePath = `/uploads/item/${path.basename(req.file.path)}`;

    return res.status(200).json({
      success: true,
      message: "圖片上傳成功",
      data: {
        image_url: relativePath,
      },
    });
  } catch (error) {
    console.error("圖片上傳失敗:", error);
    return res.status(500).json({
      success: false,
      message: "伺服器錯誤，無法上傳圖片",
      error: error.message,
    });
  }
};

// 獲取所有物品，支持分頁和篩選
exports.getAllItems = async (req, res) => {
  try {
    const { category, status, keyword, page, limit } = req.query;

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

// 使用者認領物品
exports.claimItem = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.id;

    const result = await ItemCrud.claimItem(id, userId);

    return res.status(200).json({
      success: true,
      message: "物品認領請求已提交",
      data: {
        item_id: id,
        claim_id: result.claim.claim_id,
        claim_status: result.claim.status,
      },
    });
  } catch (error) {
    console.error("認領物品失敗:", error);

    if (error.message === "物品不存在") {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    } else if (error.message === "物品狀態不允許認領") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "伺服器錯誤，無法認領物品",
      error: error.message,
    });
  }
};

// 更新物品資訊
exports.updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.id;

    // 檢查是否是物品的擁有者
    const item = await ItemCrud.getItemById(id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: "找不到指定物品",
      });
    }

    if (item.created_by !== userId) {
      return res.status(403).json({
        success: false,
        message: "您沒有權限更新這個物品",
      });
    }

    // 更新物品資訊
    const updatedItem = await ItemCrud.updateItem(id, req.body);

    return res.status(200).json({
      success: true,
      message: "物品資訊更新成功",
      data: updatedItem,
    });
  } catch (error) {
    console.error("更新物品失敗:", error);
    return res.status(500).json({
      success: false,
      message: "伺服器錯誤，無法更新物品",
      error: error.message,
    });
  }
};

exports.getSimilarItems = async (req, res) => {
  try {
    const { id } = req.params;
    const items = await ItemCrud.getSimilarItems(id);

    if (!items || items.length === 0) {
      return res.status(404).json({
        success: false,
        message: "找不到相似物品",
      });
    }

    return res.status(200).json({
      success: true,
      message: "獲取相似物品成功",
      data: items,
    });
  } catch (error) {
    console.error("獲取相似物品失敗:", error);
    return res.status(500).json({
      success: false,
      message: "伺服器錯誤，無法獲取相似物品",
      error: error.message,
    });
  }
};
