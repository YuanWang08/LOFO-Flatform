<template>
  <div>
    <div id="map" class="h-screen w-full"></div>
    <button
      id="submitBtn"
      class="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-green-600 text-white py-2 px-6 rounded-lg shadow-lg hover:bg-green-700 z-10"
    >
      提交
    </button>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from "vue";
import "leaflet/dist/leaflet.css";

let map;
let marker;

onMounted(async () => {
  // 確保在客戶端環境下執行
  if (process.client) {
    // 動態引入 Leaflet (避免 SSR 問題)
    const L = await import("leaflet");

    // 初始化地圖
    map = L.map("map", {
      maxBounds: [
        [24.963888388433617, 121.18391990661623], // 西南角
        [24.9721131183022324, 121.19825363159181], // 東北角
      ],
      maxBoundsViscosity: 1.0,
      minZoom: 16,
      zoomSnap: 0.1,
    }).setView([24.9678697, 121.1928922], 16.2);

    // 加入圖層
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap 貢獻者",
    }).addTo(map);

    // 建立可拖曳的浮標
    marker = L.marker([24.9678697, 121.1928922], {
      draggable: true,
    }).addTo(map);

    // 紅色浮標
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

    const fieldMarker = L.marker([24.968267159666738, 121.18993492529135], {
      icon: redIcon,
    }).addTo(map);

    fieldMarker.bindPopup(`
      <b>大操場</b><br>
      <img src="https://img.ltn.com.tw/Upload/news/600/2022/08/10/4020522_1_1.jpg" 
      alt="大操場" width="200" style="margin-top: 5px; border-radius: 8px;" />
    `);

    // 提交按鈕點擊事件
    document.getElementById("submitBtn").addEventListener("click", () => {
      const position = marker.getLatLng();
      alert(`浮標位置：\n緯度：${position.lat}\n經度：${position.lng}`);
      console.log(`浮標位置：\n緯度：${position.lat}\n經度：${position.lng}`);
    });
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
/* 確保地圖容器有高度 */
#map {
  height: 80vh;
  width: 100%;
}

#submitBtn {
  z-index: 1000;
}
</style>
