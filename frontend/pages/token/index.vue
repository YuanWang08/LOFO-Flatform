<template>
  <div class="flex min-h-screen items-center justify-center">
    <div class="text-center">
      <p class="text-lg mb-2">登入中，請稍候...</p>
      <div
        class="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto"
      ></div>
    </div>
  </div>
</template>

<script setup>
const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

onMounted(() => {
  // 從 URL 中獲取 token
  const token = route.query.token;

  if (token) {
    // 儲存 token 到 cookie
    const authCookie = useCookie("auth_token", {
      maxAge: 60 * 60 * 24 * 7, // 7天有效期
      path: "/",
      secure: process.env.NODE_ENV === "production",
    });
    authCookie.value = token;

    // 更新認證狀態
    authStore.checkAuth();

    // 重定向到首頁或使用者之前嘗試訪問的頁面
    router.push("/");
  } else {
    // 沒有 token，重定向到登入頁
    router.push("/login");
  }
});
</script>
