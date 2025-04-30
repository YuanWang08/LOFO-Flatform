// plugins/auth.js
export default defineNuxtPlugin(({ $pinia }) => {
  const authStore = useAuthStore($pinia);

  // 檢查認證狀態
  authStore.checkAuth();
});
