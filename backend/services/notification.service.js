const sequelize = require("../config/sequelize");
const { Op } = require("sequelize");
const cron = require("node-cron");
const axios = require("axios");

// 取得所有模型
const db = {
  users: sequelize.model("users"),
  items: sequelize.model("items"),
  foods: sequelize.model("foods"),
};

// 格式化時間函數
const formatDate = (date) => {
  const d = new Date(date);
  if (isNaN(d.getTime())) {
    return "無效日期";
  }
  try {
    return d.toLocaleString("zh-TW", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return d.toISOString().replace("T", " ").substring(0, 16);
  }
};

// 取得需要發送通知的用戶
const getNotificationUsers = async () => {
  try {
    return await db.users.findAll({
      where: {
        enabled_discord_notifacation: true,
        discord_webhook: {
          [Op.not]: null,
          [Op.ne]: "",
        },
      },
      attributes: ["user_id", "nickname", "discord_webhook"],
    });
  } catch (error) {
    console.error("Error getting notification users:", error);
    return [];
  }
};

// 取得最近12小時的物品
const getRecentItems = async () => {
  try {
    const items = await db.items.findAll({
      where: {
        status: "active",
      },
      include: [
        {
          model: db.users,
          as: "creator", // 修改為正確的關聯別名
          attributes: ["nickname"],
        },
      ],
    });

    // 計算12小時前的時間點
    const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000);

    // 過濾出12小時內的物品
    const recentItems = items.filter((item) => {
      const itemLocalTime = new Date(item.createdAt);
      return itemLocalTime >= twelveHoursAgo;
    });

    return recentItems;
  } catch (error) {
    console.error("Error getting recent items:", error);
    return [];
  }
};

// 取得最近12小時的食物
const getRecentFoods = async () => {
  try {
    const foods = await db.foods.findAll({
      where: {
        status: "active",
      },
      include: [
        {
          model: db.users,
          as: "sharer", // 修改為正確的關聯別名
          attributes: ["nickname"],
        },
      ],
    });

    // 計算12小時前的時間點
    const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000);

    // 過濾出12小時內的食物
    const recentFoods = foods.filter((food) => {
      const foodLocalTime = new Date(food.createdAt);
      return foodLocalTime >= twelveHoursAgo;
    });

    return recentFoods;
  } catch (error) {
    console.error("Error getting recent foods:", error);
    return [];
  }
};

// 發送 Discord 通知
const sendDiscordNotification = async (webhook, content) => {
  try {
    await axios.post(webhook, {
      content: content,
      avatar_url: "https://i.meee.com.tw/tfkgpgK.png",
      username: "LOFO-遺失物與食物分享通知", // 可選：自訂發送者名稱
    });
    return true;
  } catch (error) {
    console.error("Error sending Discord notification:", error);
    return false;
  }
};

// 建立通知內容
const createNotificationContent = (items, foods) => {
  let content = "**最近12小時內的新物品和食物分享** 📢\n\n";

  if (items.length > 0) {
    content += "🔍 **新遺失物**\n";
    items.forEach((item) => {
      content += `> • ${item.title} (由 ${
        item.creator.nickname
      } 在 ${formatDate(item.createdAt)} 發布)\n`;
    });
    content += "\n";
  }

  if (foods.length > 0) {
    content += "🍱 **新食物分享**\n";
    foods.forEach((food) => {
      content += `> • ${food.title} (由 ${food.sharer.nickname} 在 ${formatDate(
        food.createdAt
      )} 發布)\n`;
    });
  }

  if (items.length === 0 && foods.length === 0) {
    content += "_這段時間內沒有新的物品或食物分享_";
  }

  return content;
};

// 設定每天早上7點和下午1點執行的定時任務
const initializeNotificationScheduler = () => {
  try {
    // 每天早上7點
    cron.schedule(
      "0 7 * * *",
      async () => {
        console.log("Running morning notification schedule...");
        await sendScheduledNotifications();
      },
      {
        timezone: "Asia/Taipei",
      }
    );

    // 每天下午1點
    cron.schedule(
      "0 13 * * *",
      async () => {
        console.log("Running afternoon notification schedule...");
        await sendScheduledNotifications();
      },
      {
        timezone: "Asia/Taipei",
      }
    );

    console.log("Notification scheduler initialized successfully");
  } catch (error) {
    console.error("Error initializing notification scheduler:", error);
  }
};

// 執行發送通知的主要函數
const sendScheduledNotifications = async () => {
  try {
    // 獲取需要發送通知的用戶
    const users = await getNotificationUsers();
    if (users.length === 0) return;

    // 獲取最近的物品和食物
    const [items, foods] = await Promise.all([
      getRecentItems(),
      getRecentFoods(),
    ]);

    // 建立通知內容
    const notificationContent = createNotificationContent(items, foods);

    // 向每個用戶發送通知
    for (const user of users) {
      await sendDiscordNotification(user.discord_webhook, notificationContent);
    }

    console.log(`Successfully sent notifications to ${users.length} users`);
  } catch (error) {
    console.error("Error in scheduled notification:", error);
  }
};

// 測試發送通知的函數
const testNotification = async () => {
  console.log("開始測試通知功能...");
  await sendScheduledNotifications();
  console.log("通知測試完成");
};

module.exports = {
  initializeNotificationScheduler,
  testNotification,
};
