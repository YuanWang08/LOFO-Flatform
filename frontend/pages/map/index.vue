<template>
  <div class="map-container">
    <div id="map" class="h-map w-full"></div>

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
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useHead, useRuntimeConfig } from "#imports";

const config = useRuntimeConfig();

// 物品資料和彈出視窗狀態
const items = ref([]);
const selectedItem = ref({});
const showDetailModal = ref(false);

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

// 關閉詳細資訊彈出視窗
const closeModal = () => {
  showDetailModal.value = false;
};

// 獲取物品列表
const fetchItems = async () => {
  try {
    // 添加查詢參數，只請求狀態為"active"的物品
    const response = await fetch(
      `${config.public.BACKEND_BASE_URL}/items?status=active`
    );
    const data = await response.json();

    if (data.success && data.data) {
      items.value = data.data;
      console.log("獲取活躍物品列表成功:", items.value);

      // 如果地圖已經初始化，則更新標記
      if (map && window.L) {
        updateMapMarkers();
      }
    }
  } catch (error) {
    console.error("獲取物品列表失敗:", error);
  }
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

onMounted(() => {
  // 獲取物品列表
  fetchItems();

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
