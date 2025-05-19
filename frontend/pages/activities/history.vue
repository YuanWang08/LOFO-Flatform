<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-4xl mx-auto">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-3xl font-bold">活動歷史記錄</h1>
          <p class="text-gray-600 mt-1">查看您參與過的已結束活動</p>
        </div>
        <div class="flex gap-2">
          <NuxtLink to="/activities">
            <button
              class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex items-center"
            >
              <ArrowLeft class="mr-2 h-4 w-4" />
              返回活動列表
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
              <option value="completed">已完成</option>
              <option value="withdrawn">已撤回</option>
              <option value="expired">已過期</option>
              <option value="claimed">已認領</option>
            </select>
          </div>
          <div class="w-full md:w-48">
            <select
              v-model="participationFilter"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              disabled
            >
              <option value="all">全部類型</option>
              <option value="created">我發布的</option>
              <option value="claimed" disabled>我認領的</option>
              <option value="received" disabled>我領取的</option>
            </select>
          </div>
        </div>
        <p class="text-xs text-gray-500 mt-2">注意：目前只能查看您發布的記錄</p>
      </div>

      <!-- 遺失物歷史記錄 -->
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
            沒有找到歷史記錄
          </h3>
          <p class="mt-2 text-gray-500">
            您尚未參與任何已結束的遺失物活動，或沒有符合篩選條件的記錄
          </p>
        </div>
        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            v-for="activity in filteredActivities"
            :key="activity.id"
            class="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div class="relative h-48">
              <img
                :src="activity.image || '/placeholder.svg'"
                :alt="activity.title"
                class="w-full h-full object-cover"
              />
              <div class="absolute top-2 right-2">
                <span
                  :class="[
                    'px-2 py-1 text-xs font-medium rounded-full text-white',
                    activity.status === 'completed'
                      ? 'bg-blue-500'
                      : activity.status === 'withdrawn'
                        ? 'bg-red-500'
                        : activity.status === 'expired'
                          ? 'bg-gray-500'
                          : activity.status === 'claimed'
                            ? 'bg-purple-500'
                            : 'bg-gray-500',
                  ]"
                >
                  {{ getStatusText(activity.status) }}
                </span>
              </div>
              <div class="absolute top-2 left-2">
                <span
                  :class="[
                    'px-2 py-1 text-xs font-medium rounded-full',
                    activity.participationType === 'created'
                      ? 'bg-emerald-100 text-emerald-800'
                      : activity.participationType === 'claimed'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-blue-100 text-blue-800',
                  ]"
                >
                  {{ getParticipationText(activity.participationType) }}
                </span>
              </div>
            </div>
            <div class="p-4">
              <h3 class="text-xl font-semibold mb-2">{{ activity.title }}</h3>
              <p class="text-gray-600 mb-4 line-clamp-2">
                {{ activity.description }}
              </p>
              <div class="space-y-2 text-sm text-gray-500">
                <div class="flex items-center">
                  <MapPin class="mr-2 h-4 w-4 flex-shrink-0" />
                  <span>{{ activity.location }}</span>
                </div>
                <div class="flex items-center">
                  <Calendar class="mr-2 h-4 w-4 flex-shrink-0" />
                  <span>發布日期: {{ formatDate(activity.createdAt) }}</span>
                </div>
                <div class="flex items-center">
                  <Clock class="mr-2 h-4 w-4 flex-shrink-0" />
                  <span>完成日期: {{ formatDate(activity.completedAt) }}</span>
                </div>
                <div
                  v-if="activity.details?.contactName"
                  class="flex items-center"
                >
                  <User class="mr-2 h-4 w-4 flex-shrink-0" />
                  <span
                    >{{
                      activity.participationType === "created"
                        ? "認領者"
                        : "發布者"
                    }}: {{ activity.details.contactName }}</span
                  >
                </div>
              </div>
            </div>
            <div class="p-4 pt-0">
              <NuxtLink :to="`/items/${activity.id}`" class="w-full">
                <button
                  class="w-full px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  查看詳情
                </button>
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>

      <!-- 食物分享歷史記錄 -->
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
            沒有找到歷史記錄
          </h3>
          <p class="mt-2 text-gray-500">
            您尚未參與任何已結束的食物分享活動，或沒有符合篩選條件的記錄
          </p>
        </div>
        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            v-for="activity in filteredActivities"
            :key="activity.id"
            class="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div class="relative h-48">
              <img
                :src="activity.image || '/placeholder.svg'"
                :alt="activity.title"
                class="w-full h-full object-cover"
              />
              <div class="absolute top-2 right-2">
                <span
                  :class="[
                    'px-2 py-1 text-xs font-medium rounded-full text-white',
                    activity.status === 'completed'
                      ? 'bg-blue-500'
                      : activity.status === 'withdrawn'
                        ? 'bg-red-500'
                        : activity.status === 'expired'
                          ? 'bg-gray-500'
                          : 'bg-gray-500',
                  ]"
                >
                  {{ getStatusText(activity.status) }}
                </span>
              </div>
              <div class="absolute top-2 left-2">
                <span
                  :class="[
                    'px-2 py-1 text-xs font-medium rounded-full',
                    activity.participationType === 'created'
                      ? 'bg-emerald-100 text-emerald-800'
                      : activity.participationType === 'received'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-800',
                  ]"
                >
                  {{ getParticipationText(activity.participationType) }}
                </span>
              </div>
            </div>
            <div class="p-4">
              <h3 class="text-xl font-semibold mb-2">{{ activity.title }}</h3>
              <p class="text-gray-600 mb-4 line-clamp-2">
                {{ activity.description }}
              </p>
              <div class="space-y-2 text-sm text-gray-500">
                <div class="flex items-center">
                  <MapPin class="mr-2 h-4 w-4 flex-shrink-0" />
                  <span>{{ activity.location }}</span>
                </div>
                <div class="flex items-center">
                  <Calendar class="mr-2 h-4 w-4 flex-shrink-0" />
                  <span>發布日期: {{ formatDate(activity.createdAt) }}</span>
                </div>
                <div class="flex items-center">
                  <Clock class="mr-2 h-4 w-4 flex-shrink-0" />
                  <span
                    >有效期限: {{ formatDate(activity.expiresAt) }}
                    {{ formatTime(activity.expiresAt) }}</span
                  >
                </div>
                <div
                  v-if="activity.participationType === 'created'"
                  class="flex items-center"
                >
                  <HandCoins class="mr-2 h-4 w-4 flex-shrink-0" />
                  <span
                    >已領取份數: {{ activity.details?.receivedPortions }}/{{
                      activity.details?.portions
                    }}</span
                  >
                </div>
                <div
                  v-if="activity.details?.contactName"
                  class="flex items-center"
                >
                  <User class="mr-2 h-4 w-4 flex-shrink-0" />
                  <span
                    >{{
                      activity.participationType === "created"
                        ? "領取者"
                        : "分享者"
                    }}: {{ activity.details.contactName }}</span
                  >
                </div>
              </div>
            </div>
            <div class="p-4 pt-0">
              <NuxtLink :to="`/foods/${activity.id}`" class="w-full">
                <button
                  class="w-full px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  查看詳情
                </button>
              </NuxtLink>
            </div>
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
  Loader2,
  Search,
  User,
  HandCoins,
  Filter,
} from "lucide-vue-next";

// 活動類型
const activeTab = ref("item");
const activities = ref([]);
const isLoading = ref(true);
const searchInput = ref("");
const statusFilter = ref("all");
const participationFilter = ref("created"); // 固定為 'created'

// 獲取活動數據
const fetchActivities = async (tab) => {
  isLoading.value = true;
  activities.value = [];

  try {
    const config = useRuntimeConfig();
    const authCookie = useCookie("auth_token");

    if (!authCookie.value) {
      navigateTo("/login");
      return;
    }

    // 根據標籤選擇API endpoint
    const endpoint = tab === "item" ? "/user/items" : "/user/foods";

    // 組合API參數
    const params = new URLSearchParams();
    if (statusFilter.value !== "all") {
      params.append("status", statusFilter.value);
    }

    // 發送API請求
    const { data: response } = await useFetch(
      `${config.public.BACKEND_BASE_URL}${endpoint}?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${authCookie.value}`,
        },
      }
    );

    if (response.value && response.value.success && response.value.data) {
      // 轉換API返回的數據為前端所需格式
      const apiData =
        tab === "item" ? response.value.data : response.value.data;
      let fetchedData = apiData.map((item) => {
        // 獲取圖片URL
        const imageUrl = item.image_url || item.imageUrl;
        let fullImageUrl = imageUrl
          ? imageUrl.startsWith("http")
            ? imageUrl
            : `${config.public.BACKEND_BASE_URL}${imageUrl}`
          : "/placeholder.svg";

        // 通用欄位轉換
        const commonFields = {
          id: item.id,
          type: tab,
          title: item.title,
          description: item.description,
          location: item.location,
          createdAt: item.createdAt,
          status: item.status,
          image: fullImageUrl,
          participationType: "created", // 目前只能獲取自己發布的
        };

        // 物品特有欄位
        if (tab === "item") {
          return {
            ...commonFields,
            completedAt: item.completedAt || item.updatedAt,
            details: {
              isWithOwner: item.is_with_owner || item.isWithOwner,
              category: item.category,
              contactName: item.claimer_name || item.claimerName,
            },
          };
        }
        // 食物特有欄位
        else {
          return {
            ...commonFields,
            expiresAt: item.expiresAt || item.expires_at,
            completedAt: item.completedAt || item.updatedAt,
            details: {
              portions: item.portions,
              receivedPortions:
                item.received_portions || item.receivedPortions || 0,
              isVegetarian: item.is_vegetarian || item.isVegetarian,
              contactName: item.receiver_name || item.receiverName,
            },
          };
        }
      });

      activities.value = fetchedData;
      console.log("獲取到的活動數據:", fetchedData);
    } else {
      console.error("獲取活動數據失敗: 無效的響應格式", response.value);
    }
  } catch (error) {
    console.error("獲取活動數據失敗:", error);
  } finally {
    isLoading.value = false;
  }
};

// 監聽標籤變化
watch(activeTab, (newTab) => {
  fetchActivities(newTab);
});

// 監聽狀態過濾變化
watch(statusFilter, () => {
  fetchActivities(activeTab.value);
});

onMounted(async () => {
  await fetchActivities(activeTab.value);
});

// 過濾活動
const filteredActivities = computed(() => {
  let filtered = activities.value;

  // 根據參與類型過濾
  if (participationFilter.value !== "all") {
    filtered = filtered.filter(
      (activity) => activity.participationType === participationFilter.value
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

// 獲取狀態文字
const getStatusText = (status) => {
  switch (status) {
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

// 獲取參與類型文字
const getParticipationText = (type) => {
  switch (type) {
    case "created":
      return "您發布的";
    case "claimed":
      return "您認領的";
    case "received":
      return "您領取的";
    default:
      return "";
  }
};

// 監聽參與類型過濾和搜尋輸入的變化
watch([participationFilter, searchInput], () => {
  // 這裡不需要重新調用API，因為我們在前端進行過濾
});

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("zh-TW");
};

// 格式化時間
const formatTime = (dateString) => {
  if (!dateString) return "";

  // 處理標準 ISO 格式或自定義格式
  if (dateString.includes("T")) {
    // ISO 格式: 2023-04-05T20:00:00.000Z
    const date = new Date(dateString);
    return date.toLocaleTimeString("zh-TW", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } else if (dateString.includes(" ")) {
    // 自定義格式: 2023-04-05 20:00
    const [date, time] = dateString.split(" ");
    return time;
  }

  return dateString;
};
</script>
