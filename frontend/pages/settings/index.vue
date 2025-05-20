<template>
  <div class="container mx-auto px-4 py-8 max-w-4xl">
    <div class="bg-white rounded-lg shadow-md p-6">
      <h1 class="text-2xl font-bold text-gray-800 mb-6">設定</h1>

      <!-- 外觀設定 -->
      <div class="mb-8">
        <h2 class="text-xl font-semibold text-gray-700 mb-4">外觀</h2>
        <div class="bg-gray-50 rounded-lg p-4">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="font-medium text-gray-800">顯示模式</h3>
              <p class="text-sm text-gray-600">選擇明亮或黑暗模式</p>
            </div>
            <div class="flex items-center">
              <div
                class="relative inline-block w-14 h-7 transition duration-200 ease-in-out"
              >
                <input
                  type="checkbox"
                  id="toggle"
                  class="opacity-0 absolute w-0 h-0"
                  v-model="isDarkMode"
                  @change="toggleDarkMode"
                />
                <label
                  for="toggle"
                  class="block overflow-hidden h-7 w-14 rounded-full bg-gray-300 cursor-pointer"
                >
                  <span
                    class="absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow-md transition-transform duration-200 ease-in-out"
                    :class="{
                      'transform translate-x-7 bg-emerald-500': isDarkMode,
                    }"
                  ></span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 語言設定 -->
      <div class="mb-8">
        <h2 class="text-xl font-semibold text-gray-700 mb-4">語言</h2>
        <div class="bg-gray-50 rounded-lg p-4">
          <div>
            <h3 class="font-medium text-gray-800 mb-2">選擇語言</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
              <button
                v-for="lang in languages"
                :key="lang.code"
                @click="changeLanguage(lang.code)"
                class="flex items-center justify-center px-4 py-2 border rounded-lg transition-colors"
                :class="{
                  'border-emerald-500 bg-emerald-50 text-emerald-700':
                    currentLanguage === lang.code,
                  'border-gray-300 hover:bg-gray-100':
                    currentLanguage !== lang.code,
                }"
              >
                <span class="mr-2">{{ lang.flag }}</span>
                <span>{{ lang.name }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 儲存按鈕 -->
      <div class="flex justify-end">
        <button
          @click="saveSettings"
          class="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg transition-colors"
        >
          儲存變更
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import Swal from "sweetalert2";

const { locale } = useI18n();
const isDarkMode = ref(false);
const currentLanguage = ref("zh-tw");

const languages = [
  { code: "zh-tw", name: "繁體中文", flag: "🇹🇼" },
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "ja", name: "日本語", flag: "🇯🇵" },
];

onMounted(() => {
  // 初始化設定值 (這裡僅作為前端展示，沒有實際邏輯)
  const savedTheme = localStorage.getItem("theme");
  isDarkMode.value = savedTheme === "dark";

  const savedLanguage = localStorage.getItem("language");
  if (savedLanguage) {
    currentLanguage.value = savedLanguage;
  }
});

function toggleDarkMode() {
  // 這裡只是前端示例，實際上沒有改變應用的主題
  console.log(`切換到${isDarkMode.value ? "黑暗" : "明亮"}模式`);
}

function changeLanguage(langCode) {
  currentLanguage.value = langCode;
  // 如果要實際切換語言，可以取消下面這行的註解
  // locale.value = langCode;
  console.log(`切換語言到: ${langCode}`);
}

function saveSettings() {
  // 儲存設定 (僅示範用，無實際功能)
  localStorage.setItem("theme", isDarkMode.value ? "dark" : "light");
  localStorage.setItem("language", currentLanguage.value);

  // 使用 Sweetalert2 顯示儲存成功訊息
  Swal.fire({
    icon: "success",
    title: "設定已儲存",
    text: "您的偏好設定已成功更新",
    confirmButtonColor: "#10b981",
    timer: 2000,
    timerProgressBar: true,
  });
}
</script>
