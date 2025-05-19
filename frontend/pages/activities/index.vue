<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-4xl mx-auto">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-3xl font-bold">我的活動</h1>
          <p class="text-gray-600 mt-1">管理您發布的遺失物與食物分享</p>
        </div>
        <div class="flex gap-2">
          <NuxtLink to="/profile">
            <button
              class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex items-center"
            >
              <ArrowLeft class="mr-2 h-4 w-4" />
              返回個人資料
            </button>
          </NuxtLink>
          <NuxtLink to="/activities/history">
            <button
              class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex items-center"
            >
              <History class="mr-2 h-4 w-4" />
              查看歷史記錄
            </button>
          </NuxtLink>
        </div>
      </div>

      <div class="mb-6">
        <div class="grid grid-cols-2 gap-2 bg-gray-100 p-1 rounded-lg">
          <button
            @click="activeTab = 'item'"
            :class="[
              'py-2 px-4 rounded-md flex items-center justify-center gap-2',
              activeTab === 'item' ? 'bg-white shadow-sm' : 'hover:bg-gray-200',
            ]"
          >
            <Package :size="18" />
            <span>遺失物</span>
          </button>
          <button
            @click="activeTab = 'food'"
            :class="[
              'py-2 px-4 rounded-md flex items-center justify-center gap-2',
              activeTab === 'food' ? 'bg-white shadow-sm' : 'hover:bg-gray-200',
            ]"
          >
            <Utensils :size="18" />
            <span>食物分享</span>
          </button>
        </div>
      </div>

      <div class="mb-6">
        <div class="flex flex-col md:flex-row gap-4">
          <div class="flex-1 relative">
            <Search class="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              v-model="searchInput"
              placeholder="搜尋標題、描述或地點"
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div class="w-full md:w-48">
            <select
              v-model="statusFilter"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">全部狀態</option>
              <option value="active">進行中</option>
              <option value="completed">已完成</option>
              <option value="withdrawn">已撤回</option>
              <option value="expired">已過期</option>
              <option value="claimed">已認領</option>
            </select>
          </div>
        </div>
      </div>

      <!-- 遺失物內容 -->
      <div v-if="activeTab === 'item'">
        <div v-if="isLoading" class="flex justify-center items-center py-12">
          <Loader2 class="h-8 w-8 animate-spin text-emerald-500" />
          <span class="ml-2 text-lg">載入中...</span>
        </div>
        <div
          v-else-if="filteredActivities.length === 0"
          class="text-center py-12 bg-white rounded-lg shadow-md"
        >
          <Package class="mx-auto h-12 w-12 text-gray-400" />
          <h3 class="mt-4 text-lg font-medium text-gray-900">
            沒有找到遺失物活動
          </h3>
          <p class="mt-2 text-gray-500">
            您尚未發布任何遺失物，或沒有符合篩選條件的活動
          </p>
          <NuxtLink to="/submit/item">
            <button
              class="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
            >
              發布遺失物
            </button>
          </NuxtLink>
        </div>
        <div
          v-else
          class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          <div
            v-for="activity in filteredActivities"
            :key="activity.id"
            class="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col"
          >
            <div
              class="relative h-40 bg-gray-100 flex items-center justify-center"
            >
              <img
                :src="formatImageUrl(activity.image)"
                :alt="activity.title"
                class="w-full h-full object-contain"
              />
              <span
                v-if="activity.status"
                class="absolute top-2 right-2 px-2 py-1 text-xs rounded-full"
                :class="getStatusClass(activity.status)"
              >
                {{ getStatusText(activity.status) }}
              </span>
            </div>
            <div class="p-4 flex-1 flex flex-col">
              <h3 class="text-lg font-semibold mb-1 line-clamp-1">
                {{ activity.title }}
              </h3>
              <p class="text-gray-600 mb-3 line-clamp-2">
                {{ activity.description }}
              </p>
              <div class="mt-auto space-y-2 text-sm text-gray-500">
                <div class="flex items-center">
                  <MapPin class="mr-2 h-4 w-4 flex-shrink-0" />
                  <span class="truncate">{{ activity.location }}</span>
                </div>
                <div class="flex items-center">
                  <Calendar class="mr-2 h-4 w-4 flex-shrink-0" />
                  <span>發布日期: {{ formatDate(activity.createdAt) }}</span>
                </div>
                <div class="flex items-center">
                  <Package class="mr-2 h-4 w-4 flex-shrink-0" />
                  <span
                    >狀態:
                    {{
                      activity.details?.isWithOwner
                        ? "物品在您手中"
                        : "物品在原處"
                    }}</span
                  >
                </div>
              </div>
            </div>
            <div class="p-4 pt-0 flex justify-between mt-auto">
              <template v-if="activity.status === 'active'">
                <NuxtLink :to="`/edit/item/${activity.id}`">
                  <button
                    class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex items-center"
                  >
                    <Edit class="mr-2 h-4 w-4" />
                    編輯
                  </button>
                </NuxtLink>
                <button
                  class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex items-center text-red-500 hover:text-red-600"
                  @click="openWithdrawDialog(activity.id, activity.type)"
                >
                  <XCircle class="mr-2 h-4 w-4" />
                  撤回
                </button>
              </template>
              <template v-else>
                <NuxtLink :to="`/items/${activity.id}`" class="w-full">
                  <button
                    class="w-full px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-sm"
                  >
                    查看詳情
                  </button>
                </NuxtLink>
              </template>
            </div>
          </div>
        </div>
      </div>

      <!-- 食物分享內容 -->
      <div v-if="activeTab === 'food'">
        <div v-if="isLoading" class="flex justify-center items-center py-12">
          <Loader2 class="h-8 w-8 animate-spin text-emerald-500" />
          <span class="ml-2 text-lg">載入中...</span>
        </div>
        <div
          v-else-if="filteredActivities.length === 0"
          class="text-center py-12 bg-white rounded-lg shadow-md"
        >
          <Utensils class="mx-auto h-12 w-12 text-gray-400" />
          <h3 class="mt-4 text-lg font-medium text-gray-900">
            沒有找到食物分享活動
          </h3>
          <p class="mt-2 text-gray-500">
            您尚未發布任何食物分享，或沒有符合篩選條件的活動
          </p>
          <NuxtLink to="/submit/food">
            <button
              class="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
            >
              分享食物
            </button>
          </NuxtLink>
        </div>
        <div
          v-else
          class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          <div
            v-for="activity in filteredActivities"
            :key="activity.id"
            class="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col"
          >
            <div
              class="relative h-40 bg-gray-100 flex items-center justify-center"
            >
              <img
                :src="formatImageUrl(activity.image)"
                :alt="activity.title"
                class="w-full h-full object-contain"
              />
              <span
                v-if="activity.status"
                class="absolute top-2 right-2 px-2 py-1 text-xs rounded-full"
                :class="getStatusClass(activity.status)"
              >
                {{ getStatusText(activity.status) }}
              </span>
            </div>
            <div class="p-4 flex-1 flex flex-col">
              <h3 class="text-lg font-semibold mb-1 line-clamp-1">
                {{ activity.title }}
              </h3>
              <p class="text-gray-600 mb-3 line-clamp-2">
                {{ activity.description }}
              </p>
              <div class="mt-auto space-y-2 text-sm text-gray-500">
                <div class="flex items-center">
                  <MapPin class="mr-2 h-4 w-4 flex-shrink-0" />
                  <span class="truncate">{{ activity.location }}</span>
                </div>
                <div class="flex items-center">
                  <Calendar class="mr-2 h-4 w-4 flex-shrink-0" />
                  <span>發布日期: {{ formatDate(activity.createdAt) }}</span>
                </div>
                <div class="flex items-center">
                  <Clock class="mr-2 h-4 w-4 flex-shrink-0" />
                  <span
                    >有效期限: {{ formatDateTime(activity.expiresAt) }}</span
                  >
                </div>
                <div class="flex items-center">
                  <Utensils class="mr-2 h-4 w-4 flex-shrink-0" />
                  <span
                    >剩餘份數: {{ activity.details?.remainingPortions }}/{{
                      activity.details?.portions
                    }}</span
                  >
                </div>
              </div>
            </div>
            <div class="p-4 pt-0 flex justify-between mt-auto">
              <template v-if="activity.status === 'active'">
                <NuxtLink :to="`/edit/food/${activity.id}`">
                  <button
                    class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex items-center"
                  >
                    <Edit class="mr-2 h-4 w-4" />
                    編輯
                  </button>
                </NuxtLink>
                <button
                  class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex items-center text-red-500 hover:text-red-600"
                  @click="openWithdrawDialog(activity.id, activity.type)"
                >
                  <XCircle class="mr-2 h-4 w-4" />
                  撤回
                </button>
              </template>
              <template v-else>
                <NuxtLink :to="`/foods/${activity.id}`" class="w-full">
                  <button
                    class="w-full px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-sm"
                  >
                    查看詳情
                  </button>
                </NuxtLink>
              </template>
            </div>
          </div>
        </div>
      </div>

      <!-- 撤回確認對話框 -->
      <div
        v-if="withdrawDialog.open"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <h3 class="text-lg font-semibold mb-2">確認撤回</h3>
          <p class="text-gray-600 mb-4">
            {{
              withdrawDialog.activityType === "item"
                ? "確定要撤回此遺失物嗎？撤回後將不再顯示在遺失物列表中。"
                : "確定要撤回此食物分享嗎？撤回後將不再顯示在食物分享列表中。"
            }}
          </p>
          <div class="bg-amber-50 p-3 rounded-md flex items-start mb-4">
            <AlertCircle
              class="text-amber-500 mr-2 h-5 w-5 flex-shrink-0 mt-0.5"
            />
            <p class="text-amber-800 text-sm">
              撤回後無法恢復，如需重新發布，請創建新的{{
                withdrawDialog.activityType === "item" ? "遺失物" : "食物分享"
              }}公告。
            </p>
          </div>
          <div class="flex justify-end gap-2">
            <button
              class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              @click="withdrawDialog.open = false"
              :disabled="isWithdrawing"
            >
              取消
            </button>
            <button
              class="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
              @click="handleWithdraw"
              :disabled="isWithdrawing"
            >
              <template v-if="isWithdrawing">
                <Loader2 class="mr-2 h-4 w-4 animate-spin inline-block" />
                處理中...
              </template>
              <template v-else> 確認撤回 </template>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import {
  ArrowLeft,
  Package,
  Utensils,
  Calendar,
  MapPin,
  Clock,
  Edit,
  XCircle,
  AlertCircle,
  Loader2,
  History,
  Search,
} from "lucide-vue-next";

// 活動類型
const activeTab = ref("item");
const activities = ref([]);
const isLoading = ref(true);
const searchInput = ref("");
const statusFilter = ref("all");
const isWithdrawing = ref(false);
const config = useRuntimeConfig();
const withdrawDialog = ref({
  open: false,
  activityId: null,
  activityType: null,
});

// 模擬獲取活動數據
onMounted(async () => {
  isLoading.value = true;
  try {
    await fetchActivities();
  } catch (error) {
    console.error("獲取活動數據失敗:", error);
  } finally {
    isLoading.value = false;
  }
});

// 獲取活動數據
const fetchActivities = async () => {
  isLoading.value = true;
  try {
    const authCookie = useCookie("auth_token");

    if (!authCookie.value) {
      console.error("未登入，無法獲取活動數據");
      return;
    }

    // 根據當前活躍標籤獲取對應類型的活動
    const endpoint = activeTab.value === "item" ? "items" : "foods";

    const response = await fetch(
      `${config.public.BACKEND_BASE_URL}/user/${endpoint}?status=${statusFilter.value !== "all" ? statusFilter.value : ""}`,
      {
        headers: {
          Authorization: `Bearer ${authCookie.value}`,
        },
      }
    );

    const data = await response.json();

    console.log("獲取活動數據:", data);

    if (data.success) {
      // 將API返回的數據轉換為前端所需的格式
      const formattedActivities = data.data.map((item) => {
        const baseActivity = {
          id: activeTab.value === "item" ? item.item_id : item.food_id,
          type: activeTab.value,
          title: item.title,
          description: item.description || "",
          location: item.location,
          createdAt: item.createdAt,
          status: item.status,
          image: item.image_url,
          isOwner: true,
        };

        // 根據活動類型添加特定字段
        if (activeTab.value === "item") {
          baseActivity.details = {
            isWithOwner: item.is_with_owner,
            category: item.category,
          };
        } else {
          // 食物特定字段
          baseActivity.expiresAt = item.expire_date;
          baseActivity.details = {
            portions: item.quantity,
            remainingPortions: item.quantity, // 假設所有份數都還在，實際應通過API獲取
            isVegetarian: false, // 假設非素食，API中可能沒有此字段
          };
        }

        return baseActivity;
      });

      activities.value = formattedActivities;
    } else {
      console.error(
        `獲取${activeTab.value === "item" ? "物品" : "食物"}列表失敗:`,
        data.message
      );
    }
  } catch (error) {
    console.error("API請求失敗:", error);
  } finally {
    isLoading.value = false;
  }
};

// 過濾活動
const filteredActivities = computed(() => {
  let filtered = activities.value.filter(
    (activity) => activity.type === activeTab.value
  );

  // 根據狀態過濾
  if (statusFilter.value !== "all") {
    filtered = filtered.filter(
      (activity) => activity.status === statusFilter.value
    );
  }

  // 根據搜索關鍵詞過濾
  if (searchInput.value.trim()) {
    const searchTerm = searchInput.value.toLowerCase();
    filtered = filtered.filter(
      (activity) =>
        activity.title.toLowerCase().includes(searchTerm) ||
        activity.description.toLowerCase().includes(searchTerm) ||
        activity.location.toLowerCase().includes(searchTerm)
    );
  }

  return filtered;
});

// 打開撤回對話框
const openWithdrawDialog = (id, type) => {
  withdrawDialog.value = {
    open: true,
    activityId: id,
    activityType: type,
  };
};

// 處理撤回活動
const handleWithdraw = async () => {
  if (!withdrawDialog.value.activityId || !withdrawDialog.value.activityType)
    return;

  isWithdrawing.value = true;

  try {
    const authCookie = useCookie("auth_token");

    if (!authCookie.value) {
      console.error("未登入，無法撤回活動");
      return;
    } // 使用正確的API端點撤回活動 (更新狀態為 withdrawn 而非真正刪除)
    const endpoint =
      withdrawDialog.value.activityType === "item" ? "items" : "foods";

    const response = await fetch(
      `${config.public.BACKEND_BASE_URL}/${endpoint}/${withdrawDialog.value.activityId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authCookie.value}`,
        },
        body: JSON.stringify({
          status: "withdrawn",
        }),
      }
    );

    const data = await response.json();

    if (data.success) {
      // 更新活動狀態
      activities.value = activities.value.map((activity) =>
        activity.id === withdrawDialog.value.activityId
          ? { ...activity, status: "withdrawn" }
          : activity
      );

      // 關閉對話框
      withdrawDialog.value = {
        open: false,
        activityId: null,
        activityType: null,
      };
    } else {
      console.error("撤回活動失敗:", data.message);
      alert(`撤回失敗: ${data.message}`);
    }
  } catch (error) {
    console.error("撤回活動失敗:", error);
  } finally {
    isWithdrawing.value = false;
  }
};

// 獲取狀態文字
const getStatusText = (status) => {
  switch (status) {
    case "active":
      return "進行中";
    case "completed":
      return "已完成";
    case "withdrawn":
      return "已撤回";
    case "expired":
      return "已過期";
    case "claimed":
      return "已認領";
    default:
      return "未知狀態";
  }
};

// 獲取狀態類別樣式
const getStatusClass = (status) => {
  switch (status) {
    case "active":
      return "bg-emerald-100 text-emerald-800";
    case "completed":
      return "bg-blue-100 text-blue-800";
    case "withdrawn":
      return "bg-red-100 text-red-800";
    case "expired":
      return "bg-gray-100 text-gray-800";
    case "claimed":
      return "bg-purple-100 text-purple-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("zh-TW");
};

// 格式化時間
const formatTime = (dateString) => {
  if (!dateString) return "";
  if (!dateString.includes(" ")) return dateString;

  const [date, time] = dateString.split(" ");
  // 只取時和分，忽略秒
  const [hours, minutes] = time.split(":");
  return `${hours}:${minutes}`;
};

// 格式化圖片URL
const formatImageUrl = (url) => {
  if (!url) return "/placeholder.svg";

  // 如果已經是完整URL，直接返回
  if (url.startsWith("http")) {
    return url;
  }

  // 否則拼接後端base URL
  return `${config.public.BACKEND_BASE_URL}${url}`;
};

// 格式化日期時間，返回格式如：2025/5/14 下午11:49
const formatDateTime = (dateString) => {
  if (!dateString) return "";

  const date = new Date(dateString);

  // 格式化日期部分：yyyy/M/d
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const dateFormatted = `${year}/${month}/${day}`;

  // 格式化時間部分：上午/下午 h:mm
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");

  // 判斷上午或下午
  const period = hours < 12 ? "上午" : "下午";

  // 轉換為12小時制
  const hours12 = hours % 12 || 12;

  // 組合日期和時間
  return `${dateFormatted} ${period}${hours12}:${minutes}`;
};

// 監聽標籤或狀態變化，重新獲取資料
watch([activeTab, statusFilter], async () => {
  await fetchActivities();
});
</script>
