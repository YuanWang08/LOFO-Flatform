// stores/auth.js
export const useAuthStore = defineStore("auth", {
  state: () => ({
    isAuthenticated: false,
    user: null,
  }),
  actions: {
    checkAuth() {
      const authCookie = useCookie("auth_token");
      this.isAuthenticated = !!authCookie.value;
      if (this.isAuthenticated && !this.user) {
        this.fetchUserInfo();
      }
      return this.isAuthenticated;
    },

    async fetchUserInfo() {
      try {
        const config = useRuntimeConfig();
        const authCookie = useCookie("auth_token");
        if (!authCookie.value) return;

        const { data } = await useFetch(
          `${config.public.BACKEND_BASE_URL}/user/info`,
          {
            headers: {
              Authorization: `Bearer ${authCookie.value}`,
            },
          }
        );

        if (data.value) {
          this.user = data.value;
        }
      } catch (error) {
        console.error("Failed to fetch user info:", error);
      }
    },

    updateUserInfo(userData) {
      if (this.user) {
        this.user = { ...this.user, ...userData };
      }
    },

    logout() {
      const authCookie = useCookie("auth_token");
      authCookie.value = null;
      this.isAuthenticated = false;
      this.user = null;
    },
  },
});
