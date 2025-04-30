// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss", "@pinia/nuxt", "@nuxtjs/i18n"],
  // css: ['leaflet/dist/leaflet.css'],
  runtimeConfig: {
    // 公開變數（客戶端可用）
    public: {
      BACKEND_BASE_URL: process.env.NUXT_PUBLIC_BACKEND_BASE_URL,
      FRONTEND_BASE_URL: process.env.FRONTEND_BASE_URL,
    },
  },
});
