<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-6">食物分享列表</h1>

    <div class="mb-6">
      <div class="flex flex-col md:flex-row gap-4">
        <div class="flex-1 relative">
          <Search class="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            v-model="keyword"
            placeholder="搜尋食物名稱、描述或地點"
            class="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <button
          @click="showFilters = !showFilters"
          class="px-4 py-2 border border-gray-300 rounded-md flex items-center justify-center hover:bg-gray-50"
        >
          <Filter class="mr-2 h-4 w-4" />
          篩選條件
        </button>
        <NuxtLink to="/submit/food">
          <button
            class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md"
          >
            分享食物
          </button>
        </NuxtLink>
      </div>

      <div
        v-if="showFilters"
        class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4"
      >
        <div>
          <label class="block text-sm font-medium mb-2">食物類別</label>
          <select
            v-model="category"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option
              v-for="option in categoryOptions"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium mb-2">食物狀態</label>
          <select
            v-model="status"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option
              v-for="option in statusOptions"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium mb-2">單次顯示筆數</label>
          <select
            v-model="pageSize"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option
              v-for="option in pageSizeOptions"
              :key="option.value"
              :value="Number(option.value)"
            >
              {{ option.label }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <div v-if="loading" class="text-center py-12">
      <div class="flex items-center justify-center">
        <div
          class="w-12 h-12 border-4 border-gray-300 border-t-emerald-600 rounded-full animate-spin"
        ></div>
      </div>
      <p class="mt-4 text-gray-600">正在載入資料...</p>
    </div>

    <div v-else-if="foods.length === 0" class="text-center py-12">
      <Utensils class="mx-auto h-12 w-12 text-gray-400" />
      <h3 class="mt-4 text-lg font-medium text-gray-900">
        沒有找到符合條件的食物
      </h3>
      <p class="mt-2 text-gray-500">請嘗試調整搜尋條件或篩選條件</p>
    </div>
    <template v-else>
      <div
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8"
      >
        <div
          v-for="food in foods"
          :key="food.food_id"
          class="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col"
        >
          <div
            class="relative h-40 bg-gray-100 flex items-center justify-center"
          >
            <img
              :src="formatImageUrl(food.image_url)"
              :alt="food.title"
              class="w-full h-full object-contain"
            />
            <span
              v-if="food.status"
              class="absolute top-2 right-2 px-2 py-1 text-xs rounded-full"
              :class="getStatusClass(food.status)"
            >
              {{ getStatusText(food.status) }}
            </span>
          </div>
          <div class="flex-1 flex flex-col p-4">
            <h3 class="text-lg font-semibold mb-1 line-clamp-1">
              {{ food.title }}
            </h3>
            <p class="text-sm text-gray-600 mb-3 line-clamp-2">
              {{ food.description }}
            </p>
            <div class="mt-auto space-y-2 text-sm text-gray-500">
              <div class="flex items-center">
                <MapPin class="mr-2 h-4 w-4 flex-shrink-0" />
                <span class="truncate">{{ food.location }}</span>
              </div>
              <div class="flex items-center">
                <Clock class="mr-2 h-4 w-4 flex-shrink-0" />
                <span>{{ formatDate(food.expire_date) }} 前</span>
              </div>
              <div class="flex items-center">
                <Utensils class="mr-2 h-4 w-4 flex-shrink-0" />
                <span>{{ food.quantity }} 份</span>
              </div>
              <div class="flex items-center">
                <Tag class="mr-2 h-4 w-4 flex-shrink-0" />
                <span>{{
                  food.pickup_method === "self" ? "自取" : "預約"
                }}</span>
              </div>
              <NuxtLink
                :to="`/foods/${food.food_id}`"
                class="block w-full mt-2"
              >
                <button
                  class="w-full px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-sm"
                >
                  查看詳情
                </button>
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>

      <!-- 分頁控制 -->
      <div
        v-if="pagination.totalPages > 1"
        class="flex justify-center items-center space-x-2"
      >
        <button
          @click="currentPage = Math.max(currentPage - 1, 1)"
          :disabled="currentPage === 1"
          class="p-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
        >
          <ChevronLeft class="h-4 w-4" />
        </button>
        <span class="text-sm">
          第 {{ currentPage }} 頁，共 {{ pagination.totalPages }} 頁，顯示
          {{ pagination.total }} 筆中的
          {{ (currentPage - 1) * pageSize + 1 }}-{{
            Math.min(currentPage * pageSize, pagination.total)
          }}
          筆
        </span>
        <button
          @click="
            currentPage = Math.min(currentPage + 1, pagination.totalPages)
          "
          :disabled="currentPage === pagination.totalPages"
          class="p-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
        >
          <ChevronRight class="h-4 w-4" />
        </button>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import {
  Search,
  Filter,
  Utensils,
  MapPin,
  Clock,
  ChevronLeft,
  ChevronRight,
  Tag,
} from "lucide-vue-next";

const config = useRuntimeConfig();

// 類別選項
const categoryOptions = [
  { value: "all", label: "所有類別" },
  { value: "即期品", label: "即期品" },
  { value: "水果", label: "水果" },
  { value: "蔬菜", label: "蔬菜" },
  { value: "飲料", label: "飲料" },
  { value: "零食", label: "零食" },
  { value: "烘焙食品", label: "烘焙食品" },
  { value: "剩菜", label: "剩菜" },
];

// 狀態選項
const statusOptions = [
  { value: "all", label: "所有狀態" },
  { value: "active", label: "可預約" },
  { value: "claimed", label: "已預約" },
  { value: "expired", label: "已過期" },
  { value: "withdrawn", label: "已撤回" },
];

// 每頁顯示筆數選項
const pageSizeOptions = [
  { value: "20", label: "20 筆" },
  { value: "50", label: "50 筆" },
  { value: "100", label: "100 筆" },
];

// 資料相關的響應式變數
const category = ref("all");
const status = ref("all");
const keyword = ref("");
const currentPage = ref(1);
const pageSize = ref(20);
const showFilters = ref(false);
const loading = ref(false);
const foods = ref([]);
const pagination = ref({
  total: 0,
  page: 1,
  limit: 20,
  totalPages: 0,
});

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("zh-TW");
};

// 格式化圖片URL
const formatImageUrl = (url) => {
  // if (!url) return "/placeholder.svg?height=200&width=300";

  // 如果已經是完整URL，直接返回
  if (url.startsWith("http")) {
    return url;
  }

  // 否則拼接後端base URL
  return `${config.public.BACKEND_BASE_URL}${url}`;
};

// 獲取狀態文字
const getStatusText = (status) => {
  const statusTextMap = {
    active: "可預約",
    claimed: "已預約",
    expired: "已過期",
    withdrawn: "已撤回",
  };
  return statusTextMap[status] || "未知狀態";
};

// 獲取狀態樣式
const getStatusClass = (status) => {
  const statusClassMap = {
    active: "bg-emerald-100 text-emerald-800",
    claimed: "bg-blue-100 text-blue-800",
    expired: "bg-gray-100 text-gray-800",
    withdrawn: "bg-red-100 text-red-800",
  };
  return statusClassMap[status] || "bg-gray-100 text-gray-800";
};

// 從API獲取資料
const fetchFoods = async () => {
  loading.value = true;
  try {
    const params = new URLSearchParams();
    if (category.value !== "all") params.append("category", category.value);
    if (status.value !== "all") params.append("status", status.value);
    if (keyword.value) params.append("keyword", keyword.value);
    params.append("page", currentPage.value);
    params.append("limit", pageSize.value);

    const response = await fetch(
      `${config.public.BACKEND_BASE_URL}/foods?${params.toString()}`
    );
    const data = await response.json();

    if (data.success) {
      foods.value = data.data;
      pagination.value = data.pagination;
    } else {
      console.error("獲取食物列表失敗:", data.message);
    }
  } catch (error) {
    console.error("API請求失敗:", error);
  } finally {
    loading.value = false;
  }
};

// 當過濾條件變更時，重置頁碼並重新獲取資料
watch([category, status, keyword], () => {
  currentPage.value = 1;
  fetchFoods();
});

// 當頁碼或每頁顯示數量變更時，重新獲取資料
watch([currentPage, pageSize], fetchFoods);

// 組件掛載時獲取資料
onMounted(fetchFoods);
</script>
