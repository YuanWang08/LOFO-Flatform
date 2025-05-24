const FoodCrud = require("../crud/food.crud");
const path = require("path");

// 上傳食物圖片
exports.uploadFoodImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "沒有上傳任何圖片",
      });
    }

    // 儲存相對路徑，方便前端訪問
    const relativePath = `/uploads/food/${path.basename(req.file.path)}`;

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

// 創建新的食物分享
exports.createFood = async (req, res) => {
  try {
    const userId = req.id;

    const payload = {
      ...req.body,
      created_by: userId,
    };

    const requiredFields = [
      "title",
      "category",
      "location",
      "expire_date",
      "latitude",
      "longitude",
      "quantity",
      "status",
      "pickup_method",
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
      const relativePath = `/uploads/food/${path.basename(req.file.path)}`;
      payload.image_url = relativePath;
    }

    // 創建食物
    const food = await FoodCrud.createFood(payload);

    return res.status(201).json({
      success: true,
      message: "食物分享創建成功",
      data: food,
    });
  } catch (error) {
    console.error("創建食物分享失敗:", error);
    return res.status(500).json({
      success: false,
      message: "伺服器錯誤，無法創建食物分享",
      error: error.message,
    });
  }
};

// 獲取所有食物，支持分頁和篩選
exports.getAllFoods = async (req, res) => {
  try {
    const { category, status, keyword, page, limit } = req.query;

    const result = await FoodCrud.getAllFoods({
      category,
      status,
      keyword,
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 20,
    });

    return res.status(200).json({
      success: true,
      message: "獲取食物列表成功",
      data: result.foods,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error("獲取食物列表失敗:", error);
    return res.status(500).json({
      success: false,
      message: "伺服器錯誤，無法獲取食物列表",
      error: error.message,
    });
  }
};

// 根據ID獲取單一食物
exports.getFoodById = async (req, res) => {
  try {
    const { id } = req.params;
    const food = await FoodCrud.getFoodById(id);

    if (!food) {
      return res.status(404).json({
        success: false,
        message: "找不到指定食物",
      });
    }

    // 增加瀏覽次數
    await FoodCrud.incrementViewCount(id);

    return res.status(200).json({
      success: true,
      message: "獲取食物成功",
      data: food,
    });
  } catch (error) {
    console.error("獲取食物失敗:", error);
    return res.status(500).json({
      success: false,
      message: "伺服器錯誤，無法獲取食物",
      error: error.message,
    });
  }
};

// 獲取食物的公開資訊（包含已預約數量，無需登入）
exports.getFoodPublicInfo = async (req, res) => {
  try {
    const { id } = req.params;
    const food = await FoodCrud.getFoodById(id);

    if (!food) {
      return res.status(404).json({
        success: false,
        message: "找不到指定食物",
      });
    }

    // 計算已預約的份數（只考慮已接受或待處理的預約）
    const reservations = await FoodCrud.getFoodReservations(id);
    const reservedQuantity = reservations.reduce((total, reservation) => {
      if (
        reservation.status === "accepted" ||
        reservation.status === "pending"
      ) {
        return total + reservation.quantity;
      }
      return total;
    }, 0);

    return res.status(200).json({
      success: true,
      message: "獲取食物公開資訊成功",
      data: {
        reservedQuantity,
      },
    });
  } catch (error) {
    console.error("獲取食物公開資訊失敗:", error);
    return res.status(500).json({
      success: false,
      message: "伺服器錯誤，無法獲取食物公開資訊",
      error: error.message,
    });
  }
};

// 更新食物資訊
exports.updateFood = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.id;

    const food = await FoodCrud.getFoodById(id);
    if (!food) {
      return res.status(404).json({
        success: false,
        message: "找不到指定食物",
      });
    }

    if (food.created_by !== userId) {
      return res.status(403).json({
        success: false,
        message: "您沒有權限更新這個食物",
      });
    }

    // 更新食物資訊
    const updatedFood = await FoodCrud.updateFood(id, req.body);

    return res.status(200).json({
      success: true,
      message: "食物資訊更新成功",
      data: updatedFood,
    });
  } catch (error) {
    console.error("更新食物失敗:", error);
    return res.status(500).json({
      success: false,
      message: "伺服器錯誤，無法更新食物",
      error: error.message,
    });
  }
};

// 撤回食物分享
exports.withdrawFood = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.id;

    const food = await FoodCrud.getFoodById(id);
    if (!food) {
      return res.status(404).json({
        success: false,
        message: "找不到指定食物",
      });
    }

    if (food.created_by !== userId) {
      return res.status(403).json({
        success: false,
        message: "您沒有權限撤回這個食物分享",
      });
    }

    // 撤回食物分享
    await FoodCrud.updateFoodStatus(id, "withdrawn");

    return res.status(200).json({
      success: true,
      message: "食物分享已撤回",
    });
  } catch (error) {
    console.error("撤回食物分享失敗:", error);
    return res.status(500).json({
      success: false,
      message: "伺服器錯誤，無法撤回食物分享",
      error: error.message,
    });
  }
};

// 預約食物
exports.reserveFood = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.id;
    const { quantity } = req.body;

    // 預約食物
    const result = await FoodCrud.reserveFood(id, userId, quantity);

    return res.status(201).json({
      success: true,
      message: "食物預約成功",
      data: {
        food_id: id,
        reservation_id: result.reservation.reservation_id,
        status: result.reservation.status,
      },
    });
  } catch (error) {
    console.error("預約食物失敗:", error);

    // 處理特定錯誤
    if (error.message === "食物不存在") {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    } else if (
      error.message === "食物狀態不允許預約" ||
      error.message === "預約數量超過可用數量"
    ) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    // 處理通用錯誤
    return res.status(500).json({
      success: false,
      message: "伺服器錯誤，無法預約食物",
      error: error.message,
    });
  }
};

// 獲取食物的所有預約
exports.getFoodReservations = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.id;

    // 檢查是否是食物的擁有者
    const food = await FoodCrud.getFoodById(id);
    if (!food) {
      return res.status(404).json({
        success: false,
        message: "找不到指定食物",
      });
    }

    if (food.created_by !== userId) {
      return res.status(403).json({
        success: false,
        message: "您沒有權限查看這個食物的預約",
      });
    }

    // 獲取食物的所有預約
    const reservations = await FoodCrud.getFoodReservations(id);

    return res.status(200).json({
      success: true,
      message: "獲取食物預約成功",
      data: reservations,
    });
  } catch (error) {
    console.error("獲取食物預約失敗:", error);
    return res.status(500).json({
      success: false,
      message: "伺服器錯誤，無法獲取食物預約",
      error: error.message,
    });
  }
};

// 處理食物預約 (接受或拒絕)
exports.handleReservation = async (req, res) => {
  try {
    const { id, reservationId } = req.params;
    const userId = req.id;
    const { status } = req.body;

    if (status !== "accepted" && status !== "rejected") {
      return res.status(400).json({
        success: false,
        message: "狀態值無效，只能是 'accepted' 或 'rejected'",
      });
    }

    // 檢查是否是食物的擁有者
    const food = await FoodCrud.getFoodById(id);
    if (!food) {
      return res.status(404).json({
        success: false,
        message: "找不到指定食物",
      });
    }

    if (food.created_by !== userId) {
      return res.status(403).json({
        success: false,
        message: "您沒有權限處理這個食物的預約",
      });
    }

    // 處理預約
    const result = await FoodCrud.handleReservation(id, reservationId, status);

    return res.status(200).json({
      success: true,
      message: status === "accepted" ? "預約已接受" : "預約已拒絕",
      data: result,
    });
  } catch (error) {
    console.error("處理食物預約失敗:", error);
    return res.status(500).json({
      success: false,
      message: "伺服器錯誤，無法處理食物預約",
      error: error.message,
    });
  }
};

// 標記自取食物已被拿走
exports.markAsSelfPickedUp = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.id;

    // 檢查食物是否存在
    const food = await FoodCrud.getFoodById(id);
    if (!food) {
      return res.status(404).json({
        success: false,
        message: "找不到指定食物",
      });
    }

    // 確認是否為自取方式
    if (food.pickup_method !== "self") {
      return res.status(400).json({
        success: false,
        message: "此食物非自取方式，無法使用此功能",
      });
    }

    // 確認食物狀態為可用
    if (food.status !== "active") {
      return res.status(400).json({
        success: false,
        message: "此食物已不可用，無法標記為已拿走",
      });
    }

    // 更新食物狀態為已認領
    const updatedFood = await FoodCrud.markAsSelfPickedUp(id, userId);

    return res.status(200).json({
      success: true,
      message: "已成功標記食物為已拿走",
      data: updatedFood,
    });
  } catch (error) {
    console.error("標記食物已拿走失敗:", error);
    return res.status(500).json({
      success: false,
      message: "伺服器錯誤，無法標記食物為已拿走",
      error: error.message,
    });
  }
};

// 獲取相似食物
exports.getSimilarFoods = async (req, res) => {
  try {
    const { id } = req.params;

    // 獲取相似食物
    const similarFoods = await FoodCrud.getSimilarFoods(id);

    return res.status(200).json({
      success: true,
      message: "獲取相似食物成功",
      data: similarFoods,
    });
  } catch (error) {
    console.error("獲取相似食物失敗:", error);
    return res.status(500).json({
      success: false,
      message: "伺服器錯誤，無法獲取相似食物",
      error: error.message,
    });
  }
};
