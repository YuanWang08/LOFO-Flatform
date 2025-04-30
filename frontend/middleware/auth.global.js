// middleware/auth.global.js (全局中間件)
export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore();
  authStore.checkAuth(); // 每次路由變化時都檢查認證狀態
});
