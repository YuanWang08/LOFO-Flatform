<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-6">遺失物列表</h1>

    <div class="mb-6">
      <div class="flex flex-col md:flex-row gap-4">
        <div class="flex-1 relative">
          <Search class="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            v-model="keyword"
            placeholder="搜尋物品名稱、描述或地點"
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
        <NuxtLink to="/submit/item">
          <button
            class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md"
          >
            登記遺失物
          </button>
        </NuxtLink>
      </div>

      <div
        v-if="showFilters"
        class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4"
      >
        <div>
          <label class="block text-sm font-medium mb-2">物品類別</label>
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
          <label class="block text-sm font-medium mb-2">物品狀態</label>
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

    <div v-else-if="items.length === 0" class="text-center py-12">
      <Package class="mx-auto h-12 w-12 text-gray-400" />
      <h3 class="mt-4 text-lg font-medium text-gray-900">
        沒有找到符合條件的物品
      </h3>
      <p class="mt-2 text-gray-500">請嘗試調整搜尋條件或篩選條件</p>
    </div>
    <template v-else>
      <div
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8"
      >
        <div
          v-for="item in items"
          :key="item.item_id"
          class="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col"
        >
          <div
            class="relative h-40 bg-gray-100 flex items-center justify-center"
          >
            <img
              :src="formatImageUrl(item.image_url)"
              :alt="item.title"
              class="w-full h-full object-contain"
            />
            <span
              class="absolute top-2 right-2 px-2 py-1 text-xs rounded-full"
              :class="
                item.status === 'found'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              "
            >
              {{ item.status === "found" ? "已找到" : "尋找中" }}
            </span>
          </div>
          <div class="flex-1 flex flex-col p-4">
            <h3 class="text-lg font-semibold mb-1 line-clamp-1">
              {{ item.title }}
            </h3>
            <p class="text-sm text-gray-600 mb-3 line-clamp-2">
              {{ item.description }}
            </p>
            <div class="mt-auto space-y-2 text-sm text-gray-500">
              <div class="flex items-center">
                <MapPin class="mr-2 h-4 w-4 flex-shrink-0" />
                <span class="truncate">{{ item.location }}</span>
              </div>
              <div class="flex items-center">
                <Calendar class="mr-2 h-4 w-4 flex-shrink-0" />
                <span>{{ formatDate(item.discover_time) }}</span>
              </div>
              <NuxtLink
                :to="`/items/${item.item_id}`"
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
  Package,
  MapPin,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from "lucide-vue-next";
import { useRuntimeConfig } from "#app";

const config = useRuntimeConfig();

// 類別選項
const categoryOptions = [
  { value: "all", label: "所有類別" },
  { value: "有價票券", label: "有價票券" },
  { value: "3C電子", label: "3C電子" },
  { value: "身分證件", label: "身分證件" },
  { value: "運動物品", label: "運動物品" },
  { value: "眼鏡服裝", label: "眼鏡服裝" },
  { value: "文具書籍", label: "文具書籍" },
  { value: "保溫瓶", label: "保溫瓶" },
  { value: "手錶", label: "手錶" },
  { value: "鑰匙", label: "鑰匙" },
  { value: "雨傘", label: "雨傘" },
  { value: "其他", label: "其他" },
];

// 狀態選項
const statusOptions = [
  { value: "all", label: "所有狀態" },
  { value: "found", label: "已找到" },
  { value: "lost", label: "尋找中" },
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
const items = ref([]);
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
  if (!url) return "/placeholder.svg?height=200&width=300";

  // 如果已經是完整URL，直接返回
  if (url.startsWith("http")) {
    return url;
  }

  // 否則拼接後端base URL
  return `${config.public.BACKEND_BASE_URL}${url}`;
};

// 從API獲取資料
const fetchItems = async () => {
  loading.value = true;
  try {
    const params = new URLSearchParams();
    if (category.value !== "all") params.append("category", category.value);
    if (status.value !== "all") params.append("status", status.value);
    if (keyword.value) params.append("keyword", keyword.value);
    params.append("page", currentPage.value);
    params.append("limit", pageSize.value);

    const response = await fetch(
      `${config.public.BACKEND_BASE_URL}/items?${params.toString()}`
    );
    const data = await response.json();

    if (data.success) {
      items.value = data.data;
      pagination.value = data.pagination;
    } else {
      console.error("獲取物品列表失敗:", data.message);
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
  fetchItems();
});

// 當頁碼或每頁顯示數量變更時，重新獲取資料
watch([currentPage, pageSize], fetchItems);

// 組件掛載時獲取資料
onMounted(fetchItems);
</script>
