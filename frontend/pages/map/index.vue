<template>
  <div class="map-container">
    <div id="map" class="h-map w-full"></div>

    <!-- 篩選按鈕 -->
    <div
      v-if="!showFilterPanel"
      class="filter-button"
      @click="toggleFilterPanel"
    >
      <Search size="18" />
    </div>

    <!-- 篩選面板 -->
    <div
      v-if="showFilterPanel"
      class="filter-panel bg-white p-4 rounded-lg shadow-lg"
    >
      <div class="flex justify-between items-center mb-3">
        <h3 class="font-medium text-gray-700">篩選選項</h3>
        <button
          @click="toggleFilterPanel"
          class="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
        >
          <X size="18" />
        </button>
      </div>

      <div class="mb-3">
        <h3 class="font-medium text-gray-700 mb-2">資料類型</h3>
        <div class="flex items-center gap-3">
          <label class="flex items-center cursor-pointer">
            <input
              type="checkbox"
              v-model="filters.showItems"
              class="h-4 w-4 text-red-600 focus:ring-red-500 rounded"
            />
            <span class="ml-2 flex items-center">
              <span
                class="inline-block w-3 h-3 bg-red-500 rounded-full mr-1"
              ></span>
              遺失物
            </span>
          </label>
          <label class="flex items-center cursor-pointer">
            <input
              type="checkbox"
              v-model="filters.showFoods"
              class="h-4 w-4 text-green-600 focus:ring-green-500 rounded"
            />
            <span class="ml-2 flex items-center">
              <span
                class="inline-block w-3 h-3 bg-green-500 rounded-full mr-1"
              ></span>
              食物分享
            </span>
          </label>
        </div>
      </div>

      <div>
        <h3 class="font-medium text-gray-700 mb-2">狀態篩選</h3>
        <div class="space-y-2">
          <label class="flex items-center cursor-pointer">
            <input
              type="checkbox"
              v-model="filters.showActive"
              class="h-4 w-4 text-emerald-600 focus:ring-emerald-500 rounded"
            />
            <span class="ml-2 flex items-center">
              <span
                class="inline-block w-2 h-2 bg-emerald-500 rounded-full mr-1"
              ></span>
              活躍 (可領取/預約)
            </span>
          </label>
          <label class="flex items-center cursor-pointer">
            <input
              type="checkbox"
              v-model="filters.showClaimed"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 rounded"
            />
            <span class="ml-2 flex items-center">
              <span
                class="inline-block w-2 h-2 bg-blue-500 rounded-full mr-1"
              ></span>
              已領取/預約
            </span>
          </label>
          <label class="flex items-center cursor-pointer">
            <input
              type="checkbox"
              v-model="filters.showExpired"
              class="h-4 w-4 text-gray-600 focus:ring-gray-500 rounded"
            />
            <span class="ml-2 flex items-center">
              <span
                class="inline-block w-2 h-2 bg-gray-500 rounded-full mr-1"
              ></span>
              已結束/過期
            </span>
          </label>
          <label class="flex items-center cursor-pointer">
            <input
              type="checkbox"
              v-model="filters.showWithdrawn"
              class="h-4 w-4 text-red-600 focus:ring-red-500 rounded"
            />
            <span class="ml-2 flex items-center">
              <span
                class="inline-block w-2 h-2 bg-red-500 rounded-full mr-1"
              ></span>
              已撤回
            </span>
          </label>
        </div>
      </div>

      <button
        @click="applyFilters"
        class="mt-4 w-full bg-emerald-600 text-white py-1.5 px-3 rounded hover:bg-emerald-700 transition-colors text-sm"
      >
        套用篩選
      </button>
    </div>

    <!-- 詳細資訊彈出視窗 -->
    <div
      v-if="showDetailModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div
        class="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
      >
        <div class="p-5">
          <div class="flex justify-between items-start">
            <h2 class="text-xl font-bold">{{ selectedItem.title }}</h2>
            <button
              @click="closeModal"
              class="text-gray-500 hover:text-gray-700"
            >
              <svg
                class="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>

          <div class="mt-4">
            <!-- 修改圖片顯示方式，確保完整顯示不裁切 -->
            <div v-if="selectedItem.image_url" class="flex justify-center">
              <img
                :src="getFullImageUrl(selectedItem.image_url)"
                :alt="selectedItem.title"
                class="rounded-lg object-contain max-h-64 max-w-full"
                style="margin: 0 auto"
              />
            </div>

            <div class="mt-4 space-y-3">
              <div class="flex items-center">
                <span
                  class="text-sm font-semibold"
                  :class="{
                    'text-emerald-600': selectedItem.status === 'active',
                    'text-blue-600': selectedItem.status === 'claimed',
                    'text-gray-600': selectedItem.status === 'closed',
                    'text-red-600': selectedItem.status === 'withdrawn',
                  }"
                >
                  {{ getStatusText(selectedItem.status) }}
                </span>
                <span class="text-sm text-gray-600 ml-2"
                  >瀏覽次數: {{ selectedItem.view_count }}</span
                >
              </div>

              <div class="grid grid-cols-3 gap-3 mt-3">
                <div class="col-span-1 text-gray-600">類別</div>
                <div class="col-span-2">{{ selectedItem.category }}</div>

                <div class="col-span-1 text-gray-600">地點</div>
                <div class="col-span-2">{{ selectedItem.location }}</div>

                <div class="col-span-1 text-gray-600">時間</div>
                <div class="col-span-2">
                  {{ formatDate(selectedItem.discover_time) }}
                </div>

                <div class="col-span-1 text-gray-600">物品位置</div>
                <div class="col-span-2">
                  {{
                    selectedItem.is_with_owner ? "由發布者保管中" : "留在原處"
                  }}
                </div>

                <div class="col-span-1 text-gray-600">私訊狀態</div>
                <div class="col-span-2">
                  {{ selectedItem.allow_message ? "可傳送私訊" : "不接受私訊" }}
                </div>

                <div class="col-span-1 text-gray-600">聯絡方式</div>
                <div class="col-span-2">{{ selectedItem.contact }}</div>
              </div>

              <div class="mt-3">
                <div class="text-gray-600">關鍵字</div>
                <div class="flex flex-wrap gap-2 mt-1">
                  <span
                    v-for="(keyword, index) in selectedItem.keywords"
                    :key="index"
                    class="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full"
                  >
                    {{ keyword }}
                  </span>
                </div>
              </div>

              <div class="mt-3">
                <div class="text-gray-600">描述</div>
                <p class="mt-1 text-sm">{{ selectedItem.description }}</p>
              </div>
            </div>
          </div>

          <div class="mt-6 flex justify-center">
            <NuxtLink
              :to="`/items/${selectedItem.item_id}`"
              class="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700 transition-colors"
            >
              前往物品頁面
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- 食物詳細資訊彈出視窗 -->
    <div
      v-if="showFoodDetailModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div
        class="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
      >
        <div class="p-5">
          <div class="flex justify-between items-start">
            <h2 class="text-xl font-bold">{{ selectedFood.title }}</h2>
            <button
              @click="closeFoodModal"
              class="text-gray-500 hover:text-gray-700"
            >
              <svg
                class="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>

          <div class="mt-4">
            <!-- 食物圖片 -->
            <div v-if="selectedFood.image_url" class="flex justify-center">
              <img
                :src="getFullImageUrl(selectedFood.image_url)"
                :alt="selectedFood.title"
                class="rounded-lg object-contain max-h-64 max-w-full"
                style="margin: 0 auto"
              />
            </div>

            <div class="mt-4 space-y-3">
              <div class="flex items-center">
                <span
                  class="text-sm font-semibold"
                  :class="{
                    'text-emerald-600': selectedFood.status === 'active',
                    'text-blue-600': selectedFood.status === 'claimed',
                    'text-gray-600': selectedFood.status === 'expired',
                    'text-red-600': selectedFood.status === 'withdrawn',
                  }"
                >
                  {{ getFoodStatusText(selectedFood.status) }}
                </span>
                <span class="text-sm text-gray-600 ml-2"
                  >瀏覽次數: {{ selectedFood.view_count }}</span
                >
              </div>

              <div class="grid grid-cols-3 gap-3 mt-3">
                <div class="col-span-1 text-gray-600">類別</div>
                <div class="col-span-2">{{ selectedFood.category }}</div>

                <div class="col-span-1 text-gray-600">地點</div>
                <div class="col-span-2">{{ selectedFood.location }}</div>

                <div class="col-span-1 text-gray-600">份數</div>
                <div class="col-span-2">{{ selectedFood.quantity }} 份</div>

                <div class="col-span-1 text-gray-600">有效期限</div>
                <div class="col-span-2">
                  {{ formatDate(selectedFood.expire_date) }}
                </div>

                <div class="col-span-1 text-gray-600">取用方式</div>
                <div class="col-span-2">
                  {{ selectedFood.pickup_method === "self" ? "自取" : "預約" }}
                </div>

                <div class="col-span-1 text-gray-600">私訊狀態</div>
                <div class="col-span-2">
                  {{ selectedFood.allow_message ? "可傳送私訊" : "不接受私訊" }}
                </div>
              </div>

              <div class="mt-3">
                <div class="text-gray-600">描述</div>
                <p class="mt-1 text-sm">{{ selectedFood.description }}</p>
              </div>
            </div>
          </div>

          <div class="mt-6 flex justify-center">
            <NuxtLink
              :to="`/foods/${selectedFood.food_id}`"
              class="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700 transition-colors"
            >
              前往食物頁面
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from "vue";
import { useHead, useRuntimeConfig } from "#imports";
import { Search, X } from "lucide-vue-next";

const config = useRuntimeConfig();

// 篩選條件
const filters = ref({
  showItems: true,
  showFoods: true,
  showActive: true,
  showClaimed: false,
  showExpired: false,
  showWithdrawn: false,
});

// 篩選面板狀態
const showFilterPanel = ref(false);

// 物品資料和彈出視窗狀態
const items = ref([]);
const selectedItem = ref({});
const showDetailModal = ref(false);

// 食物資料和彈出視窗狀態
const foods = ref([]);
const selectedFood = ref({});
const showFoodDetailModal = ref(false);

// 使用 useHead 動態添加 Leaflet CSS 和 JS
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

let map;
let markers = [];

// 格式化日期
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
};

// 獲取完整的圖片URL
const getFullImageUrl = (imagePath) => {
  if (imagePath.startsWith("http")) {
    return imagePath;
  }
  return `${config.public.BACKEND_BASE_URL}${imagePath}`;
};

// 獲取狀態文字
const getStatusText = (status) => {
  switch (status) {
    case "active":
      return "等待拾獲中";
    case "claimed":
      return "已領取";
    case "closed":
      return "已結束";
    case "withdrawn":
      return "已撤回";
    default:
      return "未知狀態";
  }
};

// 獲取食物狀態文字
const getFoodStatusText = (status) => {
  switch (status) {
    case "active":
      return "可預約";
    case "claimed":
      return "已預約";
    case "expired":
      return "已過期";
    case "withdrawn":
      return "已撤回";
    default:
      return "未知狀態";
  }
};

// 關閉詳細資訊彈出視窗
const closeModal = () => {
  showDetailModal.value = false;
};

// 關閉食物詳細資訊彈出視窗
const closeFoodModal = () => {
  showFoodDetailModal.value = false;
};

// 切換篩選面板
const toggleFilterPanel = () => {
  showFilterPanel.value = !showFilterPanel.value;
};

// 獲取物品列表
const fetchItems = async () => {
  try {
    // 根據篩選條件建立狀態字符串
    const statusParams = [];

    if (filters.value.showActive) statusParams.push("active");
    if (filters.value.showClaimed) statusParams.push("claimed");
    if (filters.value.showExpired) statusParams.push("closed"); // 物品中的過期狀態是 "closed"
    if (filters.value.showWithdrawn) statusParams.push("withdrawn");

    // 如果沒有選擇任何狀態，則不獲取任何資料
    if (statusParams.length === 0) {
      items.value = [];
      return;
    }

    // 將狀態數組轉換為URL查詢參數
    const statusQuery = statusParams
      .map((status) => `status=${status}`)
      .join("&");

    // 發送請求
    const response = await fetch(
      `${config.public.BACKEND_BASE_URL}/items?${statusQuery}`
    );
    const data = await response.json();

    if (data.success && data.data) {
      items.value = data.data;
      console.log("獲取物品列表成功:", items.value);

      // 如果地圖已經初始化，則更新標記
      if (map && window.L && filters.value.showItems) {
        updateMapMarkers();
      }
    }
  } catch (error) {
    console.error("獲取物品列表失敗:", error);
  }
};

// 獲取食物列表
const fetchFoods = async () => {
  try {
    // 根據篩選條件建立狀態字符串
    const statusParams = [];

    if (filters.value.showActive) statusParams.push("active");
    if (filters.value.showClaimed) statusParams.push("claimed");
    if (filters.value.showExpired) statusParams.push("expired"); // 食物中的過期狀態是 "expired"
    if (filters.value.showWithdrawn) statusParams.push("withdrawn");

    // 如果沒有選擇任何狀態，則不獲取任何資料
    if (statusParams.length === 0) {
      foods.value = [];
      return;
    }

    // 將狀態數組轉換為URL查詢參數
    const statusQuery = statusParams
      .map((status) => `status=${status}`)
      .join("&");

    // 發送請求
    const response = await fetch(
      `${config.public.BACKEND_BASE_URL}/foods?${statusQuery}`
    );
    const data = await response.json();

    if (data.success && data.data) {
      foods.value = data.data;
      console.log("獲取食物列表成功:", foods.value);

      // 如果地圖已經初始化，則更新食物標記
      if (map && window.L && filters.value.showFoods) {
        updateFoodMarkers();
      }
    }
  } catch (error) {
    console.error("獲取食物列表失敗:", error);
  }
};

// 顯示食物詳情
const showFoodDetail = (food) => {
  selectedFood.value = food;
  showFoodDetailModal.value = true;
};

// 顯示物品詳情
const showItemDetail = (item) => {
  selectedItem.value = item;
  showDetailModal.value = true;
};

// 更新地圖上的物品標記
const updateMapMarkers = () => {
  // 清除現有的標記
  markers.forEach((marker) => map.removeLayer(marker));
  markers = [];

  // 創建紅色圖標
  const redIcon = window.L.icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  // 為每個物品創建標記
  items.value.forEach((item) => {
    // 檢查物品是否有有效的坐標
    if (item.latitude && item.longitude) {
      // 創建標記
      const marker = window.L.marker([item.latitude, item.longitude], {
        icon: redIcon,
      }).addTo(map);

      // 簡易資訊彈出窗口 - 調整大小和間距更緊湊
      const popupContent = `
        <div class="item-popup">
          <h3 class="font-semibold text-sm">${item.title}</h3>
          ${item.image_url ? `<img src="${getFullImageUrl(item.image_url)}" alt="${item.title}" style="width: 100%; height: auto; max-height: 80px; object-fit: contain; border-radius: 4px; margin: 4px 0;" />` : ""}
          <div class="mt-1">
            <span class="inline-block px-2 py-0.5 text-xs font-semibold rounded-full ${item.status === "active" ? "bg-emerald-100 text-emerald-800" : item.status === "claimed" ? "bg-blue-100 text-blue-800" : item.status === "closed" ? "bg-gray-100 text-gray-800" : "bg-red-100 text-red-800"}">
              ${getStatusText(item.status)}
            </span>
          </div>
          <p class="text-xs mt-1 mb-0"><strong>地點:</strong> ${item.location}</p>
          <p class="text-xs mt-0.5 mb-1"><strong>時間:</strong> ${formatDate(item.discover_time)}</p>
          <button 
            id="detail-btn-${item.item_id}" 
            class="mt-1 bg-emerald-600 text-white text-xs py-1 px-2 rounded hover:bg-emerald-700 w-full"
            style="cursor: pointer;"
          >
            查看詳情
          </button>
        </div>
      `;

      // 綁定彈出視窗 - 使用小尺寸選項避免太大
      const popupOptions = {
        maxWidth: 180,
        className: "custom-popup",
        offset: [0, -10], // 向上偏移避免被導航欄遮擋
      };

      marker.bindPopup(popupContent, popupOptions);

      // 將標記添加到數組中以便後續管理
      markers.push(marker);

      // 標記打開時添加事件監聽器到"查看詳情"按鈕
      marker.on("popupopen", () => {
        setTimeout(() => {
          const detailBtn = document.getElementById(
            `detail-btn-${item.item_id}`
          );
          if (detailBtn) {
            detailBtn.addEventListener("click", () => {
              showItemDetail(item);
              marker.closePopup();
            });
          }
        }, 100);
      });
    }
  });
};

// 更新地圖上的食物標記
const updateFoodMarkers = () => {
  // 不需要清除原有標記，只添加食物標記

  // 創建綠色圖標
  const greenIcon = window.L.icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  // 為每個食物創建標記
  foods.value.forEach((food) => {
    // 檢查食物是否有有效的坐標
    if (food.latitude && food.longitude) {
      // 創建標記
      const marker = window.L.marker([food.latitude, food.longitude], {
        icon: greenIcon,
      }).addTo(map);

      // 簡易資訊彈出窗口
      const popupContent = `
        <div class="item-popup">
          <h3 class="font-semibold text-sm">${food.title}</h3>
          ${food.image_url ? `<img src="${getFullImageUrl(food.image_url)}" alt="${food.title}" style="width: 100%; height: auto; max-height: 80px; object-fit: contain; border-radius: 4px; margin: 4px 0;" />` : ""}
          <div class="mt-1">
            <span class="inline-block px-2 py-0.5 text-xs font-semibold rounded-full ${food.status === "active" ? "bg-emerald-100 text-emerald-800" : food.status === "claimed" ? "bg-blue-100 text-blue-800" : food.status === "expired" ? "bg-gray-100 text-gray-800" : "bg-red-100 text-red-800"}">
              ${getFoodStatusText(food.status)}
            </span>
          </div>
          <p class="text-xs mt-1 mb-0"><strong>類別:</strong> ${food.category}</p>
          <p class="text-xs mt-0.5 mb-0"><strong>份數:</strong> ${food.quantity}</p>
          <p class="text-xs mt-0.5 mb-0"><strong>地點:</strong> ${food.location}</p>
          <p class="text-xs mt-0.5 mb-1"><strong>過期時間:</strong> ${formatDate(food.expire_date)}</p>
          <button 
            id="food-detail-btn-${food.food_id}" 
            class="mt-1 bg-emerald-600 text-white text-xs py-1 px-2 rounded hover:bg-emerald-700 w-full"
            style="cursor: pointer;"
          >
            查看詳情
          </button>
        </div>
      `;

      // 綁定彈出視窗
      const popupOptions = {
        maxWidth: 180,
        className: "custom-popup",
        offset: [0, -10],
      };

      marker.bindPopup(popupContent, popupOptions);

      // 將標記添加到數組中以便後續管理
      markers.push(marker);

      // 標記打開時添加事件監聽器到"查看詳情"按鈕
      marker.on("popupopen", () => {
        setTimeout(() => {
          const detailBtn = document.getElementById(
            `food-detail-btn-${food.food_id}`
          );
          if (detailBtn) {
            detailBtn.addEventListener("click", () => {
              showFoodDetail(food);
              marker.closePopup();
            });
          }
        }, 100);
      });
    }
  });
};

// 套用篩選條件
const applyFilters = () => {
  // 清除現有的標記
  markers.forEach((marker) => map.removeLayer(marker));
  markers = [];

  // 更新物品標記
  if (filters.value.showItems) {
    fetchItems();
  }

  // 更新食物標記
  if (filters.value.showFoods) {
    fetchFoods();
  }
};

onMounted(() => {
  // 獲取物品列表
  fetchItems();

  // 獲取食物列表
  fetchFoods();

  // 確保在客戶端環境下執行
  if (process.client) {
    // 使用全局的 L 而不是動態引入
    setTimeout(() => {
      // 確保 Leaflet 已載入
      if (window.L) {
        const L = window.L;

        // 初始化地圖
        map = L.map("map", {
          // 暫時解除限制
          // maxBounds: [
          //   [24.963888388433617, 121.18391990661623], // 西南角
          //   [24.9721131183022324, 121.19825363159181], // 東北角
          // ],
          maxBoundsViscosity: 1.0,
          minZoom: 16,
          zoomSnap: 0.1,
        }).setView([24.9678697, 121.1928922], 16.2);

        // 加入圖層
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "© OpenStreetMap 貢獻者",
        }).addTo(map);

        // 如果此時已有物品數據，添加到地圖上
        if (items.value.length > 0) {
          updateMapMarkers();
        }

        // 如果此時已有食物數據，添加到地圖上
        if (foods.value.length > 0) {
          updateFoodMarkers();
        }
      }
    }, 500); // 給一點時間讓 Leaflet 腳本載入
  }
});

// 記得在組件卸載時清理資源
onUnmounted(() => {
  if (map) {
    map.remove();
  }
});
</script>

<style scoped>
.map-container {
  position: relative;
  width: 100%;
  height: calc(100vh - 4rem); /* 4rem 是導航欄的高度 */
  margin-top: 0;
}

/* 確保地圖容器有高度 */
#map {
  height: 100%;
  width: 100%;
  z-index: 1; /* 確保地圖的z-index低於導航欄 */
}

/* 篩選按鈕樣式 */
.filter-button {
  position: absolute;
  bottom: 1rem;
  left: 1rem;
  z-index: 1001;
  background-color: #fff;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition: background-color 0.3s;
}

.filter-button:hover {
  background-color: #f0f0f0;
}

.filter-button.active {
  background-color: #e0e0e0;
}

/* 篩選面板樣式 */
.filter-panel {
  position: absolute;
  bottom: 1rem;
  left: 1rem;
  z-index: 1000;
  width: 300px;
}

/* 彈出視窗樣式 */
:deep(.leaflet-popup-content) {
  min-width: 200px;
  max-width: 250px;
}

:deep(.item-popup h3) {
  font-size: 16px;
  margin-bottom: 1px;
}
</style>
