const {
  models: {
    foods: Food,
    users: User,
    reservations: Reservation,
    food_claims: FoodClaim,
  },
} = require("../config/sequelize");

const sequelize = require("../config/sequelize");

exports.createFood = async (payload) => {
  try {
    const food = await Food.create(payload);
    return food;
  } catch (error) {
    console.error("創建食物分享失敗:", error);
    throw error;
  }
};

exports.getAllFoods = async (query = {}) => {
  try {
    const { category, status, keyword, limit = 20, page = 1 } = query;

    // 建立查詢條件
    const where = {};

    // 如果提供了類別，加入查詢條件
    if (category) {
      where.category = category;
    }

    // 如果提供了狀態(active/claimed/expired/withdrawn)，加入查詢條件
    if (status) {
      where.status = status;
    }

    // 如果提供了關鍵字，搜尋標題和描述欄位
    if (keyword) {
      where[sequelize.Op.or] = [
        { title: { [sequelize.Op.iLike]: `%${keyword}%` } },
        { description: { [sequelize.Op.iLike]: `%${keyword}%` } },
      ];
    }

    // 計算分頁
    const offset = (page - 1) * limit;

    // 執行查詢
    const { count, rows } = await Food.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: "sharer",
          attributes: ["user_id", "nickname", "avatar_url"],
        },
      ],
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });

    // 返回結果
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
    console.error("獲取食物列表失敗:", error);
    throw error;
  }
};

exports.getFoodById = async (foodId) => {
  try {
    const food = await Food.findByPk(foodId, {
      include: [
        {
          model: User,
          as: "sharer",
          attributes: ["user_id", "nickname", "avatar_url"],
        },
      ],
    });

    if (!food) {
      throw new Error("食物不存在");
    }

    return food;
  } catch (error) {
    console.error("獲取食物失敗:", error);
    throw error;
  }
};

exports.incrementViewCount = async (foodId) => {
  try {
    const food = await Food.findByPk(foodId);
    if (food) {
      await food.increment("view_count");
    }
  } catch (error) {
    console.error("增加瀏覽次數失敗:", error);
    // 不拋出錯誤，僅記錄即可
  }
};

exports.updateFood = async (foodId, updateData) => {
  try {
    const food = await Food.findByPk(foodId);

    if (!food) {
      throw new Error("食物不存在");
    }

    // 只允許更新特定欄位
    const allowedFields = [
      "title",
      "category",
      "description",
      "expire_date",
      "location",
      "latitude",
      "longitude",
      "quantity",
      "status",
    ];

    const filteredData = {};
    allowedFields.forEach((field) => {
      if (updateData[field] !== undefined) {
        filteredData[field] = updateData[field];
      }
    });

    if (Object.keys(filteredData).length === 0) {
      return food; // 如果沒有可更新的欄位，直接返回原始資料
    }

    await food.update(filteredData);
    return food;
  } catch (error) {
    console.error("更新食物失敗:", error);
    throw error;
  }
};

exports.updateFoodStatus = async (foodId, status) => {
  try {
    const food = await Food.findByPk(foodId);

    if (!food) {
      throw new Error("食物不存在");
    }

    await food.update({ status });
    return food;
  } catch (error) {
    console.error("更新食物狀態失敗:", error);
    throw error;
  }
};

exports.reserveFood = async (foodId, userId, quantity) => {
  try {
    // 開始事務
    const transaction = await sequelize.transaction();

    try {
      // 檢查食物是否存在且狀態為 active
      const food = await Food.findByPk(foodId, { transaction });
      if (!food) {
        throw new Error("食物不存在");
      }

      if (food.status !== "active") {
        throw new Error("食物狀態不允許預約");
      }

      // 檢查預約數量是否超過可用數量
      if (quantity > food.quantity) {
        throw new Error("預約數量超過可用數量");
      }

      // 檢查用戶是否已經預約過這個食物
      const existingReservation = await Reservation.findOne({
        where: {
          food_id: foodId,
          user_id: userId,
        },
        transaction,
      });

      if (existingReservation) {
        // 更新現有預約
        await existingReservation.update(
          {
            quantity,
            status: "pending", // 重設狀態為等待中
          },
          { transaction }
        );

        await transaction.commit();
        return { food, reservation: existingReservation };
      }

      // 創建食物預約記錄
      const reservation = await Reservation.create(
        {
          food_id: foodId,
          user_id: userId,
          quantity,
          status: "pending", // 預設為等待中
        },
        { transaction }
      );

      // 提交事務
      await transaction.commit();

      return { food, reservation };
    } catch (error) {
      // 回滾事務
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error("預約食物失敗:", error);
    throw error;
  }
};

exports.getFoodReservations = async (foodId) => {
  try {
    const reservations = await Reservation.findAll({
      where: { food_id: foodId },
      include: [
        {
          model: User,
          as: "reservationUser",
          attributes: ["user_id", "nickname", "avatar_url"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return reservations;
  } catch (error) {
    console.error("獲取食物預約失敗:", error);
    throw error;
  }
};

exports.handleReservation = async (foodId, reservationId, status) => {
  try {
    // 開始事務
    const transaction = await sequelize.transaction();

    try {
      // 檢查預約是否存在且屬於該食物
      const reservation = await Reservation.findOne({
        where: {
          reservation_id: reservationId,
          food_id: foodId,
        },
        transaction,
      });

      if (!reservation) {
        throw new Error("預約不存在或不屬於該食物");
      }

      // 更新預約狀態
      await reservation.update({ status }, { transaction });

      // 如果接受預約，則更新食物數量和狀態
      if (status === "accepted") {
        const food = await Food.findByPk(foodId, { transaction });

        // 減少可用數量
        const newQuantity = food.quantity - reservation.quantity;

        // 更新食物
        await food.update(
          {
            quantity: Math.max(0, newQuantity), // 確保數量不會小於0
            status: newQuantity <= 0 ? "claimed" : "active", // 如果數量為0，設置狀態為已認領
          },
          { transaction }
        );
      }

      // 提交事務
      await transaction.commit();

      return { reservation };
    } catch (error) {
      // 回滾事務
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error("處理食物預約失敗:", error);
    throw error;
  }
};

// 標記自取食物已被拿走
exports.markAsSelfPickedUp = async (foodId, userId) => {
  try {
    const transaction = await sequelize.transaction();

    try {
      // 更新食物狀態為已認領
      const updatedFood = await Food.update(
        {
          status: "claimed",
        },
        {
          where: { food_id: foodId },
          returning: true,
          transaction,
        }
      );

      // 創建食物認領記錄
      const foodClaim = await FoodClaim.create(
        {
          food_id: foodId,
          claimed_by: userId,
          status: "accepted", // 直接設置為已接受，因為是自取方式
        },
        { transaction }
      );

      // 提交事務
      await transaction.commit();

      return {
        food: updatedFood[1][0],
        claim: foodClaim,
      };
    } catch (error) {
      // 回滾事務
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error("標記食物已拿走失敗:", error);
    throw error;
  }
};

exports.getSimilarFoods = async (foodId) => {
  try {
    const food = await Food.findByPk(foodId);

    if (!food) {
      throw new Error("食物不存在");
    }

    const similarFoods = await Food.findAll({
      where: {
        category: food.category,
        // food_id: { [sequelize.Op.ne]: foodId }, // 排除當前食物
      },
      limit: 3,
      order: [["createdAt", "DESC"]],
    });

    return similarFoods;
  } catch (error) {
    console.error("獲取相似食物失敗:", error);
    throw error;
  }
};
