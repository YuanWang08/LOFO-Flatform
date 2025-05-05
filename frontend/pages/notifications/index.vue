<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold">通知</h1>
      <div class="flex gap-2">
        <button
          class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
          @click="markAllAsRead"
          :disabled="unreadCount === 0"
        >
          <CheckCircle class="mr-2 h-4 w-4" />
          全部標為已讀
        </button>
        <button
          class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
          @click="clearAllNotifications"
          :disabled="notifications.length === 0"
        >
          <Trash2 class="mr-2 h-4 w-4" />
          清空通知
        </button>
      </div>
    </div>

    <div class="w-full">
      <div class="grid w-full grid-cols-4 mb-6 bg-gray-100 p-1 rounded-lg">
        <button
          class="flex items-center justify-center gap-2 py-2 rounded-md transition-colors"
          :class="
            activeTab === 'all' ? 'bg-white shadow-sm' : 'hover:bg-gray-50'
          "
          @click="activeTab = 'all'"
        >
          <Bell size="18" />
          <span>全部</span>
          <span
            v-if="unreadCount > 0"
            class="ml-1 bg-red-500 text-white text-xs rounded-full px-2 py-0.5"
          >
            {{ unreadCount }}
          </span>
        </button>
        <button
          class="flex items-center justify-center gap-2 py-2 rounded-md transition-colors"
          :class="
            activeTab === 'system' ? 'bg-white shadow-sm' : 'hover:bg-gray-50'
          "
          @click="activeTab = 'system'"
        >
          <Info size="18" />
          <span>系統</span>
          <span
            v-if="unreadSystemCount > 0"
            class="ml-1 bg-red-500 text-white text-xs rounded-full px-2 py-0.5"
          >
            {{ unreadSystemCount }}
          </span>
        </button>
        <button
          class="flex items-center justify-center gap-2 py-2 rounded-md transition-colors"
          :class="
            activeTab === 'item' ? 'bg-white shadow-sm' : 'hover:bg-gray-50'
          "
          @click="activeTab = 'item'"
        >
          <Package size="18" />
          <span>遺失物</span>
          <span
            v-if="unreadItemCount > 0"
            class="ml-1 bg-red-500 text-white text-xs rounded-full px-2 py-0.5"
          >
            {{ unreadItemCount }}
          </span>
        </button>
        <button
          class="flex items-center justify-center gap-2 py-2 rounded-md transition-colors"
          :class="
            activeTab === 'food' ? 'bg-white shadow-sm' : 'hover:bg-gray-50'
          "
          @click="activeTab = 'food'"
        >
          <Utensils size="18" />
          <span>食物</span>
          <span
            v-if="unreadFoodCount > 0"
            class="ml-1 bg-red-500 text-white text-xs rounded-full px-2 py-0.5"
          >
            {{ unreadFoodCount }}
          </span>
        </button>
      </div>

      <div v-if="filteredNotifications.length === 0" class="text-center py-12">
        <Bell class="mx-auto h-12 w-12 text-gray-400" />
        <h3 class="mt-4 text-lg font-medium text-gray-900">沒有通知</h3>
        <p class="mt-2 text-gray-500">目前沒有任何通知</p>
      </div>
      <div v-else class="bg-white rounded-lg shadow-md overflow-hidden">
        <div class="h-[60vh] overflow-auto">
          <div class="divide-y divide-gray-200">
            <div
              v-for="notification in filteredNotifications"
              :key="notification.id"
              :class="`p-4 ${notification.isRead ? 'bg-white' : 'bg-gray-50'}`"
            >
              <div class="flex items-start">
                <div
                  :class="`p-2 rounded-full mr-4 ${
                    notification.type === 'system'
                      ? 'bg-blue-100'
                      : notification.type === 'item'
                        ? 'bg-amber-100'
                        : 'bg-emerald-100'
                  }`"
                >
                  <Info
                    v-if="notification.type === 'system'"
                    :class="`h-5 w-5 ${
                      notification.type === 'system'
                        ? 'text-blue-600'
                        : notification.type === 'item'
                          ? 'text-amber-600'
                          : 'text-emerald-600'
                    }`"
                  />
                  <Package
                    v-else-if="notification.type === 'item'"
                    :class="`h-5 w-5 ${
                      notification.type === 'system'
                        ? 'text-blue-600'
                        : notification.type === 'item'
                          ? 'text-amber-600'
                          : 'text-emerald-600'
                    }`"
                  />
                  <Utensils
                    v-else
                    :class="`h-5 w-5 ${
                      notification.type === 'system'
                        ? 'text-blue-600'
                        : notification.type === 'item'
                          ? 'text-amber-600'
                          : 'text-emerald-600'
                    }`"
                  />
                </div>
                <div class="flex-1">
                  <div class="flex justify-between items-start">
                    <h3 class="text-lg font-semibold">
                      {{ notification.title }}
                    </h3>
                    <div class="flex items-center space-x-2">
                      <span class="text-xs text-gray-500">{{
                        formatDate(notification.date)
                      }}</span>
                      <div
                        v-if="!notification.isRead"
                        class="w-2 h-2 rounded-full bg-red-500"
                      ></div>
                    </div>
                  </div>
                  <p class="text-gray-600 mt-1">{{ notification.message }}</p>
                  <div class="flex justify-between items-center mt-3">
                    <div>
                      <NuxtLink
                        v-if="
                          notification.type === 'item' && notification.itemId
                        "
                        :to="`/items/${notification.itemId}`"
                        class="text-amber-600 hover:text-amber-700 text-sm font-medium"
                      >
                        查看物品
                      </NuxtLink>
                      <NuxtLink
                        v-if="
                          notification.type === 'food' && notification.foodId
                        "
                        :to="`/foods/${notification.foodId}`"
                        class="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                      >
                        查看食物
                      </NuxtLink>
                    </div>
                    <div class="flex space-x-2">
                      <button
                        v-if="!notification.isRead"
                        class="inline-flex items-center px-2 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
                        @click="markAsRead(notification.id)"
                      >
                        <CheckCircle class="h-4 w-4 mr-1" />
                        標為已讀
                      </button>
                      <button
                        class="inline-flex items-center px-2 py-1 text-sm font-medium text-gray-500 hover:text-red-500 hover:bg-gray-100 rounded-md"
                        @click="deleteNotification(notification.id)"
                      >
                        <Trash2 class="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import {
  Bell,
  Package,
  Utensils,
  Info,
  CheckCircle,
  Trash2,
} from "lucide-vue-next";

// 模擬通知數據
const mockNotifications = [
  {
    id: 1,
    type: "system",
    title: "歡迎加入 LOFO 平台",
    message: "感謝您註冊 LOFO 平台，開始探索遺失物與食物分享功能吧！",
    date: "2023-05-01 10:30",
    isRead: true,
  },
  {
    id: 2,
    type: "item",
    title: "有人回應了您的遺失物",
    message: "王小明回應了您遺失的「黑色皮夾」，請查看訊息進行聯繫。",
    date: "2023-05-02 14:25",
    isRead: false,
    itemId: 2,
  },
  {
    id: 3,
    type: "food",
    title: "您的食物被預約了",
    message: "李小華預約了您分享的「披薩 5片」，請查看詳情。",
    date: "2023-05-02 16:40",
    isRead: false,
    foodId: 1,
  },
  {
    id: 4,
    type: "system",
    title: "您的積分已更新",
    message: "恭喜您獲得 10 積分！感謝您協助他人尋回遺失物品。",
    date: "2023-05-03 09:15",
    isRead: false,
  },
  {
    id: 5,
    type: "item",
    title: "遺失物配對成功",
    message: "系統發現一個可能符合您遺失的「AirPods Pro」的物品，請查看詳情。",
    date: "2023-05-03 11:30",
    isRead: true,
    itemId: 2,
  },
  {
    id: 6,
    type: "food",
    title: "食物即將過期提醒",
    message: "您分享的「便當 2個」將在 2 小時後過期，請提醒預約者及時領取。",
    date: "2023-05-03 15:20",
    isRead: true,
    foodId: 2,
  },
  {
    id: 7,
    type: "system",
    title: "系統維護通知",
    message: "系統將於今晚 23:00-24:00 進行例行維護，期間可能無法正常使用。",
    date: "2023-05-04 10:00",
    isRead: false,
  },
  {
    id: 8,
    type: "item",
    title: "您的遺失物有新消息",
    message: "張小美留言詢問您遺失的「學生證」的相關資訊。",
    date: "2023-05-04 13:45",
    isRead: false,
    itemId: 4,
  },
  {
    id: 9,
    type: "food",
    title: "食物分享完成",
    message: "您分享的「麵包 6個」已全部被預約完畢，感謝您的分享！",
    date: "2023-05-04 17:10",
    isRead: true,
    foodId: 3,
  },
  {
    id: 10,
    type: "system",
    title: "新功能上線通知",
    message: "平台新增了地圖標記功能，現在您可以更精確地標記遺失物位置了！",
    date: "2023-05-05 09:30",
    isRead: false,
  },
];

const notifications = ref(mockNotifications);
const activeTab = ref("all");

// 過濾通知
const filteredNotifications = computed(() => {
  if (activeTab.value === "all") return notifications.value;
  return notifications.value.filter(
    (notification) => notification.type === activeTab.value
  );
});

// 未讀通知數量
const unreadCount = computed(
  () =>
    notifications.value.filter((notification) => !notification.isRead).length
);

const unreadSystemCount = computed(
  () =>
    notifications.value.filter(
      (notification) => !notification.isRead && notification.type === "system"
    ).length
);

const unreadItemCount = computed(
  () =>
    notifications.value.filter(
      (notification) => !notification.isRead && notification.type === "item"
    ).length
);

const unreadFoodCount = computed(
  () =>
    notifications.value.filter(
      (notification) => !notification.isRead && notification.type === "food"
    ).length
);

// 標記為已讀
const markAsRead = (id) => {
  notifications.value = notifications.value.map((notification) =>
    notification.id === id ? { ...notification, isRead: true } : notification
  );
};

// 標記所有為已讀
const markAllAsRead = () => {
  notifications.value = notifications.value.map((notification) => ({
    ...notification,
    isRead: true,
  }));
};

// 刪除通知
const deleteNotification = (id) => {
  notifications.value = notifications.value.filter(
    (notification) => notification.id !== id
  );
};

// 清空所有通知
const clearAllNotifications = () => {
  notifications.value = [];
};

// 格式化日期
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInDays = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffInDays === 0) {
    return `今天 ${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")}`;
  } else if (diffInDays === 1) {
    return `昨天 ${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")}`;
  } else if (diffInDays < 7) {
    return `${diffInDays}天前`;
  } else {
    return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")}`;
  }
};
</script>
