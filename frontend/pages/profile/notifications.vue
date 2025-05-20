<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-4xl mx-auto">
      <!-- 頁面標題 -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-800">通知設置</h1>
        <p class="text-gray-600 mt-2">設定您希望接收的通知類型和方式</p>
      </div>

      <!-- 通知選項卡片 -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 class="text-xl font-semibold mb-4 text-gray-800">通知渠道</h2>
        <p class="text-gray-600 mb-6">選擇您希望接收通知的方式</p>

        <!-- Email 通知開關 -->
        <div
          class="flex items-center justify-between py-4 border-b border-gray-200"
        >
          <div>
            <h3 class="font-medium text-gray-800">Email 通知</h3>
            <p class="text-gray-500 text-sm mt-1">
              通過電子郵件接收活動和互動通知
            </p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              v-model="emailNotifications"
              class="sr-only peer"
            />
            <div
              class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"
            ></div>
          </label>
        </div>

        <!-- Discord 通知開關 -->
        <div class="flex items-center justify-between py-4">
          <div>
            <h3 class="font-medium text-gray-800">Discord 通知</h3>
            <p class="text-gray-500 text-sm mt-1">
              通過 Discord 接收即時通知和訊息
            </p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              v-model="discordNotifications"
              class="sr-only peer"
            />
            <div
              class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"
            ></div>
          </label>
        </div>
      </div>

      <!-- 通知類型卡片 -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 class="text-xl font-semibold mb-4 text-gray-800">通知類型</h2>
        <p class="text-gray-600 mb-6">選擇您希望接收的通知類型</p>

        <!-- 遺失物相關通知 -->
        <div
          class="flex items-center justify-between py-4 border-b border-gray-200"
        >
          <div>
            <h3 class="font-medium text-gray-800">遺失物通知</h3>
            <p class="text-gray-500 text-sm mt-1">
              當您的遺失物有新回應或狀態更新時通知您
            </p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              v-model="itemNotifications"
              class="sr-only peer"
            />
            <div
              class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"
            ></div>
          </label>
        </div>

        <!-- 食物相關通知 -->
        <div
          class="flex items-center justify-between py-4 border-b border-gray-200"
        >
          <div>
            <h3 class="font-medium text-gray-800">食物分享通知</h3>
            <p class="text-gray-500 text-sm mt-1">
              當您分享的食物有人預約或您預約的食物有狀態更新時通知您
            </p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              v-model="foodNotifications"
              class="sr-only peer"
            />
            <div
              class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"
            ></div>
          </label>
        </div>

        <!-- 訊息通知 -->
        <div class="flex items-center justify-between py-4">
          <div>
            <h3 class="font-medium text-gray-800">訊息通知</h3>
            <p class="text-gray-500 text-sm mt-1">當您收到新訊息時通知您</p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              v-model="messageNotifications"
              class="sr-only peer"
            />
            <div
              class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"
            ></div>
          </label>
        </div>
      </div>

      <!-- 儲存按鈕 -->
      <div class="flex justify-end mt-8">
        <button
          @click="saveSettings"
          class="px-6 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
        >
          儲存設定
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

// 通知開關的狀態
const emailNotifications = ref(true);
const discordNotifications = ref(false);

// 通知類型的狀態
const itemNotifications = ref(true);
const foodNotifications = ref(true);
const messageNotifications = ref(true);

// 儲存設定
const saveSettings = () => {
  // 這裡只是顯示通知，實際應連接後端 API
  alert("設定已儲存!");
  console.log({
    emailNotifications: emailNotifications.value,
    discordNotifications: discordNotifications.value,
    itemNotifications: itemNotifications.value,
    foodNotifications: foodNotifications.value,
    messageNotifications: messageNotifications.value,
  });
};
</script>
