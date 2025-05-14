<template>
  <div class="container mx-auto px-4 py-8">
    <!-- 返回按鈕 -->
    <div class="mb-6">
      <button
        @click="router.push('/items')"
        class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex items-center"
      >
        <ArrowLeft class="mr-2 h-4 w-4" />
        返回物品列表
      </button>
    </div>

    <div v-if="loading" class="text-center py-12">
      <div class="flex items-center justify-center">
        <div
          class="w-12 h-12 border-4 border-gray-300 border-t-emerald-600 rounded-full animate-spin"
        ></div>
      </div>
      <p class="mt-4 text-gray-600">正在載入資料...</p>
    </div>

    <div v-else-if="!item" class="text-center">
      <h1 class="text-3xl font-bold mb-4">物品不存在</h1>
      <p class="text-gray-600 mb-6">
        找不到對應的物品信息，可能已被刪除或連結錯誤。
      </p>
      <button
        @click="router.push('/items')"
        class="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors flex items-center mx-auto"
      >
        <ArrowLeft class="mr-2 h-4 w-4" />
        返回物品列表
      </button>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- 左側：物品圖片和基本信息 -->
      <div class="lg:col-span-2">
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
          <!-- 物品標題和狀態 -->
          <div class="p-6 border-b border-gray-200">
            <div class="mb-4">
              <div class="flex justify-between items-center">
                <h1 class="text-2xl font-bold">{{ item.title }}</h1>
                <span
                  class="px-2 py-1 text-sm rounded-full"
                  :class="getStatusClass(item.status)"
                >
                  {{ getStatusText(item.status) }}
                </span>
              </div>
            </div>
            <div class="flex flex-wrap gap-2 mt-3">
              <span
                v-for="(keyword, index) in item.keywords"
                :key="index"
                class="px-2 py-1 text-xs bg-gray-100 rounded-full"
              >
                {{ keyword }}
              </span>
            </div>
          </div>

          <!-- 物品圖片 -->
          <div class="relative">
            <div class="aspect-video overflow-hidden">
              <img
                :src="getImageUrl(activeImageIndex)"
                :alt="item.title"
                class="w-full h-full object-contain"
              />
            </div>

            <!-- 圖片導航按鈕 -->
            <template v-if="images.length > 1">
              <button
                class="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 text-white p-1 rounded-full hover:bg-black/50"
                @click="prevImage"
              >
                <ChevronLeft class="h-6 w-6" />
              </button>
              <button
                class="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 text-white p-1 rounded-full hover:bg-black/50"
                @click="nextImage"
              >
                <ChevronRight class="h-6 w-6" />
              </button>

              <!-- 圖片指示器 -->
              <div
                class="absolute bottom-2 left-0 right-0 flex justify-center gap-1"
              >
                <button
                  v-for="(_, index) in images"
                  :key="index"
                  :class="`w-2 h-2 rounded-full ${index === activeImageIndex ? 'bg-white' : 'bg-white/50'}`"
                  @click="activeImageIndex = index"
                />
              </div>
            </template>
          </div>

          <!-- 縮圖預覽 -->
          <div v-if="images.length > 1" class="p-4 flex gap-2 overflow-x-auto">
            <button
              v-for="(image, index) in images"
              :key="index"
              :class="`w-20 h-20 flex-shrink-0 rounded-md overflow-hidden border-2 ${index === activeImageIndex ? 'border-emerald-500' : 'border-transparent'}`"
              @click="activeImageIndex = index"
            >
              <img
                :src="formatImageUrl(image)"
                :alt="`${item.title} ${index + 1}`"
                class="w-full h-full object-cover"
              />
            </button>
          </div>

          <!-- 物品詳細信息 -->
          <div class="p-6">
            <div class="border-b mb-6">
              <div class="flex space-x-4 -mb-px">
                <button
                  :class="`py-2 px-4 border-b-2 ${activeTab === 'details' ? 'border-emerald-500 text-emerald-600 font-medium' : 'border-transparent text-gray-500 hover:text-gray-700'}`"
                  @click="activeTab = 'details'"
                >
                  物品詳情
                </button>
                <button
                  :class="`py-2 px-4 border-b-2 ${activeTab === 'location' ? 'border-emerald-500 text-emerald-600 font-medium' : 'border-transparent text-gray-500 hover:text-gray-700'}`"
                  @click="activeTab = 'location'"
                >
                  位置信息
                </button>
              </div>
            </div>

            <div v-if="activeTab === 'details'" class="space-y-4">
              <div>
                <h2 class="text-lg font-semibold mb-2">物品描述</h2>
                <p class="text-gray-700">{{ item.description }}</p>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="flex items-center">
                  <Calendar class="h-5 w-5 text-gray-500 mr-2" />
                  <div>
                    <p class="text-sm text-gray-500">日期</p>
                    <p class="font-medium">
                      {{ formatDate(item.discover_time) }}
                    </p>
                  </div>
                </div>

                <div class="flex items-center">
                  <Clock class="h-5 w-5 text-gray-500 mr-2" />
                  <div>
                    <p class="text-sm text-gray-500">時間</p>
                    <p class="font-medium">
                      {{ formatTime(item.discover_time) }}
                    </p>
                  </div>
                </div>

                <div class="flex items-center">
                  <MapPin class="h-5 w-5 text-gray-500 mr-2" />
                  <div>
                    <p class="text-sm text-gray-500">地點</p>
                    <p class="font-medium">{{ item.location }}</p>
                  </div>
                </div>

                <div class="flex items-center">
                  <User class="h-5 w-5 text-gray-500 mr-2" />
                  <div>
                    <p class="text-sm text-gray-500">發布者</p>
                    <p class="font-medium">{{ creatorName }}</p>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="activeTab === 'location'" class="space-y-4">
              <div class="mb-4">
                <h2 class="text-lg font-semibold mb-2">位置</h2>
                <p class="text-gray-700">{{ item.location }}</p>
              </div>

              <div
                class="h-[300px] relative rounded-lg overflow-hidden border border-gray-300"
              >
                <div id="itemLocationMap" class="h-full w-full"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- 相似物品 -->
        <div class="mt-8">
          <h2 class="text-2xl font-bold mb-4">相似物品</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <NuxtLink
              v-for="similarItem in similarItems"
              :key="similarItem.id"
              :to="`/items/${similarItem.id}`"
              class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div class="relative h-40">
                <img
                  :src="similarItem.image"
                  :alt="similarItem.title"
                  class="w-full h-full object-cover"
                />
                <span
                  class="absolute top-2 right-2 px-2 py-1 text-xs rounded-full"
                  :class="getStatusClass(similarItem.status)"
                >
                  {{ getStatusText(similarItem.status) }}
                </span>
              </div>
              <div class="p-4">
                <h3 class="font-semibold mb-1 truncate">
                  {{ similarItem.title }}
                </h3>
                <p class="text-sm text-gray-600 line-clamp-2">
                  {{ similarItem.description }}
                </p>
                <div class="flex items-center mt-2 text-xs text-gray-500">
                  <MapPin class="h-3 w-3 mr-1" />
                  <span>{{ similarItem.location }}</span>
                </div>
              </div>
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- 右側：聯絡和操作 -->
      <div class="space-y-6">
        <!-- 聯絡信息 -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold mb-4">聯絡信息</h2>

          <div class="flex items-center mb-4">
            <div class="w-12 h-12 rounded-full overflow-hidden mr-3">
              <img
                :src="creatorAvatar"
                :alt="creatorName"
                class="w-full h-full object-cover"
              />
            </div>
            <div>
              <p class="font-medium">{{ creatorName }}</p>
              <p class="text-sm text-gray-500">拾獲者</p>
            </div>
          </div>

          <div class="mb-4">
            <p class="text-sm text-gray-500 mb-1">聯絡方式</p>
            <p class="font-medium">{{ item.contact || "站內訊息" }}</p>
            <p v-if="item.contact_info" class="text-gray-700">
              {{ item.contact_info }}
            </p>
            <p
              class="text-xs mt-2"
              :class="item.allow_message ? 'text-emerald-600' : 'text-red-600'"
            >
              <span v-if="item.allow_message" class="flex items-center">
                <MessageSquareText class="h-3 w-3 mr-1" />
                允許私訊
              </span>
              <span v-else class="flex items-center">
                <MessageSquareOff class="h-3 w-3 mr-1" />
                不允許私訊
              </span>
            </p>
            <!-- 顯示物品是否由管理者持有 -->
            <p
              class="text-xs mt-2 flex items-center"
              :class="item.is_with_owner ? 'text-amber-600' : 'text-gray-500'"
            >
              <Package class="h-3 w-3 mr-1" />
              {{
                item.is_with_owner ? "物品已由管理者保管" : "物品未由管理者保管"
              }}
            </p>
          </div>

          <!-- 發送訊息 (根據 allow_message 顯示不同內容) -->
          <div v-if="item.allow_message" class="space-y-3">
            <textarea
              v-model="message"
              placeholder="輸入訊息..."
              class="w-full border border-gray-300 rounded-md px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500"
              rows="3"
              :disabled="item.status !== 'active'"
              :class="{ 'bg-gray-100': item.status !== 'active' }"
            ></textarea>
            <button
              @click="handleSendMessage"
              :disabled="
                isSending || !message.trim() || item.status !== 'active'
              "
              class="w-full px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div v-if="isSending" class="flex items-center justify-center">
                <Loader2 class="mr-2 h-4 w-4 animate-spin" />
                發送中...
              </div>
              <div
                v-else-if="item.status !== 'active'"
                class="flex items-center justify-center"
              >
                <XCircle class="mr-2 h-4 w-4" />
                {{ getDisabledMessageText(item.status) }}
              </div>
              <div v-else class="flex items-center justify-center">
                <MessageCircle class="mr-2 h-4 w-4" />
                發送訊息
              </div>
            </button>

            <!-- 如果物品留在原處且開放私訊，增加認領按鈕 -->
            <button
              v-if="!item.is_with_owner"
              @click="handleClaimItem"
              :disabled="isClaiming || item.status !== 'active'"
              class="w-full px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              <div v-if="isClaiming" class="flex items-center justify-center">
                <Loader2 class="mr-2 h-4 w-4 animate-spin" />
                處理中...
              </div>
              <div
                v-else-if="item.status !== 'active'"
                class="flex items-center justify-center"
              >
                <XCircle class="mr-2 h-4 w-4" />
                {{ getStatusActionText(item.status) }}
              </div>
              <div v-else class="flex items-center justify-center">
                <Hand class="mr-2 h-4 w-4" />
                這是我的，我已拾回
              </div>
            </button>
          </div>
          <div v-else class="space-y-3">
            <button
              @click="handleClaimItem"
              :disabled="isClaiming || item.status !== 'active'"
              class="w-full px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div v-if="isClaiming" class="flex items-center justify-center">
                <Loader2 class="mr-2 h-4 w-4 animate-spin" />
                處理中...
              </div>
              <div
                v-else-if="item.status !== 'active'"
                class="flex items-center justify-center"
              >
                <XCircle class="mr-2 h-4 w-4" />
                {{ item.status === "claimed" ? "物品已被認領" : "無法操作" }}
              </div>
              <div v-else class="flex items-center justify-center">
                <Hand class="mr-2 h-4 w-4" />
                這是我的，我已拾回
              </div>
            </button>
          </div>
        </div>

        <!-- 操作按鈕 -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold mb-4">操作</h2>

          <div class="space-y-3">
            <button
              v-if="item.status === 'lost'"
              @click="handleMarkAsFound"
              :disabled="isMarkingFound"
              class="w-full px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div
                v-if="isMarkingFound"
                class="flex items-center justify-center"
              >
                <Loader2 class="mr-2 h-4 w-4 animate-spin" />
                處理中...
              </div>
              <div v-else class="flex items-center justify-center">
                <CheckCircle class="mr-2 h-4 w-4" />
                標記為已找回
              </div>
            </button>

            <button
              @click="handleShare"
              class="w-full px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              <div class="flex items-center justify-center">
                <Share2 class="mr-2 h-4 w-4" />
                分享
              </div>
            </button>

            <button
              @click="handleReport"
              :disabled="isReporting"
              class="w-full px-4 py-2 border border-gray-300 bg-white text-red-500 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div v-if="isReporting" class="flex items-center justify-center">
                <Loader2 class="mr-2 h-4 w-4 animate-spin" />
                處理中...
              </div>
              <div v-else class="flex items-center justify-center">
                <Flag class="mr-2 h-4 w-4" />
                舉報
              </div>
            </button>
          </div>
        </div>

        <!-- 提示信息 -->
        <div class="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <h3 class="font-semibold text-amber-800 mb-2">安全提示</h3>
          <p class="text-sm text-amber-700">
            為了您的安全，建議在公共場所進行物品交接。請勿提供個人敏感信息，如銀行帳號等。
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, onUnmounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useRuntimeConfig, useCookie } from "#app";
import { useHead } from "#imports";
import {
  MapPin,
  Calendar,
  Clock,
  User,
  MessageCircle,
  Share2,
  Flag,
  CheckCircle,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Loader2,
  MessageSquareText,
  MessageSquareOff,
  Hand,
  Package,
  XCircle,
} from "lucide-vue-next";

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

const config = useRuntimeConfig();
const router = useRouter();
const route = useRoute();
const id = route.params.id;

// 狀態變數
const loading = ref(true);
const item = ref(null);
const activeImageIndex = ref(0);
const activeTab = ref("details");
const message = ref("");
const isSending = ref(false);
const isReporting = ref(false);
const isMarkingFound = ref(false);
const isClaiming = ref(false);
const mapInitialized = ref(false);
let itemMap = null;
let itemMarker = null; // 添加標記變數以便於管理

// 模擬相似物品數據（保留）
const similarItems = ref([
  {
    id: "3",
    title: "藍色水壺",
    description: "在體育館撿到的藍色保溫水壺",
    status: "claimed",
    date: "2023-04-26",
    location: "體育館",
    // image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "4",
    title: "學生證",
    description: "在宿舍區遺失的學生證",
    status: "closed",
    date: "2023-04-25",
    location: "宿舍區",
    // image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "5",
    title: "筆記型電腦",
    description: "在圖書館三樓遺失的筆記型電腦，黑色 MacBook Pro",
    status: "withdrawn",
    date: "2023-04-24",
    location: "圖書館三樓",
    // image: "/placeholder.svg?height=200&width=300",
  },
]);

// 計算屬性
const images = computed(() => {
  if (!item.value || !item.value.image_url) return [];
  return Array.isArray(item.value.image_url)
    ? item.value.image_url
    : [item.value.image_url];
});

const creatorName = computed(() => {
  return item.value?.creator?.nickname || "匿名用戶";
});

const creatorAvatar = computed(() => {
  if (!item.value?.creator?.avatar_url)
    return "/placeholder.svg?height=50&width=50";
  return formatImageUrl(item.value.creator.avatar_url);
});

// 格式化圖片 URL
const formatImageUrl = (url) => {
  if (!url) return "/placeholder.svg?height=200&width=300";

  if (url.startsWith("http")) {
    return url;
  }

  return `${config.public.BACKEND_BASE_URL}${url}`;
};

// 獲取當前顯示的圖片 URL
const getImageUrl = (index) => {
  if (!images.value.length) return "/placeholder.svg?height=400&width=600";
  return formatImageUrl(images.value[index]);
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
  const date = new Date(dateString);
  return date.toLocaleTimeString("zh-TW", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

// 從 API 獲取物品數據
const fetchItemData = async () => {
  loading.value = true;
  try {
    const response = await fetch(
      `${config.public.BACKEND_BASE_URL}/items/${id}`
    );
    const data = await response.json();

    if (data.success && data.data) {
      item.value = data.data;
      console.log("獲取物品詳情成功:", item.value);
    } else {
      console.error("獲取物品詳情失敗:", data.message);
      item.value = null;
    }
  } catch (error) {
    console.error("API請求失敗:", error);
    item.value = null;
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  if (route.params.id) {
    fetchItemData();
  }
});

// 圖片導航
const nextImage = () => {
  if (!images.value.length) return;
  activeImageIndex.value =
    activeImageIndex.value === images.value.length - 1
      ? 0
      : activeImageIndex.value + 1;
};

const prevImage = () => {
  if (!images.value.length) return;
  activeImageIndex.value =
    activeImageIndex.value === 0
      ? images.value.length - 1
      : activeImageIndex.value - 1;
};

// 發送訊息
const handleSendMessage = () => {
  if (!message.value.trim()) return;

  isSending.value = true;

  // 模擬 API 請求
  setTimeout(() => {
    isSending.value = false;
    message.value = "";
    alert("訊息已發送！");
  }, 1000);
};

// 舉報物品
const handleReport = () => {
  isReporting.value = true;

  // 模擬 API 請求
  setTimeout(() => {
    isReporting.value = false;
    alert("舉報已提交，我們會盡快審核。");
  }, 1000);
};

// 標記為已找回
const handleMarkAsFound = () => {
  isMarkingFound.value = true;

  // 模擬 API 請求
  setTimeout(() => {
    isMarkingFound.value = false;
    alert("物品已標記為已找回！");
    // 在實際應用中，這裡應該更新物品狀態，可以繼續透過 API 更新
    fetchItemData(); // 重新獲取物品數據以顯示更新後的狀態
  }, 1000);
};

// 分享物品
const handleShare = () => {
  if (navigator.share) {
    navigator.share({
      title: `LOFO - ${item.value.title}`,
      text: `查看 LOFO 平台上的${item.value.status === "found" ? "拾獲物" : "遺失物"}：${item.value.title}`,
      url: window.location.href,
    });
  } else {
    // 如果瀏覽器不支持原生分享 API，則複製連結
    navigator.clipboard.writeText(window.location.href);
    alert("連結已複製到剪貼簿！");
  }
};

// 認領物品
const handleClaimItem = async () => {
  isClaiming.value = true;

  try {
    // 獲取認證 token
    const authCookie = useCookie("auth_token");

    // 發送認領請求
    const response = await fetch(
      `${config.public.BACKEND_BASE_URL}/items/${id}/claim`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authCookie.value}`,
        },
      }
    );

    const data = await response.json();

    if (data.success) {
      alert("物品認領成功，將為您聯繫物品拾獲者！");
      fetchItemData(); // 重新獲取物品數據以顯示更新後的狀態
    } else {
      alert(`認領失敗: ${data.message}`);
    }
  } catch (error) {
    console.error("認領物品時發生錯誤:", error);
    alert("認領物品時發生錯誤，請稍後再試。");
  } finally {
    isClaiming.value = false;
  }
};

// 監控 activeTab 變化，初始化地圖
watch(activeTab, (newTab) => {
  if (newTab === "location") {
    // 延遲初始化，確保 DOM 已完全渲染
    setTimeout(() => {
      initMap();
    }, 300);
  }
});

// 初始化地圖
const initMap = () => {
  // 確保在客戶端環境下執行且已載入地圖資料
  if (!process.client || !window.L || !item.value) return;

  try {
    const latitude = parseFloat(item.value.latitude);
    const longitude = parseFloat(item.value.longitude);

    if (isNaN(latitude) || isNaN(longitude)) {
      console.warn("物品沒有有效的坐標數據");
      return;
    }

    // 獲取地圖容器
    const mapContainer = document.getElementById("itemLocationMap");
    if (!mapContainer) {
      console.warn("找不到地圖容器元素");
      return;
    }

    // 如果地圖已經被初始化，先銷毀它
    if (itemMap) {
      itemMap.remove();
      itemMap = null;
      mapInitialized.value = false;
    }

    // 初始化地圖
    itemMap = window.L.map("itemLocationMap", {
      maxBoundsViscosity: 1.0,
      minZoom: 15,
      zoomSnap: 0.1,
    }).setView([latitude, longitude], 16.2);

    // 加入圖層
    window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap 貢獻者",
    }).addTo(itemMap);

    // 創建紅色圖標
    const redIcon = window.L.icon({
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
    itemMarker = window.L.marker([latitude, longitude], {
      icon: redIcon,
    }).addTo(itemMap);

    // 添加彈出視窗
    const popupContent = `
      <div class="item-popup">
        <h3 class="font-semibold text-sm">${item.value.title}</h3>
        ${item.value.image_url ? `<img src="${formatImageUrl(item.value.image_url)}" alt="${item.value.title}" style="width: 100%; height: auto; max-height: 80px; object-fit: contain; border-radius: 4px; margin: 4px 0;" />` : ""}
        <div class="mt-1">
          <span class="inline-block px-2 py-0.5 text-xs font-semibold rounded-full ${item.value.status === "found" ? "bg-emerald-100 text-emerald-800" : "bg-blue-100 text-blue-800"}">
            ${item.value.status === "found" ? "拾獲物品" : "遺失物品"}
          </span>
        </div>
        <p class="text-xs mt-1 mb-0"><strong>地點:</strong> ${item.value.location}</p>
        <p class="text-xs mt-0.5 mb-1"><strong>時間:</strong> ${formatDate(item.value.discover_time)}</p>
      </div>
    `;

    // 綁定彈出視窗 - 使用小尺寸選項但不自動打開
    const popupOptions = {
      maxWidth: 180,
      className: "custom-popup",
      offset: [0, -10],
    };

    itemMarker.bindPopup(popupContent, popupOptions);

    // 設置標誌，表示地圖已初始化
    mapInitialized.value = true;

    // 確保地圖尺寸正確
    setTimeout(() => {
      itemMap.invalidateSize();
    }, 100);
  } catch (error) {
    console.error("初始化地圖時發生錯誤:", error);
  }
};

onUnmounted(() => {
  if (itemMap) {
    itemMap.remove();
    itemMap = null;
  }
});

// 獲取狀態的顯示文字
const getStatusText = (status) => {
  switch (status) {
    case "active":
      return "活躍";
    case "claimed":
      return "已認領";
    case "closed":
      return "已結束";
    case "withdrawn":
      return "已撤回";
    default:
      return "未知狀態";
  }
};

// 獲取狀態的樣式
const getStatusClass = (status) => {
  switch (status) {
    case "active":
      return "bg-emerald-100 text-emerald-800";
    case "claimed":
      return "bg-blue-100 text-blue-800";
    case "closed":
      return "bg-gray-100 text-gray-800";
    case "withdrawn":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

// 獲取禁用訊息的顯示文字
const getDisabledMessageText = (status) => {
  switch (status) {
    case "claimed":
      return "物品已被認領";
    case "closed":
      return "物品已結束";
    case "withdrawn":
      return "物品已撤回";
    default:
      return "無法操作";
  }
};

// 獲取狀態操作的顯示文字
const getStatusActionText = (status) => {
  switch (status) {
    case "claimed":
      return "物品已被認領";
    case "closed":
      return "物品已結束";
    case "withdrawn":
      return "物品已撤回";
    default:
      return "無法操作";
  }
};
</script>
