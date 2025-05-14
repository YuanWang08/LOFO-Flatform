<template>
  <div
    class="container mx-auto px-4 py-16 flex justify-center items-center min-h-[80vh]"
  >
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold">註冊 LOFO 帳號</h1>
        <p class="text-gray-600 mt-2">建立您的帳號以使用平台全部功能</p>
      </div>

      <div class="bg-white p-8 rounded-lg shadow-md">
        <form @submit.prevent="handleRegister" class="space-y-6">
          <!-- 電子郵件 -->
          <div class="space-y-2">
            <label for="email" class="block text-sm font-medium"
              >電子郵件</label
            >
            <div class="relative">
              <Mail class="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                id="email"
                v-model="formData.email"
                type="email"
                placeholder="請輸入您的電子郵件"
                class="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>
          </div>

          <!-- 密碼 -->
          <div class="space-y-2">
            <label for="password" class="block text-sm font-medium">密碼</label>
            <div class="relative">
              <Lock class="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                id="password"
                v-model="formData.password"
                type="password"
                placeholder="請設定密碼 (至少8個字元)"
                class="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
                minlength="8"
              />
            </div>
          </div>

          <!-- 確認密碼 -->
          <div class="space-y-2">
            <label for="confirmPassword" class="block text-sm font-medium"
              >確認密碼</label
            >
            <div class="relative">
              <KeyRound class="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                id="confirmPassword"
                v-model="formData.confirmPassword"
                type="password"
                placeholder="請再次輸入密碼"
                class="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>
          </div>

          <!-- 用戶協議 -->
          <div class="flex items-center space-x-2">
            <input
              id="agreement"
              v-model="formData.agreement"
              type="checkbox"
              class="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
              required
            />
            <label for="agreement" class="text-sm text-gray-600">
              我已閱讀並同意
              <NuxtLink
                to="/terms"
                class="text-emerald-600 hover:text-emerald-700"
                target="_blank"
              >
                服務條款
              </NuxtLink>
              和
              <NuxtLink
                to="/privacy"
                class="text-emerald-600 hover:text-emerald-700"
                target="_blank"
              >
                隱私政策
              </NuxtLink>
            </label>
          </div>

          <!-- 錯誤訊息 -->
          <div v-if="error" class="text-red-500 text-sm">
            {{ error }}
          </div>

          <!-- 註冊按鈕 -->
          <button
            type="submit"
            class="w-full bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center"
            :disabled="isLoading"
          >
            <div v-if="isLoading" class="flex items-center justify-center">
              <Loader2 class="mr-2 h-4 w-4 animate-spin" />
              註冊中...
            </div>
            <span v-else>建立帳號</span>
          </button>
        </form>

        <div class="mt-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-gray-500">或者</span>
            </div>
          </div>

          <div class="mt-6">
            <a
              href="#"
              @click.prevent="redirectToPortal"
              class="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              使用中央 Portal 帳號登入
            </a>
          </div>
        </div>

        <div class="mt-6 text-center">
          <p class="text-sm text-gray-600">
            已有帳號？
            <NuxtLink
              to="/login"
              class="text-emerald-600 hover:text-emerald-700 font-medium"
            >
              立即登入
            </NuxtLink>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { Mail, Lock, KeyRound, Loader2 } from "lucide-vue-next";

const config = useRuntimeConfig();
const router = useRouter();
const isLoading = ref(false);
const error = ref("");

const formData = reactive({
  email: "",
  password: "",
  confirmPassword: "",
  agreement: false,
});

const handleRegister = async () => {
  error.value = "";

  // 驗證表單
  if (!formData.email || !formData.password || !formData.confirmPassword) {
    error.value = "請填寫所有必填欄位";
    return;
  }

  // 驗證電子郵件格式
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(formData.email)) {
    error.value = "請提供有效的電子郵件地址";
    return;
  }

  // 驗證密碼長度
  if (formData.password.length < 8) {
    error.value = "密碼長度必須至少為8個字元";
    return;
  }

  // 驗證密碼一致性
  if (formData.password !== formData.confirmPassword) {
    error.value = "兩次輸入的密碼不一致";
    return;
  }

  // 驗證用戶協議
  if (!formData.agreement) {
    error.value = "請同意服務條款和隱私政策";
    return;
  }

  isLoading.value = true;

  try {
    // 發送註冊請求到API
    const response = await fetch(
      `${config.public.BACKEND_BASE_URL}/user/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      }
    );

    const data = await response.json();

    if (response.ok && data.success) {
      // 儲存 token 到 cookie
      const authCookie = useCookie("auth_token", {
        maxAge: 60 * 60 * 24 * 7, // 7天有效期
        path: "/",
        secure: process.env.NODE_ENV === "production",
      });
      authCookie.value = data.token;

      // 更新認證狀態
      const authStore = useAuthStore();
      authStore.checkAuth();

      // 註冊成功後導向首頁
      router.push("/");
    } else {
      error.value = data.message || "註冊失敗，請稍後再試";
    }
  } catch (err) {
    console.error("註冊錯誤:", err);
    error.value = "註冊失敗，請稍後再試";
  } finally {
    isLoading.value = false;
  }
};

const redirectToPortal = () => {
  window.location.href = `${config.public.BACKEND_BASE_URL}/auth/go`;
};
</script>
