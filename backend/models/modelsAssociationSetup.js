module.exports = (sequelize) => {
  // 從 sequelize.models 獲取所有已定義的模型
  const models = sequelize.models;
  const { users, items, item_claims } = models;

  // 檢查必要的模型是否存在
  if (!users || !items || !item_claims) {
    console.error("缺少基本模型定義，無法設置關聯");
    return;
  }

  // 建立基本的關聯
  // ======= users 和 items 的關聯 =======
  // 一個使用者可以建立多個物品
  users.hasMany(items, {
    foreignKey: "created_by",
    as: "createdItems",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // 每個物品都屬於一個創建者
  items.belongsTo(users, {
    foreignKey: "created_by",
    as: "creator",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // ======= users 和 item_claims 的關聯 =======
  // 一個使用者可以提出多個認領申請
  users.hasMany(item_claims, {
    foreignKey: "claimed_by",
    as: "itemClaims",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // 每個認領申請都屬於一個使用者
  item_claims.belongsTo(users, {
    foreignKey: "claimed_by",
    as: "claimer",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // ======= items 和 item_claims 的關聯 =======
  // 一個物品可以有多個認領申請
  items.hasMany(item_claims, {
    foreignKey: "item_id",
    as: "claims",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // 每個認領申請都對應一個物品
  item_claims.belongsTo(items, {
    foreignKey: "item_id",
    as: "item",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // 安全地處理其他模型關聯
  const {
    foods,
    chatrooms,
    chatroom_participants,
    messages,
    notifications,
    reports,
    reservations,
    user_point_log,
  } = models;

  // ======= users 和 foods 的關聯 (如果 foods 模型存在) =======
  if (foods) {
    // 一個使用者可以分享多個食物
    users.hasMany(foods, {
      foreignKey: "created_by",
      as: "sharedFoods",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    // 每個食物都由一個使用者分享
    foods.belongsTo(users, {
      foreignKey: "created_by",
      as: "sharer",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    // ======= foods 和 reservations 的關聯 (如果 reservations 模型存在) =======
    if (reservations) {
      // 一個食物可以有多個預約
      foods.hasMany(reservations, {
        foreignKey: "food_id",
        as: "foodReservations",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });

      // 每個預約都對應一個食物
      reservations.belongsTo(foods, {
        foreignKey: "food_id",
        as: "reservedFood",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }

  // ======= users 和 reports 的關聯 (如果 reports 模型存在) =======
  if (reports) {
    // 一個使用者可以提交多個檢舉
    users.hasMany(reports, {
      foreignKey: "reported_by",
      as: "submittedReports",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    // 每個檢舉都由一個使用者提交
    reports.belongsTo(users, {
      foreignKey: "reported_by",
      as: "reporter",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    // 使用者可以被檢舉多次
    users.hasMany(reports, {
      foreignKey: "reported_user_id",
      as: "reportsAgainstMe",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    // 每個檢舉都針對一個使用者
    reports.belongsTo(users, {
      foreignKey: "reported_user_id",
      as: "reportedUser",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  }

  // ======= users 和 reservations 的關聯 (如果 reservations 模型存在) =======
  if (reservations) {
    // 一個使用者可以有多個預約
    users.hasMany(reservations, {
      foreignKey: "user_id",
      as: "userReservations",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    // 每個預約都屬於一個使用者
    reservations.belongsTo(users, {
      foreignKey: "user_id",
      as: "reservationUser",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  }

  // ======= users 和 user_point_log 的關聯 (如果 user_point_log 模型存在) =======
  if (user_point_log) {
    // 一個使用者可以有多筆點數紀錄
    users.hasMany(user_point_log, {
      foreignKey: "user_id",
      as: "pointLogs",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    // 每筆點數記錄都屬於一個使用者
    user_point_log.belongsTo(users, {
      foreignKey: "user_id",
      as: "pointUser",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  }

  // ======= users 和 notifications 的關聯 (如果 notifications 模型存在) =======
  if (notifications) {
    // 一個使用者可以有多個通知
    users.hasMany(notifications, {
      foreignKey: "user_id",
      as: "userNotifications",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    // 每個通知都屬於一個使用者
    notifications.belongsTo(users, {
      foreignKey: "user_id",
      as: "notifiedUser",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  }

  // ======= chatrooms 相關關聯 (如果 chatrooms 和相關模型存在) =======
  if (chatrooms) {
    if (chatroom_participants && users) {
      // ======= users 和 chatrooms 的關聯 (通過 chatroom_participants) =======
      // 使用者可以參與多個聊天室
      users.belongsToMany(chatrooms, {
        through: chatroom_participants,
        foreignKey: "user_id",
        otherKey: "chatroom_id",
        as: "participatingChatrooms",
      });

      // 聊天室可以有多個使用者參與
      chatrooms.belongsToMany(users, {
        through: chatroom_participants,
        foreignKey: "chatroom_id",
        otherKey: "user_id",
        as: "participants",
      });
    }

    if (messages) {
      // ======= chatrooms 和 messages 的關聯 =======
      // 一個聊天室可以有多條訊息
      chatrooms.hasMany(messages, {
        foreignKey: "chatroom_id",
        as: "chatroomMessages",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });

      // 每條訊息都屬於一個聊天室
      messages.belongsTo(chatrooms, {
        foreignKey: "chatroom_id",
        as: "chatroom",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });

      if (users) {
        // ======= users 和 messages 的關聯 =======
        // 一個使用者可以發送多條訊息
        users.hasMany(messages, {
          foreignKey: "sender_id",
          as: "sentMessages",
          onDelete: "CASCADE",
          onUpdate: "CASCADE",
        });

        // 每條訊息都由一個使用者發送
        messages.belongsTo(users, {
          foreignKey: "sender_id",
          as: "sender",
          onDelete: "CASCADE",
          onUpdate: "CASCADE",
        });
      }
    }
  }
};
