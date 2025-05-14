<template>
  <div
    class="container mx-auto px-4 py-16 flex justify-center items-center min-h-[80vh]"
  >
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold">歡迎回到 LOFO</h1>
        <p class="text-gray-600 mt-2">登入您的帳號以繼續使用平台功能</p>
      </div>

      <div class="bg-white p-8 rounded-lg shadow-md">
        <div class="w-full mb-6">
          <div class="grid w-full grid-cols-2">
            <button
              @click="activeTab = 'email'"
              class="py-2 px-4 rounded-l-md"
              :class="[
                activeTab === 'email'
                  ? 'bg-gray-200 text-gray-900'
                  : 'bg-white text-gray-500',
              ]"
            >
              電子郵件登入
            </button>
            <button
              @click="activeTab = 'portal'"
              class="py-2 px-4 rounded-r-md"
              :class="[
                activeTab === 'portal'
                  ? 'bg-gray-200 text-gray-900'
                  : 'bg-white text-gray-500',
              ]"
            >
              中央 Portal 登入
            </button>
          </div>
        </div>

        <div v-if="activeTab === 'email'">
          <form @submit.prevent="handleLogin" class="space-y-4">
            <div class="space-y-2">
              <label for="email" class="block text-sm font-medium"
                >電子郵件</label
              >
              <div class="relative">
                <Mail class="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  id="email"
                  v-model="email"
                  type="email"
                  placeholder="請輸入您的電子郵件"
                  class="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
            </div>

            <div class="space-y-2">
              <div class="flex justify-between items-center">
                <label for="password" class="block text-sm font-medium"
                  >密碼</label
                >
                <NuxtLink
                  to="/forgot-password"
                  class="text-sm text-emerald-600 hover:text-emerald-700"
                >
                  忘記密碼？
                </NuxtLink>
              </div>
              <div class="relative">
                <Lock class="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  id="password"
                  v-model="password"
                  type="password"
                  placeholder="請輸入您的密碼"
                  class="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
            </div>

            <p v-if="error" class="text-red-500 text-sm">{{ error }}</p>

            <button
              type="submit"
              class="w-full bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center"
              :disabled="isLoading"
            >
              <span v-if="isLoading" class="flex items-center">
                <Loader2 class="mr-2 h-4 w-4 animate-spin" />
                登入中...
              </span>
              <span v-else class="flex items-center">
                <LogIn class="mr-2 h-4 w-4" />
                登入
              </span>
            </button>
          </form>
        </div>

        <div v-if="activeTab === 'portal'" class="space-y-4">
          <p class="text-sm text-gray-600 mb-4">
            使用中央大學 Portal 帳號直接登入，無需額外註冊。
          </p>

          <button
            @click="handlePortalLogin"
            class="w-full bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors"
            :disabled="isLoading"
          >
            <span v-if="isLoading" class="flex items-center justify-center">
              <Loader2 class="mr-2 h-4 w-4 animate-spin" />
              連接中...
            </span>
            <span v-else> 使用中央 Portal 登入 </span>
          </button>
        </div>

        <div class="mt-6 text-center">
          <p class="text-sm text-gray-600">
            還沒有帳號？
            <NuxtLink
              to="/register"
              class="text-emerald-600 hover:text-emerald-700 font-medium"
            >
              立即註冊
            </NuxtLink>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { Mail, Lock, LogIn, Loader2 } from "lucide-vue-next"; // Importing icons from lucide-vue-next
import { useAuthStore } from "~/stores/auth";

const config = useRuntimeConfig();
const router = useRouter();
const activeTab = ref("email");
const isLoading = ref(false);
const email = ref("");
const password = ref("");
const error = ref("");

const handleLogin = async () => {
  error.value = "";

  if (!email.value || !password.value) {
    error.value = "請填寫所有必填欄位";
    return;
  }

  isLoading.value = true;

  try {
    // 連接後端登入API
    const response = await fetch(
      `${config.public.BACKEND_BASE_URL}/user/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.value,
          password: password.value,
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

      // 登入成功後導向首頁
      router.push("/");
    } else {
      error.value = data.message || "登入失敗，請檢查您的帳號和密碼";
    }
  } catch (err) {
    console.error("登入錯誤:", err);
    error.value = "登入失敗，請稍後再試";
  } finally {
    isLoading.value = false;
  }
};

const handlePortalLogin = async () => {
  isLoading.value = true;

  try {
    // 模擬 Portal 登入流程
    // await new Promise((resolve) => setTimeout(resolve, 1500));
    window.location.href = `${config.public.BACKEND_BASE_URL}/auth/go`;

    // 登入成功後導向首頁
    router.push("/");
  } catch (err) {
    error.value = "Portal 登入失敗，請稍後再試";
  } finally {
    isLoading.value = false;
  }
};

const redirect = () => {
  window.location.href = `${config.public.BACKEND_BASE_URL}/auth/fakeAuth`;
  // location.href = `${config.public.BACKEND_BASE_URL}/auth/go`
  // location.href = `${config.public.BACKEND_BASE_URL}/auth/fakeAuth` // fake login for testing
};
</script>
