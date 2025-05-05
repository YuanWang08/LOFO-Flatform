<template>
  <div
    class="container mx-auto px-4 py-16 flex justify-center items-center min-h-[80vh]"
  >
    <div class="w-full max-w-md">
      <div class="bg-white p-8 rounded-lg shadow-md">
        <div class="mb-6">
          <h1 class="text-2xl font-bold">
            {{ stepTitle }}
          </h1>
          <p class="text-gray-600 mt-2">
            {{ stepDescription }}
          </p>
        </div>

        <!-- 步驟 1: 輸入電子郵件 -->
        <form
          v-if="step === 'email'"
          @submit.prevent="handleSubmitEmail"
          class="space-y-4"
        >
          <div class="space-y-2">
            <label for="email" class="block text-sm font-medium"
              >電子郵件</label
            >
            <div class="relative">
              <Mail class="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                id="email"
                type="email"
                v-model="email"
                placeholder="請輸入您的電子郵件"
                class="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>
          </div>

          <p v-if="error" class="text-red-500 text-sm">{{ error }}</p>

          <button
            type="submit"
            class="w-full px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md transition-colors"
            :disabled="isLoading"
          >
            <div v-if="isLoading" class="flex items-center justify-center">
              <Loader2 class="mr-2 h-4 w-4 animate-spin" />
              發送中...
            </div>
            <span v-else>發送驗證碼</span>
          </button>
        </form>

        <!-- 步驟 2: 驗證碼 -->
        <form
          v-else-if="step === 'verification'"
          @submit.prevent="handleSubmitVerification"
          class="space-y-4"
        >
          <div class="space-y-2">
            <label for="verification-code" class="block text-sm font-medium"
              >驗證碼</label
            >
            <input
              id="verification-code"
              v-model="verificationCode"
              placeholder="請輸入 6 位數驗證碼"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
            <p class="text-sm text-gray-500">
              驗證碼已發送至 {{ email }}，有效期為 10 分鐘
            </p>
          </div>

          <p v-if="error" class="text-red-500 text-sm">{{ error }}</p>

          <div class="flex space-x-2">
            <button
              type="button"
              class="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex items-center justify-center"
              @click="step = 'email'"
              :disabled="isLoading"
            >
              <ArrowLeft class="mr-2 h-4 w-4" />
              返回
            </button>
            <button
              type="submit"
              class="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md transition-colors"
              :disabled="isLoading"
            >
              <div v-if="isLoading" class="flex items-center justify-center">
                <Loader2 class="mr-2 h-4 w-4 animate-spin" />
                驗證中...
              </div>
              <span v-else>驗證</span>
            </button>
          </div>
        </form>

        <!-- 步驟 3: 重設密碼 -->
        <form
          v-else-if="step === 'reset'"
          @submit.prevent="handleResetPassword"
          class="space-y-4"
        >
          <div class="space-y-2">
            <label for="new-password" class="block text-sm font-medium"
              >新密碼</label
            >
            <div class="relative">
              <KeyRound class="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                id="new-password"
                type="password"
                v-model="newPassword"
                placeholder="請設定新密碼"
                class="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>
          </div>

          <div class="space-y-2">
            <label for="confirm-password" class="block text-sm font-medium"
              >確認密碼</label
            >
            <div class="relative">
              <KeyRound class="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                id="confirm-password"
                type="password"
                v-model="confirmPassword"
                placeholder="請再次輸入新密碼"
                class="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>
          </div>

          <p v-if="error" class="text-red-500 text-sm">{{ error }}</p>

          <button
            type="submit"
            class="w-full px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md transition-colors"
            :disabled="isLoading"
          >
            <div v-if="isLoading" class="flex items-center justify-center">
              <Loader2 class="mr-2 h-4 w-4 animate-spin" />
              重設中...
            </div>
            <span v-else>重設密碼</span>
          </button>
        </form>

        <!-- 步驟 4: 成功頁面 -->
        <div v-else-if="step === 'success'" class="text-center py-4">
          <div
            class="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <CheckCircle class="h-8 w-8 text-emerald-600" />
          </div>
          <p class="text-gray-600 mb-6">
            您的密碼已成功重設，請使用新密碼登入您的帳號。
          </p>
          <NuxtLink to="/login">
            <button
              class="w-full px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md transition-colors"
            >
              前往登入
            </button>
          </NuxtLink>
        </div>

        <div class="mt-6 text-center">
          <p class="text-sm text-gray-600">
            記起密碼了？
            <NuxtLink
              to="/login"
              class="text-emerald-600 hover:text-emerald-700 font-medium"
            >
              返回登入
            </NuxtLink>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import {
  Mail,
  ArrowLeft,
  CheckCircle,
  KeyRound,
  Loader2,
} from "lucide-vue-next";

const router = useRouter();
const step = ref("email");
const isLoading = ref(false);
const email = ref("");
const verificationCode = ref("");
const newPassword = ref("");
const confirmPassword = ref("");
const error = ref("");

// 根據當前步驟顯示不同的標題和描述
const stepTitle = computed(() => {
  switch (step.value) {
    case "email":
      return "忘記密碼";
    case "verification":
      return "驗證您的身份";
    case "reset":
      return "重設密碼";
    case "success":
      return "密碼重設成功";
    default:
      return "";
  }
});

const stepDescription = computed(() => {
  switch (step.value) {
    case "email":
      return "請輸入您的電子郵件，我們將發送重設密碼的驗證碼";
    case "verification":
      return "請輸入我們發送到您電子郵件的驗證碼";
    case "reset":
      return "請設定您的新密碼";
    case "success":
      return "您的密碼已成功重設，現在可以使用新密碼登入";
    default:
      return "";
  }
});

const handleSubmitEmail = async () => {
  error.value = "";

  if (!email.value) {
    error.value = "請輸入您的電子郵件";
    return;
  }

  isLoading.value = true;

  // 模擬 API 請求
  try {
    // 這裡應該是實際的發送重設密碼郵件的 API 請求
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // 進入驗證碼步驟
    step.value = "verification";
  } catch (err) {
    error.value = "發送重設密碼郵件失敗，請稍後再試";
  } finally {
    isLoading.value = false;
  }
};

const handleSubmitVerification = async () => {
  error.value = "";

  if (!verificationCode.value) {
    error.value = "請輸入驗證碼";
    return;
  }

  isLoading.value = true;

  // 模擬 API 請求
  try {
    // 這裡應該是實際的驗證碼驗證 API 請求
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // 進入重設密碼步驟
    step.value = "reset";
  } catch (err) {
    error.value = "驗證碼錯誤，請重新輸入";
  } finally {
    isLoading.value = false;
  }
};

const handleResetPassword = async () => {
  error.value = "";

  if (!newPassword.value) {
    error.value = "請設定新密碼";
    return;
  }

  if (newPassword.value.length < 8) {
    error.value = "密碼長度至少需要 8 個字元";
    return;
  }

  if (newPassword.value !== confirmPassword.value) {
    error.value = "兩次輸入的密碼不一致";
    return;
  }

  isLoading.value = true;

  // 模擬 API 請求
  try {
    // 這裡應該是實際的重設密碼 API 請求
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // 重設成功
    step.value = "success";
  } catch (err) {
    error.value = "重設密碼失敗，請稍後再試";
  } finally {
    isLoading.value = false;
  }
};
</script>
