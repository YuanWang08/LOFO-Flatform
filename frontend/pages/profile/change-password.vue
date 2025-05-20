<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-4xl mx-auto">
      <!-- 頁面標題 -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-800">變更密碼</h1>
        <p class="text-gray-600 mt-2">設置新的帳戶密碼</p>
      </div>

      <!-- 主要表單卡片 -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <div v-if="loading" class="flex justify-center items-center py-8">
          <div
            class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"
          ></div>
        </div>

        <div
          v-else-if="error"
          class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
        >
          <p>{{ error }}</p>
        </div>

        <div
          v-else-if="success"
          class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4"
        >
          <p>{{ success }}</p>
          <NuxtLink
            to="/profile"
            class="mt-4 inline-block px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
          >
            返回個人資料
          </NuxtLink>
        </div>

        <form v-else @submit.prevent="confirmPasswordChange" class="space-y-6">
          <!-- 新密碼 -->
          <div class="space-y-2">
            <label
              for="newPassword"
              class="block text-sm font-medium text-gray-700 mb-1"
              >新密碼</label
            >
            <div class="relative">
              <Lock class="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="password"
                id="newPassword"
                v-model="newPassword"
                class="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="請輸入新密碼（至少8個字元）"
                minlength="8"
                required
              />
            </div>
            <p class="mt-1 text-xs text-gray-500">密碼長度至少要8個字元</p>
          </div>

          <!-- 確認新密碼 -->
          <div class="space-y-2">
            <label
              for="confirmPassword"
              class="block text-sm font-medium text-gray-700 mb-1"
              >確認新密碼</label
            >
            <div class="relative">
              <KeyRound class="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="password"
                id="confirmPassword"
                v-model="confirmPassword"
                class="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="請再次輸入新密碼"
                required
              />
            </div>
            <p
              v-if="!passwordsMatch && confirmPassword"
              class="mt-1 text-xs text-red-500"
            >
              兩次輸入的密碼不一致
            </p>
          </div>

          <!-- 操作按鈕 -->
          <div class="flex justify-end space-x-4 pt-4">
            <NuxtLink
              to="/profile"
              class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
            >
              取消
            </NuxtLink>
            <button
              type="submit"
              :disabled="!passwordsMatch || isChanging"
              class="px-6 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ isChanging ? "處理中..." : "變更密碼" }}
            </button>
          </div>
        </form>
      </div>

      <!-- 安全提示卡片 -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-xl font-semibold mb-4 text-gray-800">密碼安全提示</h2>

        <ul class="space-y-2 text-gray-700">
          <li class="flex items-start">
            <div class="mt-1 mr-2 flex-shrink-0">
              <CheckCircle2 class="h-5 w-5 text-emerald-500" />
            </div>
            <span>使用至少8個字元的密碼</span>
          </li>
          <li class="flex items-start">
            <div class="mt-1 mr-2 flex-shrink-0">
              <CheckCircle2 class="h-5 w-5 text-emerald-500" />
            </div>
            <span>包含大小寫字母、數字和符號</span>
          </li>
          <li class="flex items-start">
            <div class="mt-1 mr-2 flex-shrink-0">
              <CheckCircle2 class="h-5 w-5 text-emerald-500" />
            </div>
            <span>避免使用生日、姓名等容易被猜到的資訊</span>
          </li>
          <li class="flex items-start">
            <div class="mt-1 mr-2 flex-shrink-0">
              <CheckCircle2 class="h-5 w-5 text-emerald-500" />
            </div>
            <span>不要與其他網站使用相同的密碼</span>
          </li>
        </ul>
      </div>
    </div>

    <!-- 確認對話框 -->
    <div
      v-if="showConfirmDialog"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
    >
      <div class="bg-white rounded-lg shadow-xl p-6 m-4 max-w-sm w-full">
        <h3 class="text-lg font-medium text-gray-900 mb-2">確認變更密碼</h3>
        <p class="text-sm text-gray-600 mb-4">
          您確定要變更密碼嗎？變更後將需要使用新密碼登入。
        </p>
        <div class="flex justify-end space-x-3">
          <button
            @click="showConfirmDialog = false"
            class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
          >
            取消
          </button>
          <button
            @click="changePassword"
            :disabled="isChanging"
            class="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
          >
            {{ isChanging ? "處理中..." : "確認變更" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useRuntimeConfig, useCookie } from "#app";
import { useAuthStore } from "~/stores/auth";
import { Lock, KeyRound, CheckCircle2 } from "lucide-vue-next";

const router = useRouter();
const config = useRuntimeConfig();
const authStore = useAuthStore();

// 密碼相關狀態
const newPassword = ref("");
const confirmPassword = ref("");
const passwordsMatch = computed(() => {
  if (!confirmPassword.value) return true;
  return newPassword.value === confirmPassword.value;
});

// 頁面狀態
const loading = ref(false);
const error = ref(null);
const success = ref(null);
const isChanging = ref(false);
const showConfirmDialog = ref(false);

// 在頁面加載時檢查用戶是否已登入
onMounted(() => {
  if (!authStore.isAuthenticated) {
    router.push("/login");
  }
});

// 確認密碼變更（顯示確認對話框）
const confirmPasswordChange = () => {
  if (newPassword.value !== confirmPassword.value) {
    error.value = "兩次輸入的密碼不一致";
    return;
  }

  if (newPassword.value.length < 8) {
    error.value = "密碼長度必須至少為8個字元";
    return;
  }

  error.value = null;
  showConfirmDialog.value = true;
};

// 變更密碼
const changePassword = async () => {
  try {
    isChanging.value = true;
    error.value = null;

    const token = useCookie("auth_token").value;
    const response = await fetch(
      `${config.public.BACKEND_BASE_URL}/user/simple-password`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          newPassword: newPassword.value,
        }),
      }
    );

    const data = await response.json();

    if (response.ok) {
      showConfirmDialog.value = false;
      success.value = "密碼已成功變更！";
      newPassword.value = "";
      confirmPassword.value = "";
    } else {
      showConfirmDialog.value = false;
      error.value = data.message || "密碼變更失敗，請稍後再試";
    }
  } catch (err) {
    showConfirmDialog.value = false;
    error.value = "發生錯誤，請稍後再試";
    console.error("Error changing password:", err);
  } finally {
    isChanging.value = false;
  }
};
</script>
