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
      return this.isAuthenticated;
    },

    logout() {
      const authCookie = useCookie("auth_token");
      authCookie.value = null;
      this.isAuthenticated = false;
      this.user = null;
    },
  },
});
