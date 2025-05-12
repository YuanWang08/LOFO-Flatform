<template>
  <div class="container mx-auto px-4 py-4">
    <!-- 載入中顯示 -->
    <div v-if="loading" class="text-center py-12">
      <div class="flex items-center justify-center">
        <div
          class="w-12 h-12 border-4 border-gray-300 border-t-emerald-600 rounded-full animate-spin"
        ></div>
      </div>
      <p class="mt-4 text-gray-600">正在載入資料...</p>
    </div>

    <!-- 錯誤提示 -->
    <div v-else-if="error" class="text-center py-12">
      <AlertTriangle class="mx-auto h-12 w-12 text-red-500" />
      <h3 class="mt-4 text-lg font-medium text-gray-900">無法載入物品資訊</h3>
      <p class="mt-2 text-gray-500">{{ errorMessage }}</p>
      <NuxtLink
        to="/items"
        class="mt-4 inline-block px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
      >
        返回物品列表
      </NuxtLink>
    </div>

    <!-- 物品詳情 (根據截圖優化後的佈局) -->
    <div v-else>
      <!-- 返回按鈕 -->
      <NuxtLink
        to="/items"
        class="inline-flex items-center text-emerald-600 hover:text-emerald-700 mb-3"
      >
        <ArrowLeft class="h-4 w-4 mr-1" />
        <span>返回物品列表</span>
      </NuxtLink>

      <div class="bg-white rounded-lg shadow overflow-hidden">
        <!-- 物品標題區 -->
        <div class="p-4 lg:p-5 border-b">
          <h1 class="text-2xl font-bold">{{ item.title }}</h1>
          <div class="flex items-center text-gray-500 text-sm mt-1">
            <Calendar class="h-4 w-4 mr-1" />
            <span>{{ formatDate(item.discover_time) }}</span>
            <span class="mx-2">•</span>
            <Eye class="h-4 w-4 mr-1" />
            <span>{{ item.view_count || 0 }} 次瀏覽</span>
          </div>
        </div>

        <!-- 物品內容 - 雙欄布局 -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-0">
          <!-- 左側：圖片區 -->
          <div class="p-4 flex items-center justify-center bg-gray-50">
            <img
              :src="formatImageUrl(item.image_url)"
              :alt="item.title"
              class="max-h-64 object-contain rounded-lg"
            />
          </div>

          <!-- 右側：物品詳情 -->
          <div class="p-4">
            <!-- 狀態標籤 (更突出顯示) -->
            <div class="mb-4">
              <span
                class="px-3 py-1 text-sm font-semibold rounded-full inline-block"
                :class="
                  item.status === 'found'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                "
              >
                {{ item.status === "found" ? "拾獲物品" : "遺失物品" }}
              </span>
            </div>

            <!-- 物品信息 - 緊湊表格式布局 -->
            <div class="grid grid-cols-3 gap-y-3 mb-4">
              <div class="col-span-1 text-gray-600 text-sm">物品類別</div>
              <div class="col-span-2 font-medium">{{ item.category }}</div>

              <div class="col-span-1 text-gray-600 text-sm">地點</div>
              <div class="col-span-2 font-medium">{{ item.location }}</div>

              <div class="col-span-1 text-gray-600 text-sm">時間</div>
              <div class="col-span-2 font-medium">
                {{ formatDate(item.discover_time, true) }}
              </div>

              <div class="col-span-1 text-gray-600 text-sm">現在狀態</div>
              <div class="col-span-2 font-medium">{{ item.holding_state }}</div>

              <div class="col-span-1 text-gray-600 text-sm">聯絡方式</div>
              <div class="col-span-2 font-medium">{{ item.contact }}</div>
            </div>

            <!-- 發佈者資訊 -->
            <div v-if="item.creator" class="flex items-center mt-3">
              <img
                :src="formatImageUrl(item.creator.avatar_url)"
                alt="發佈者頭像"
                class="w-6 h-6 rounded-full mr-2"
              />
              <span class="font-medium">{{ item.creator.nickname }}</span>
            </div>
          </div>
        </div>

        <!-- 描述區塊 -->
        <div class="p-4 lg:p-5 border-t">
          <h2 class="font-semibold mb-2">物品描述</h2>
          <p class="text-gray-700 whitespace-pre-line text-sm">
            {{ item.description }}
          </p>

          <!-- 關鍵詞標籤 -->
          <div v-if="item.keywords && item.keywords.length > 0" class="mt-4">
            <h2 class="font-semibold mb-2">關鍵詞標籤</h2>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="(keyword, index) in item.keywords"
                :key="index"
                class="px-2 py-0.5 bg-gray-100 text-gray-800 text-xs rounded-full"
              >
                {{ keyword }}
              </span>
            </div>
          </div>
        </div>

        <!-- 地圖 (縮小並整合到主要內容中) -->
        <div v-if="item.latitude && item.longitude" class="p-4 lg:p-5 border-t">
          <h2 class="font-semibold mb-2">物品位置</h2>
          <div
            class="h-[180px] md:h-[240px] lg:h-[300px] rounded-lg border shadow-sm"
          >
            <div id="item-map" class="h-full w-full rounded-lg"></div>
          </div>
        </div>

        <!-- 操作按鈕區 -->
        <div class="p-4 lg:p-5 border-t flex flex-wrap gap-3 justify-center">
          <button
            v-if="isAuthenticated && !showClaimForm"
            @click="showClaimForm = true"
            class="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-md shadow-sm transition-colors"
          >
            <span v-if="item.status === 'found'">申領此物品</span>
            <span v-else>我有類似物品</span>
          </button>

          <NuxtLink
            v-if="!isAuthenticated"
            to="/login"
            class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md shadow-sm transition-colors"
          >
            登入以申領物品
          </NuxtLink>

          <button
            @click="shareItem"
            class="px-4 py-2 border border-gray-300 hover:bg-gray-50 rounded-md shadow-sm transition-colors"
          >
            分享
          </button>

          <NuxtLink
            to="/map"
            class="px-4 py-2 border border-gray-300 hover:bg-gray-50 rounded-md shadow-sm transition-colors"
          >
            在地圖上查看
          </NuxtLink>
        </div>
      </div>

      <!-- 申領表單 (獨立卡片) -->
      <div
        v-if="showClaimForm"
        class="mt-4 bg-white rounded-lg shadow p-4 lg:p-5"
      >
        <div class="flex justify-between items-center mb-3">
          <h2 class="text-lg font-semibold">
            {{ item.status === "found" ? "申領物品" : "協助尋找" }}
          </h2>
          <button
            @click="showClaimForm = false"
            class="text-gray-500 hover:text-gray-700"
          >
            <X class="h-5 w-5" />
          </button>
        </div>

        <p class="text-sm text-gray-600 mb-4">
          {{
            item.status === "found"
              ? "請提供足夠的資訊證明這是您遺失的物品，管理員會審核您的申請。"
              : "請提供您找到的類似物品資訊，幫助失主尋回物品。"
          }}
        </p>

        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">訊息</label>
          <textarea
            v-model="claimMessage"
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
            :placeholder="
              item.status === 'found'
                ? '請描述物品的特徵或提供其他證明這是您的物品的資訊...'
                : '請描述您發現的類似物品以及相關資訊...'
            "
          ></textarea>
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">聯絡方式</label>
          <input
            v-model="claimContact"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
            placeholder="手機號碼、電子郵件或其他聯絡方式..."
          />
        </div>

        <div class="flex justify-end gap-2">
          <button
            @click="showClaimForm = false"
            class="px-3 py-1.5 border border-gray-300 hover:bg-gray-50 rounded-md text-sm"
          >
            取消
          </button>
          <button
            @click="submitClaim"
            :disabled="isSubmitting"
            :class="[
              'px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-sm',
              { 'opacity-50 cursor-not-allowed': isSubmitting },
            ]"
          >
            {{ isSubmitting ? "提交中..." : "提交申請" }}
          </button>
        </div>
      </div>
    </div>

    <!-- 成功提示 -->
    <div
      v-if="showSuccessMessage"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white rounded-lg shadow-xl p-6 max-w-md">
        <div class="flex items-center">
          <CheckCircle class="h-10 w-10 text-emerald-500 mr-3" />
          <div>
            <h3 class="text-lg font-semibold">申請已提交</h3>
            <p class="text-gray-600">
              您的申請已成功提交，我們會盡快處理，請留意通知訊息。
            </p>
          </div>
        </div>
        <div class="mt-6 flex justify-end">
          <button
            @click="showSuccessMessage = false"
            class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md"
          >
            關閉
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Eye,
  Share2,
  CheckCircle,
  AlertTriangle,
  X,
} from "lucide-vue-next";
import { useRoute } from "vue-router";
import { useRuntimeConfig } from "#app";
import { useHead } from "#imports";
import { useAuthStore } from "~/stores/auth";

// 初始化
const config = useRuntimeConfig();
const route = useRoute();
const authStore = useAuthStore();
const isAuthenticated = ref(false);

const item = ref({});
const loading = ref(true);
const error = ref(false);
const errorMessage = ref("");
const showClaimForm = ref(false);
const claimMessage = ref("");
const claimContact = ref("");
const isSubmitting = ref(false);
const showSuccessMessage = ref(false);

// Leaflet 相關
let map;
let marker;

// 檢查登入狀態
const checkAuthStatus = () => {
  isAuthenticated.value = authStore.checkAuth();
};

// 動態加載 Leaflet CSS 和 JS (只在客戶端渲染)
if (process.client) {
  useHead({
    link: [
      {
        rel: "stylesheet",
        href: "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css",
        integrity: "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=",
        crossorigin: "",
      },
    ],
    script: [
      {
        src: "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js",
        integrity: "sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=",
        crossorigin: "",
      },
    ],
  });
}

// 格式化日期
const formatDate = (dateString, includeTime = false) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (includeTime) {
    return date.toLocaleString("zh-TW", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  }
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

// 從API獲取物品詳情
const fetchItemDetail = async () => {
  loading.value = true;
  error.value = false;
  try {
    const response = await fetch(
      `${config.public.BACKEND_BASE_URL}/items/${route.params.id}`
    );
    const data = await response.json();

    if (data.success) {
      item.value = data.data;
    } else {
      error.value = true;
      errorMessage.value = data.message || "無法獲取物品詳情";
    }
  } catch (err) {
    error.value = true;
    errorMessage.value = "請求失敗，請稍後再試";
    console.error("獲取物品詳情失敗:", err);
  } finally {
    loading.value = false;
  }
};

// 分享物品
const shareItem = async () => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: item.value.title,
        text: `查看LOFO平台上的物品: ${item.value.title}`,
        url: window.location.href,
      });
    } catch (err) {
      console.error("分享失敗:", err);
    }
  } else {
    // 複製連結到剪貼簿
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => alert("連結已複製到剪貼簿"))
      .catch((err) => console.error("複製失敗:", err));
  }
};

// 提交申領申請
const submitClaim = async () => {
  if (!claimMessage.value) {
    alert("請填寫申領訊息");
    return;
  }

  isSubmitting.value = true;
  try {
    const authCookie = useCookie("auth_token");
    const response = await fetch(
      `${config.public.BACKEND_BASE_URL}/items/${route.params.id}/claim`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authCookie.value}`,
        },
        body: JSON.stringify({
          message: claimMessage.value,
          contact: claimContact.value || "無",
        }),
      }
    );

    const data = await response.json();

    if (response.ok) {
      showClaimForm.value = false;
      claimMessage.value = "";
      claimContact.value = "";
      showSuccessMessage.value = true;
    } else {
      alert(data.message || "申領失敗，請稍後再試");
    }
  } catch (err) {
    alert("發生錯誤，請稍後再試");
    console.error("申領物品失敗:", err);
  } finally {
    isSubmitting.value = false;
  }
};

// 初始化地圖
const initMap = () => {
  if (!process.client || !item.value.latitude || !item.value.longitude) return;

  setTimeout(() => {
    // 確保 Leaflet 已載入
    if (window.L && document.getElementById("item-map")) {
      const L = window.L;

      // 初始化地圖
      map = L.map("item-map", {
        zoomControl: false, // 禁用默認縮放控制
        attributionControl: false, // 禁用歸因控制
      }).setView([item.value.latitude, item.value.longitude], 17);

      // 添加自定義的縮放控制，位置調整為右下角
      L.control
        .zoom({
          position: "bottomright",
        })
        .addTo(map);

      // 加入圖層
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap 貢獻者",
      }).addTo(map);

      // 建立標記
      const redIcon = L.icon({
        iconUrl:
          "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
        shadowUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      });

      // 添加標記
      marker = L.marker([item.value.latitude, item.value.longitude], {
        icon: redIcon,
      }).addTo(map);

      // 簡單的彈出窗口，無需打開
      marker.bindPopup(`<b>${item.value.title}</b><br>${item.value.location}`);
    }
  }, 500);
};

// 監聽路由變化，如果 id 更改則重新獲取數據
watch(
  () => route.params.id,
  (newId, oldId) => {
    if (newId !== oldId) {
      fetchItemDetail();
    }
  }
);

// 監聽物品資料變化
watch(
  () => item.value,
  (newItem) => {
    if (newItem.latitude && newItem.longitude && process.client) {
      initMap();
    }
  },
  { deep: true }
);

// 組件掛載時
onMounted(() => {
  checkAuthStatus();
  fetchItemDetail();
});
</script>

<style scoped>
/* 確保地圖顯示正常 */
:deep(.leaflet-container) {
  z-index: 1;
  height: 100%;
  width: 100%;
  border-radius: 0.5rem;
}

/* 地圖樣式優化 */
:deep(.leaflet-control-zoom) {
  margin-right: 10px;
  margin-bottom: 10px;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2);
}

:deep(.leaflet-control-zoom a) {
  width: 26px;
  height: 26px;
  line-height: 26px;
}

/* 確保物品描述區域在內容太多時可滾動 */
p.whitespace-pre-line {
  max-height: 200px;
  overflow-y: auto;
}

@media (min-width: 768px) {
  .container {
    max-width: 900px;
  }
}
</style>
