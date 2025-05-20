<template>
  <div class="container mx-auto px-4 py-8">
    <!-- 返回按鈕 -->
    <div class="mb-6">
      <button
        @click="router.push('/foods')"
        class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex items-center"
      >
        <ArrowLeft class="mr-2 h-4 w-4" />
        返回食物列表
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

    <div v-else-if="!food" class="text-center">
      <h1 class="text-3xl font-bold mb-4">食物不存在</h1>
      <p class="text-gray-600 mb-6">
        找不到對應的食物信息，可能已被刪除或連結錯誤。
      </p>
      <button
        @click="router.push('/foods')"
        class="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors flex items-center mx-auto"
      >
        <ArrowLeft class="mr-2 h-4 w-4" />
        返回食物列表
      </button>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- 左側：食物圖片和基本信息 -->
      <div class="lg:col-span-2">
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
          <!-- 食物標題和狀態 -->
          <div class="p-6 border-b border-gray-200">
            <div class="mb-4">
              <div class="flex justify-between items-center">
                <h1 class="text-2xl font-bold">{{ food.title }}</h1>
                <span
                  class="px-2 py-1 text-sm rounded-full"
                  :class="getStatusClass(food.status)"
                >
                  {{ getStatusText(food.status) }}
                </span>
              </div>
            </div>
            <div class="flex flex-wrap items-center gap-4 mt-3">
              <div class="flex items-center">
                <Tag class="h-4 w-4 text-gray-500 mr-2" />
                <span class="text-gray-700">{{ food.category }}</span>
              </div>
              <div class="flex items-center">
                <Utensils class="h-4 w-4 text-gray-500 mr-2" />
                <span class="text-gray-700">{{ food.quantity }} 份</span>
              </div>
              <div class="flex items-center">
                <ShoppingBag class="h-4 w-4 text-gray-500 mr-2" />
                <span class="text-gray-700">{{
                  food.pickup_method === "self" ? "自取" : "預約取用"
                }}</span>
              </div>
            </div>
          </div>

          <!-- 食物圖片 -->
          <div class="relative">
            <div class="aspect-video overflow-hidden">
              <img
                :src="getImageUrl(activeImageIndex)"
                :alt="food.title"
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
                :alt="`${food.title} ${index + 1}`"
                class="w-full h-full object-cover"
              />
            </button>
          </div>

          <!-- 食物詳細信息 -->
          <div class="p-6">
            <div class="border-b mb-6">
              <div class="flex space-x-4 -mb-px">
                <button
                  :class="`py-2 px-4 border-b-2 ${activeTab === 'details' ? 'border-emerald-500 text-emerald-600 font-medium' : 'border-transparent text-gray-500 hover:text-gray-700'}`"
                  @click="activeTab = 'details'"
                >
                  食物詳情
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
                <h2 class="text-lg font-semibold mb-2">食物描述</h2>
                <p class="text-gray-700">{{ food.description }}</p>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="flex items-center">
                  <AlarmClock class="h-5 w-5 text-gray-500 mr-2" />
                  <div>
                    <p class="text-sm text-gray-500">有效期限</p>
                    <p class="font-medium">
                      {{ formatDateTime(food.expire_date) }}
                    </p>
                  </div>
                </div>

                <div class="flex items-center">
                  <Utensils class="h-5 w-5 text-gray-500 mr-2" />
                  <div>
                    <p class="text-sm text-gray-500">剩餘份數</p>
                    <p class="font-medium">
                      {{ food.quantity - reservedQuantity }} /
                      {{ food.quantity }} 份
                    </p>
                  </div>
                </div>

                <div class="flex items-center">
                  <MapPin class="h-5 w-5 text-gray-500 mr-2" />
                  <div>
                    <p class="text-sm text-gray-500">地點</p>
                    <p class="font-medium">{{ food.location }}</p>
                  </div>
                </div>

                <div class="flex items-center">
                  <User class="h-5 w-5 text-gray-500 mr-2" />
                  <div>
                    <p class="text-sm text-gray-500">分享者</p>
                    <p class="font-medium">{{ creatorName }}</p>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="activeTab === 'location'" class="space-y-4">
              <div class="mb-4">
                <h2 class="text-lg font-semibold mb-2">位置</h2>
                <p class="text-gray-700">{{ food.location }}</p>
              </div>

              <div
                class="h-[300px] relative rounded-lg overflow-hidden border border-gray-300"
              >
                <div id="foodLocationMap" class="h-full w-full"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- 相似食物 -->
        <div class="mt-8">
          <h2 class="text-2xl font-bold mb-4">相似食物</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <NuxtLink
              v-for="similarFood in similarFoods"
              :key="similarFood.food_id"
              :to="`/foods/${similarFood.food_id}`"
              class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div class="relative h-40">
                <img
                  :src="formatImageUrl(similarFood.image_url)"
                  :alt="similarFood.title"
                  class="w-full h-full object-cover"
                />
                <span
                  class="absolute top-2 right-2 px-2 py-1 text-xs rounded-full"
                  :class="getStatusClass(similarFood.status)"
                >
                  {{ getStatusText(similarFood.status) }}
                </span>
              </div>
              <div class="p-4">
                <h3 class="font-semibold mb-1 truncate">
                  {{ similarFood.title }}
                </h3>
                <p class="text-sm text-gray-600 line-clamp-2">
                  {{ similarFood.description }}
                </p>
                <div
                  class="flex items-center justify-between mt-2 text-xs text-gray-500"
                >
                  <div class="flex items-center">
                    <MapPin class="h-3 w-3 mr-1" />
                    <span>{{ similarFood.location }}</span>
                  </div>
                  <div class="flex items-center">
                    <Utensils class="h-3 w-3 mr-1" />
                    <span>{{ similarFood.quantity }}份</span>
                  </div>
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
              <p class="text-sm text-gray-500">食物分享者</p>
            </div>
          </div>

          <!-- 顯示私訊狀態 -->
          <div class="mb-4">
            <p
              class="text-xs mt-2"
              :class="food.allow_message ? 'text-emerald-600' : 'text-red-600'"
            >
              <span v-if="food.allow_message" class="flex items-center">
                <MessageSquareText class="h-3 w-3 mr-1" />
                允許私訊
              </span>
              <span v-else class="flex items-center">
                <MessageSquareOff class="h-3 w-3 mr-1" />
                不允許私訊
              </span>
            </p>
          </div>

          <!-- 發送訊息 (根據 allow_message 顯示不同內容) -->
          <div v-if="food.allow_message" class="space-y-3">
            <textarea
              v-model="message"
              placeholder="輸入訊息..."
              class="w-full border border-gray-300 rounded-md px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500"
              rows="3"
              :disabled="food.status !== 'active'"
              :class="{ 'bg-gray-100': food.status !== 'active' }"
            ></textarea>
            <button
              @click="handleSendMessage"
              :disabled="
                isSending || !message.trim() || food.status !== 'active'
              "
              class="w-full px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div v-if="isSending" class="flex items-center justify-center">
                <Loader2 class="mr-2 h-4 w-4 animate-spin" />
                發送中...
              </div>
              <div
                v-else-if="food.status !== 'active'"
                class="flex items-center justify-center"
              >
                <XCircle class="mr-2 h-4 w-4" />
                {{ getDisabledMessageText(food.status) }}
              </div>
              <div v-else class="flex items-center justify-center">
                <MessageCircle class="mr-2 h-4 w-4" />
                發送訊息
              </div>
            </button>
          </div>
        </div>

        <!-- 預約表單 -->
        <div
          v-if="food.status === 'active' && food.pickup_method === 'reserve'"
          class="bg-white rounded-lg shadow-md p-6"
        >
          <h2 class="text-xl font-semibold mb-4">預約食物</h2>
          <div class="space-y-4">
            <div>
              <label for="quantity" class="block text-sm font-medium mb-2"
                >預約份數</label
              >
              <div class="flex items-center">
                <button
                  @click="reservationQuantity > 1 && reservationQuantity--"
                  class="px-3 py-1 border border-gray-300 rounded-l-md bg-gray-50"
                  :disabled="isReserving"
                >
                  <Minus class="h-4 w-4" />
                </button>
                <input
                  type="number"
                  id="quantity"
                  v-model="reservationQuantity"
                  min="1"
                  :max="food.quantity - reservedQuantity"
                  class="w-20 px-3 py-2 border-t border-b border-gray-300 text-center"
                  :disabled="isReserving"
                />
                <button
                  @click="
                    reservationQuantity < food.quantity - reservedQuantity &&
                    reservationQuantity++
                  "
                  class="px-3 py-1 border border-gray-300 rounded-r-md bg-gray-50"
                  :disabled="isReserving"
                >
                  <Plus class="h-4 w-4" />
                </button>
                <span class="ml-3 text-sm text-gray-500">
                  可預約 {{ food.quantity - reservedQuantity }} 份
                </span>
              </div>
            </div>

            <button
              @click="handleReservation"
              :disabled="
                isReserving ||
                reservationQuantity < 1 ||
                reservationQuantity > food.quantity - reservedQuantity
              "
              class="w-full px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div v-if="isReserving" class="flex items-center justify-center">
                <Loader2 class="mr-2 h-4 w-4 animate-spin" />
                預約中...
              </div>
              <div v-else class="flex items-center justify-center">
                <CalendarPlus class="mr-2 h-4 w-4" />
                預約食物
              </div>
            </button>
          </div>
        </div>

        <!-- 直接取用提示 -->
        <div
          v-if="food.status === 'active' && food.pickup_method === 'self'"
          class="bg-white rounded-lg shadow-md p-6"
        >
          <h2 class="text-xl font-semibold mb-4">取用方式</h2>
          <div
            class="flex items-center justify-center p-4 bg-amber-50 rounded-lg"
          >
            <div class="flex flex-col items-center">
              <ShoppingBag class="h-10 w-10 text-amber-600 mb-2" />
              <p class="text-center text-amber-700">此食物為自取方式</p>
              <p class="text-center text-sm text-amber-600 mt-2">
                請前往指定地點自行取用
              </p>
              <button
                v-if="authStore.isAuthenticated"
                @click="handleSelfPickup"
                :disabled="isSelfPickingUp"
                class="mt-4 px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div
                  v-if="isSelfPickingUp"
                  class="flex items-center justify-center"
                >
                  <Loader2 class="mr-2 h-4 w-4 animate-spin" />
                  處理中...
                </div>
                <div v-else class="flex items-center justify-center">
                  <ShoppingBag class="mr-2 h-4 w-4" />
                  標記已拿走
                </div>
              </button>
            </div>
          </div>
        </div>

        <!-- 操作按鈕 -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold mb-4">操作</h2>

          <div class="space-y-3">
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
            請確保食物安全可食用，如有異味或變質情況請勿食用。食物過敏者請注意成分標示。
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, onUnmounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useHead } from "#imports";
import { useAuthStore } from "~/stores/auth";
import Swal from "sweetalert2";
import {
  MapPin,
  AlarmClock,
  Utensils,
  User,
  MessageCircle,
  Share2,
  Flag,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Loader2,
  MessageSquareText,
  MessageSquareOff,
  XCircle,
  Tag,
  ShoppingBag,
  Minus,
  Plus,
  CalendarPlus,
  Clock,
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
const authStore = useAuthStore();

// 狀態變數
const loading = ref(true);
const food = ref(null);
const activeImageIndex = ref(0);
const activeTab = ref("details");
const message = ref("");
const isSending = ref(false);
const isReporting = ref(false);
const isReserving = ref(false);
const isSelfPickingUp = ref(false); // 新增：標記自取食物已被拿走的狀態
const reservationQuantity = ref(1);
const reservedQuantity = ref(0);
const mapInitialized = ref(false);
let foodMap = null;
let foodMarker = null; // 添加標記變數以便於管理

// 相似食物數據
const similarFoods = ref([]);

// 計算屬性
const images = computed(() => {
  if (!food.value || !food.value.image_url) return [];
  return Array.isArray(food.value.image_url)
    ? food.value.image_url
    : [food.value.image_url];
});

const creatorName = computed(() => {
  return food.value?.sharer?.nickname || "匿名用戶";
});

const creatorAvatar = computed(() => {
  if (!food.value?.sharer?.avatar_url) return "";
  return formatImageUrl(food.value.sharer.avatar_url);
});

// 格式化圖片 URL
const formatImageUrl = (url) => {
  if (!url) return "";

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

// 格式化日期和時間
const formatDateTime = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return (
    date.toLocaleDateString("zh-TW") +
    " " +
    date.toLocaleTimeString("zh-TW", {
      hour: "2-digit",
      minute: "2-digit",
    })
  );
};

// 從 API 獲取食物數據
const fetchFoodData = async () => {
  loading.value = true;
  try {
    const response = await fetch(
      `${config.public.BACKEND_BASE_URL}/foods/${id}`
    );
    const data = await response.json();

    if (data.success && data.data) {
      food.value = data.data;
      // 計算已預約的份數
      fetchReservations();
      // 獲取相似食物
      fetchSimilarFoods();
      console.log("獲取食物詳情成功:", food.value);
    } else {
      console.error("獲取食物詳情失敗:", data.message);
      food.value = null;
    }
  } catch (error) {
    console.error("API請求失敗:", error);
    food.value = null;
  } finally {
    loading.value = false;
  }
};

// 獲取相似食物
const fetchSimilarFoods = async () => {
  try {
    const response = await fetch(
      `${config.public.BACKEND_BASE_URL}/foods/${id}/similar`
    );
    const data = await response.json();

    if (data.success && data.data) {
      similarFoods.value = data.data;
      console.log("獲取相似食物成功:", similarFoods.value);
    } else {
      console.error("獲取相似食物失敗:", data.message);
      similarFoods.value = [];
    }
  } catch (error) {
    console.error("API請求失敗:", error);
    similarFoods.value = [];
  }
};

// 獲取食物的預約記錄以計算剩餘份數
const fetchReservations = async () => {
  try {
    // 判斷用戶是否登入並是否為食物創建者
    const authStore = useAuthStore();
    const isCreator =
      food.value &&
      authStore.user &&
      food.value.created_by === authStore.user.user_id;

    let response;
    if (authStore.isLoggedIn && isCreator) {
      // 如果是登入用戶且為創建者，使用原有API獲取詳細的預約資訊
      response = await fetch(
        `${config.public.BACKEND_BASE_URL}/foods/${id}/reservations`,
        {
          headers: {
            Authorization: `Bearer ${authStore.token}`,
          },
        }
      );
    } else {
      // 如果是未登入用戶或非創建者，使用公開API只獲取預約總數
      response = await fetch(
        `${config.public.BACKEND_BASE_URL}/foods/${id}/public-info`
      );
    }

    const data = await response.json();

    if (data.success) {
      if (authStore.isLoggedIn && isCreator) {
        // 計算已預約的總份數
        reservedQuantity.value = data.data.reduce((total, reservation) => {
          // 只計算已接受或待處理的預約
          if (
            reservation.status === "accepted" ||
            reservation.status === "pending"
          ) {
            return total + reservation.quantity;
          }
          return total;
        }, 0);
      } else {
        // 直接使用公開API返回的預約總數
        reservedQuantity.value = data.data.reservedQuantity;
      }
    } else {
      console.error("獲取預約資訊失敗:", data.message);
      reservedQuantity.value = 0;
    }
  } catch (error) {
    console.error("API請求失敗:", error);
    reservedQuantity.value = 0;
  }
};

onMounted(() => {
  if (route.params.id) {
    fetchFoodData();
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
const handleSendMessage = async () => {
  if (!authStore.isAuthenticated) {
    Swal.fire({
      icon: "warning",
      title: "需要登入",
      text: "您需要先登入才能發送訊息",
      confirmButtonColor: "#10b981",
    });
    router.push("/login");
    return;
  }

  if (!message.value.trim()) {
    Swal.fire({
      icon: "warning",
      title: "訊息不能為空",
      text: "請輸入訊息內容",
      confirmButtonColor: "#10b981",
    });
    return;
  }

  isSending.value = true;

  try {
    // 獲取認證 token
    const authCookie = useCookie("auth_token");

    // 使用 chat 路由直接發送私人消息到 MongoDB
    const messageResponse = await fetch(
      `${config.public.BACKEND_BASE_URL}/chat/private/${food.value.created_by}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authCookie.value}`,
        },
        body: JSON.stringify({
          content: message.value.trim(),
        }),
      }
    );

    if (!messageResponse.ok) {
      const errorData = await messageResponse.json();
      throw new Error(errorData.message || "發送訊息失敗");
    }

    const messageData = await messageResponse.json();

    if (!messageData.success) {
      throw new Error(messageData.message || "發送訊息失敗");
    }

    // 清空訊息輸入框
    message.value = "";

    // 顯示成功訊息
    Swal.fire({
      icon: "success",
      title: "發送成功",
      text: "訊息已成功發送",
      confirmButtonColor: "#10b981",
    });

    // 跳轉到聊天頁面
    router.push({
      path: "/message",
    });
  } catch (error) {
    console.error("發送訊息失敗:", error);
    Swal.fire({
      icon: "error",
      title: "發送失敗",
      text: `發送訊息失敗: ${error.message}`,
      confirmButtonColor: "#10b981",
    });
  } finally {
    isSending.value = false;
  }
};

// 舉報食物
const handleReport = () => {
  isReporting.value = true;
  // 模擬 API 請求
  setTimeout(() => {
    isReporting.value = false;
    Swal.fire({
      icon: "success",
      title: "舉報已提交",
      text: "我們會盡快審核",
      confirmButtonColor: "#10b981",
    });
  }, 1000);
};

// 分享食物
const handleShare = () => {
  if (navigator.share) {
    navigator.share({
      title: `LOFO - ${food.value.title}`,
      text: `查看 LOFO 平台上的食物分享：${food.value.title}，還剩 ${food.value.quantity - reservedQuantity.value} 份`,
      url: window.location.href,
    });
  } else {
    // 如果瀏覽器不支持原生分享 API，則複製連結
    navigator.clipboard.writeText(window.location.href);
    Swal.fire({
      icon: "success",
      title: "連結已複製",
      text: "連結已複製到剪貼簿！",
      confirmButtonColor: "#10b981",
    });
  }
};

// 處理預約
const handleReservation = async () => {
  if (
    reservationQuantity.value <= 0 ||
    reservationQuantity.value > food.value.quantity - reservedQuantity.value
  ) {
    Swal.fire({
      icon: "warning",
      title: "無效的份數",
      text: "請輸入有效的預約份數",
      confirmButtonColor: "#10b981",
    });
    return;
  }

  isReserving.value = true;

  try {
    // 獲取認證 token
    const authCookie = useCookie("auth_token");

    // 發送預約請求
    const response = await fetch(
      `${config.public.BACKEND_BASE_URL}/foods/${id}/reserve`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authCookie.value}`,
        },
        body: JSON.stringify({
          quantity: reservationQuantity.value,
        }),
      }
    );
    const data = await response.json();

    if (data.success) {
      Swal.fire({
        icon: "success",
        title: "預約成功",
        text: "預約成功！請等待食物分享者的確認。",
        confirmButtonColor: "#10b981",
      });
      // 更新預約狀態和數量
      fetchReservations();
      // 如果需要的話也可以重新獲取食物信息
      // fetchFoodData();
    } else {
      Swal.fire({
        icon: "error",
        title: "預約失敗",
        text: `預約失敗: ${data.message}`,
        confirmButtonColor: "#10b981",
      });
    }
  } catch (error) {
    console.error("預約食物時發生錯誤:", error);
    Swal.fire({
      icon: "error",
      title: "預約失敗",
      text: "預約食物時發生錯誤，請稍後再試。",
      confirmButtonColor: "#10b981",
    });
  } finally {
    isReserving.value = false;
  }
};

// 處理標記自取食物已被拿走
const handleSelfPickup = async () => {
  if (!authStore.isAuthenticated) {
    Swal.fire({
      icon: "warning",
      title: "需要登入",
      text: "您需要先登入才能標記食物為已拿走",
      confirmButtonColor: "#10b981",
    });
    router.push("/login");
    return;
  }

  // 確認用戶意圖
  const result = await Swal.fire({
    icon: "question",
    title: "確認操作",
    text: "您確定已經拿走這個食物了嗎？這將更新食物狀態，其他用戶將不再能看到此食物。",
    showCancelButton: true,
    confirmButtonText: "確認已拿走",
    cancelButtonText: "取消",
    confirmButtonColor: "#10b981",
  });

  if (!result.isConfirmed) return;

  isSelfPickingUp.value = true;

  try {
    // 獲取認證 token
    const authCookie = useCookie("auth_token");

    // 發送請求
    const response = await fetch(
      `${config.public.BACKEND_BASE_URL}/foods/${id}/self-pickup`,
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
      Swal.fire({
        icon: "success",
        title: "操作成功",
        text: "已成功標記食物為已拿走",
        confirmButtonColor: "#10b981",
      });
      // 重新獲取食物資訊以更新顯示
      fetchFoodData();
    } else {
      Swal.fire({
        icon: "error",
        title: "操作失敗",
        text: `標記食物失敗: ${data.message}`,
        confirmButtonColor: "#10b981",
      });
    }
  } catch (error) {
    console.error("標記食物已拿走時發生錯誤:", error);
    Swal.fire({
      icon: "error",
      title: "操作失敗",
      text: "標記食物已拿走時發生錯誤，請稍後再試。",
      confirmButtonColor: "#10b981",
    });
  } finally {
    isSelfPickingUp.value = false;
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
  if (!process.client || !window.L || !food.value) return;

  try {
    const latitude = parseFloat(food.value.latitude);
    const longitude = parseFloat(food.value.longitude);

    if (isNaN(latitude) || isNaN(longitude)) {
      console.warn("食物沒有有效的坐標數據");
      return;
    }

    // 獲取地圖容器
    const mapContainer = document.getElementById("foodLocationMap");
    if (!mapContainer) {
      console.warn("找不到地圖容器元素");
      return;
    }

    // 如果地圖已經被初始化，先銷毀它
    if (foodMap) {
      foodMap.remove();
      foodMap = null;
      mapInitialized.value = false;
    }

    // 初始化地圖
    foodMap = window.L.map("foodLocationMap", {
      maxBoundsViscosity: 1.0,
      minZoom: 15,
      zoomSnap: 0.1,
    }).setView([latitude, longitude], 16.2);

    // 加入圖層
    window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap 貢獻者",
    }).addTo(foodMap);

    // 創建綠色圖標
    const greenIcon = window.L.icon({
      iconUrl:
        "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
      shadowUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    // 添加標記
    foodMarker = window.L.marker([latitude, longitude], {
      icon: greenIcon,
    }).addTo(foodMap);

    // 添加彈出視窗
    const popupContent = `
      <div class="food-popup">
        <h3 class="font-semibold text-sm">${food.value.title}</h3>
        ${food.value.image_url ? `<img src="${formatImageUrl(food.value.image_url)}" alt="${food.value.title}" style="width: 100%; height: auto; max-height: 80px; object-fit: contain; border-radius: 4px; margin: 4px 0;" />` : ""}
        <div class="mt-1">
          <span class="inline-block px-2 py-0.5 text-xs font-semibold rounded-full ${food.value.status === "active" ? "bg-emerald-100 text-emerald-800" : "bg-blue-100 text-blue-800"}">
            ${food.value.status === "active" ? "可預約" : "已預約"}
          </span>
        </div>
        <p class="text-xs mt-1 mb-0"><strong>地點:</strong> ${food.value.location}</p>
        <p class="text-xs mt-0.5 mb-1"><strong>份數:</strong> ${food.value.quantity}份</p>
      </div>
    `;

    // 綁定彈出視窗 - 使用小尺寸選項但不自動打開
    const popupOptions = {
      maxWidth: 180,
      className: "custom-popup",
      offset: [0, -10],
    };

    foodMarker.bindPopup(popupContent, popupOptions);

    // 設置標誌，表示地圖已初始化
    mapInitialized.value = true;

    // 確保地圖尺寸正確
    setTimeout(() => {
      foodMap.invalidateSize();
    }, 100);
  } catch (error) {
    console.error("初始化地圖時發生錯誤:", error);
  }
};

onUnmounted(() => {
  if (foodMap) {
    foodMap.remove();
    foodMap = null;
  }
});

// 獲取狀態的顯示文字
const getStatusText = (status) => {
  switch (status) {
    case "active":
      return "可用";
    case "claimed":
      return "已被取用";
    case "expired":
      return "已過期";
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
    case "expired":
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
      return "食物已被取用";
    case "expired":
      return "食物已過期";
    case "withdrawn":
      return "食物已撤回";
    default:
      return "無法操作";
  }
};
</script>
