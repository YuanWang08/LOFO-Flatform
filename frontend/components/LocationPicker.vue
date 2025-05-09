<template>
  <div class="h-[300px] rounded-lg overflow-hidden border border-gray-300">
    <div id="map" style="height: 100%; width: 100%"></div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useHead } from "#imports";

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

const emit = defineEmits(["location-select"]);
const marker = ref(null);
const map = ref(null);

onMounted(() => {
  // 確保在客戶端環境下執行
  if (process.client) {
    // 添加延遲以確保 Leaflet 腳本已載入
    setTimeout(() => {
      if (window.L) {
        const L = window.L;

        // 修復 Leaflet 圖標問題
        const defaultIcon = L.icon({
          iconUrl:
            "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
          shadowUrl:
            "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41],
        });

        L.Marker.prototype.options.icon = defaultIcon;

        // 默認中心是 NCU
        const defaultCenter = [24.968, 121.1874];

        // 初始化地圖
        map.value = L.map("map").setView(defaultCenter, 16);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(map.value);

        // 嘗試獲取用戶位置
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const userLocation = [
                position.coords.latitude,
                position.coords.longitude,
              ];
              map.value.setView(userLocation, 16);
            },
            (error) => {
              console.error("Error getting location:", error);
            }
          );
        }

        // 點擊地圖添加標記
        map.value.on("click", (e) => {
          const newPos = [e.latlng.lat, e.latlng.lng];

          if (marker.value) {
            marker.value.setLatLng(newPos);
          } else {
            marker.value = L.marker(newPos, { draggable: true }).addTo(
              map.value
            );

            // 拖動標記後更新位置
            marker.value.on("dragend", () => {
              const position = marker.value.getLatLng();
              emit("location-select", [position.lat, position.lng]);
            });
          }

          emit("location-select", newPos);
        });
      }
    }, 500); // 給一點時間讓 Leaflet 腳本載入完成
  }
});
</script>
