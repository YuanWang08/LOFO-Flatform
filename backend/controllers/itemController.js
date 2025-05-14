const ItemCrud = require("../crud/item.crud");
const path = require("path");

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

    // 特別處理 keywords 欄位，確保它是陣列格式
    if (req.body.keywords) {
      // 如果是字串格式的 JSON 陣列
      if (typeof req.body.keywords === "string") {
        try {
          // 嘗試解析 JSON 字串
          if (req.body.keywords.trim().startsWith("[")) {
            payload.keywords = JSON.parse(req.body.keywords);
          } else {
            // 如果不是 JSON 格式，當作單一關鍵字處理
            payload.keywords = [req.body.keywords];
          }
        } catch (e) {
          // JSON 解析失敗，將整個字串視為單一關鍵字
          payload.keywords = [req.body.keywords];
        }
      }
      // keywords 已經是陣列格式
      else if (Array.isArray(req.body.keywords)) {
        payload.keywords = req.body.keywords;
      }
      // 其他情況，轉為陣列
      else {
        payload.keywords = [req.body.keywords].filter(Boolean);
      }
    } else {
      // 如果沒有提供 keywords，設為空陣列
      payload.keywords = [];
    }

    // 確保 keywords 是陣列類型
    if (!Array.isArray(payload.keywords)) {
      payload.keywords = [];
    }

    // 檢查必要的欄位
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
      // 儲存相對路徑，方便前端訪問
      const relativePath = `/uploads/item/${path.basename(req.file.path)}`;
      payload.image_url = relativePath;
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

// 上傳物品圖片
exports.uploadItemImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "沒有上傳任何圖片",
      });
    }

    // 儲存相對路徑，方便前端訪問
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

// 使用者認領物品
exports.claimItem = async (req, res) => {
  try {
    const { id } = req.params; // 獲取物品 ID
    const userId = req.id; // 從認證中獲取用戶 ID

    // 調用 CRUD 層進行物品認領
    const result = await ItemCrud.claimItem(id, userId);

    // 返回成功結果
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

    // 處理特定錯誤
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

    // 處理通用錯誤
    return res.status(500).json({
      success: false,
      message: "伺服器錯誤，無法認領物品",
      error: error.message,
    });
  }
};
