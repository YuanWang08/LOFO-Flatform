<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-4xl mx-auto">
      <!-- 頁面標題 -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-800">隱私與安全</h1>
        <p class="text-gray-600 mt-2">管理您的隱私偏好和安全設置</p>
      </div>

      <!-- 個人資料可見性設置 -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 class="text-xl font-semibold mb-4 text-gray-800">個人資料可見性</h2>
        <p class="text-gray-600 mb-6">控制其他用戶可以看到您的哪些資訊</p>

        <!-- 聯絡方式可見性 -->
        <div
          class="flex items-center justify-between py-4 border-b border-gray-200"
        >
          <div>
            <h3 class="font-medium text-gray-800">顯示聯絡電話</h3>
            <p class="text-gray-500 text-sm mt-1">
              讓其他用戶可以查看您的聯絡電話
            </p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              v-model="privacySettings.showPhoneNumber"
              class="sr-only peer"
            />
            <div
              class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"
            ></div>
          </label>
        </div>

        <!-- 電子郵件可見性 -->
        <div
          class="flex items-center justify-between py-4 border-b border-gray-200"
        >
          <div>
            <h3 class="font-medium text-gray-800">顯示電子郵件</h3>
            <p class="text-gray-500 text-sm mt-1">
              讓其他用戶可以查看您的電子郵件
            </p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              v-model="privacySettings.showEmail"
              class="sr-only peer"
            />
            <div
              class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"
            ></div>
          </label>
        </div>

        <!-- 個人簡介可見性 -->
        <div class="flex items-center justify-between py-4">
          <div>
            <h3 class="font-medium text-gray-800">顯示個人簡介</h3>
            <p class="text-gray-500 text-sm mt-1">
              讓其他用戶可以查看您的個人簡介
            </p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              v-model="privacySettings.showBio"
              class="sr-only peer"
            />
            <div
              class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"
            ></div>
          </label>
        </div>
      </div>

      <!-- 消息安全設置 -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 class="text-xl font-semibold mb-4 text-gray-800">消息安全</h2>
        <p class="text-gray-600 mb-6">管理誰可以與您聯繫或發送訊息</p>

        <!-- 誰可以發訊息給我 -->
        <div class="mb-6">
          <h3 class="font-medium text-gray-800 mb-2">誰可以發訊息給我</h3>
          <div class="space-y-2">
            <label class="flex items-center">
              <input
                type="radio"
                v-model="privacySettings.messagePrivacy"
                value="everyone"
                class="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
              />
              <span class="ml-2 text-gray-700">所有人</span>
            </label>
            <label class="flex items-center">
              <input
                type="radio"
                v-model="privacySettings.messagePrivacy"
                value="itemRelated"
                class="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
              />
              <span class="ml-2 text-gray-700"
                >僅限與我的物品/食物相關的用戶</span
              >
            </label>
            <label class="flex items-center">
              <input
                type="radio"
                v-model="privacySettings.messagePrivacy"
                value="nobody"
                class="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
              />
              <span class="ml-2 text-gray-700">不允許任何人</span>
            </label>
          </div>
        </div>

        <!-- 自動過濾可疑訊息 -->
        <div class="flex items-center justify-between py-4">
          <div>
            <h3 class="font-medium text-gray-800">自動過濾可疑訊息</h3>
            <p class="text-gray-500 text-sm mt-1">
              系統將自動識別並過濾可能含有垃圾內容或詐騙信息的訊息
            </p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              v-model="privacySettings.filterSuspiciousMessages"
              class="sr-only peer"
            />
            <div
              class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"
            ></div>
          </label>
        </div>
      </div>

      <!-- 帳號安全 -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 class="text-xl font-semibold mb-4 text-gray-800">帳號安全</h2>
        <p class="text-gray-600 mb-6">保護您的帳戶安全</p>

        <!-- 異地登入通知 -->
        <div
          class="flex items-center justify-between py-4 border-b border-gray-200"
        >
          <div>
            <h3 class="font-medium text-gray-800">異地登入通知</h3>
            <p class="text-gray-500 text-sm mt-1">
              當偵測到不尋常的登入活動時，向您發送通知
            </p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              v-model="privacySettings.loginNotification"
              class="sr-only peer"
            />
            <div
              class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"
            ></div>
          </label>
        </div>

        <!-- 活動記錄 -->
        <div class="py-4">
          <div>
            <h3 class="font-medium text-gray-800">活動記錄</h3>
            <p class="text-gray-500 text-sm mt-1">
              查看您的帳戶活動記錄，確保帳戶安全
            </p>
          </div>
          <div class="mt-2">
            <NuxtLink
              to="/activities"
              class="text-emerald-600 hover:text-emerald-700 font-medium"
            >
              查看活動記錄 →
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- 儲存按鈕 -->
      <div class="flex justify-end mt-8">
        <button
          @click="savePrivacySettings"
          class="px-6 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
        >
          儲存設定
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useRuntimeConfig, useCookie } from "#app";
import { useAuthStore } from "~/stores/auth";

const router = useRouter();
const config = useRuntimeConfig();
const authStore = useAuthStore();

// 隱私設置狀態
const privacySettings = ref({
  // 個人資料可見性
  showPhoneNumber: false,
  showEmail: false,
  showBio: false,

  // 消息安全
  messagePrivacy: "nobody",
  filterSuspiciousMessages: true,

  // 帳號安全
  loginNotification: false,
});

// 在頁面加載時檢查用戶是否已登入並獲取設置
onMounted(() => {
  if (!authStore.isAuthenticated) {
    router.push("/login");
    return;
  }

  // 從後端獲取用戶當前的隱私設置
  fetchPrivacySettings();
});

// 獲取用戶的隱私設置
const fetchPrivacySettings = async () => {
  try {
    // 實際應用中應從後端API獲取設置
    // 這裡僅為示範，使用默認值

    // 模擬API請求延遲
    await new Promise((resolve) => setTimeout(resolve, 500));

    // 在此處模擬從後端取得的數據
    // privacySettings.value = data;
  } catch (error) {
    console.error("Error fetching privacy settings:", error);
  }
};

// 儲存隱私設置
const savePrivacySettings = async () => {
  try {
    // 實際應用中應將設置發送到後端API進行保存
    // 這裡僅為示範

    // 模擬API請求延遲
    await new Promise((resolve) => setTimeout(resolve, 800));

    // 顯示成功提示
    alert("隱私設置已更新！");
    console.log("Updated privacy settings:", privacySettings.value);
  } catch (error) {
    alert("設置更新失敗，請稍後再試");
    console.error("Error saving privacy settings:", error);
  }
};
</script>
