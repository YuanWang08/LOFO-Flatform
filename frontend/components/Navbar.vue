<template>
  <nav class="bg-white shadow-md">
    <div class="container mx-auto px-4">
      <div class="flex justify-between items-center h-16">
        <NuxtLink to="/" class="flex items-center space-x-2">
          <span class="text-2xl font-bold text-emerald-600">LOFO</span>
        </NuxtLink>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center space-x-6">
          <NuxtLink
            to="/map"
            class="flex items-center space-x-1 text-gray-700 hover:text-emerald-600 transition-colors"
          >
            <Map size="18" />
            <span>地圖</span>
          </NuxtLink>
          <NuxtLink
            to="/items"
            class="flex items-center space-x-1 text-gray-700 hover:text-emerald-600 transition-colors"
          >
            <Package size="18" />
            <span>遺失物</span>
          </NuxtLink>
          <NuxtLink
            to="/foods"
            class="flex items-center space-x-1 text-gray-700 hover:text-emerald-600 transition-colors"
          >
            <Utensils size="18" />
            <span>食物分享</span>
          </NuxtLink>
          <NuxtLink
            v-if="isAuthenticated"
            to="/notifications"
            class="flex items-center space-x-1 text-gray-700 hover:text-emerald-600 transition-colors"
          >
            <Bell size="18" />
            <span>通知</span>
          </NuxtLink>
          <NuxtLink
            v-if="isAuthenticated"
            to="/message"
            class="flex items-center space-x-1 text-gray-700 hover:text-emerald-600 transition-colors"
          >
            <MessageCircle size="18" />
            <span>訊息</span>
          </NuxtLink>

          <!-- 未登入時顯示登入按鈕 -->
          <NuxtLink
            v-if="!isAuthenticated"
            to="/login"
            class="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            登入
          </NuxtLink>

          <!-- 登入後顯示用戶頭像和下拉選單 -->
          <div v-else class="relative">
            <button
              @click="toggleUserMenu"
              class="flex items-center space-x-2 text-gray-700 hover:text-emerald-600 focus:outline-none"
            >
              <div
                class="w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center overflow-hidden"
              >
                <img
                  v-if="authStore.user?.avatar_url"
                  :src="authStore.user.avatar_url"
                  alt="用戶頭像"
                  class="w-full h-full object-cover"
                />
                <User v-else size="16" />
              </div>
              <span>{{ authStore.user?.nickname || "用戶" }}</span>
              <ChevronDown size="16" />
            </button>

            <!-- 用戶下拉選單 -->
            <div
              v-show="showUserMenu"
              class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10"
            >
              <NuxtLink
                to="/activities"
                class="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                @click="showUserMenu = false"
              >
                <div class="flex items-center space-x-2">
                  <Activity size="16" />
                  <span>我的活動</span>
                </div>
              </NuxtLink>
              <NuxtLink
                to="/profile"
                class="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                @click="showUserMenu = false"
              >
                <div class="flex items-center space-x-2">
                  <User size="16" />
                  <span>個人資料</span>
                </div>
              </NuxtLink>
              <NuxtLink
                to="/settings"
                class="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                @click="showUserMenu = false"
              >
                <div class="flex items-center space-x-2">
                  <Settings size="16" />
                  <span>設定</span>
                </div>
              </NuxtLink>
              <div class="border-t border-gray-100 my-1"></div>
              <button
                @click="confirmLogout"
                class="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
              >
                <div class="flex items-center space-x-2">
                  <LogOut size="16" />
                  <span>登出</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        <!-- Mobile Menu Button -->
        <div class="md:hidden">
          <button
            @click="isMenuOpen = !isMenuOpen"
            class="text-gray-700 hover:text-emerald-600 focus:outline-none"
          >
            <X v-if="isMenuOpen" size="24" />
            <Menu v-else size="24" />
          </button>
        </div>
      </div>

      <!-- Mobile Navigation -->
      <div v-if="isMenuOpen" class="md:hidden py-4 space-y-3">
        <NuxtLink
          to="/map"
          class="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
          @click="isMenuOpen = false"
        >
          <Map size="18" />
          <span>地圖</span>
        </NuxtLink>
        <NuxtLink
          to="/items"
          class="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
          @click="isMenuOpen = false"
        >
          <Package size="18" />
          <span>遺失物</span>
        </NuxtLink>
        <NuxtLink
          to="/foods"
          class="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
          @click="isMenuOpen = false"
        >
          <Utensils size="18" />
          <span>食物分享</span>
        </NuxtLink>
        <NuxtLink
          v-if="isAuthenticated"
          to="/notifications"
          class="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
          @click="isMenuOpen = false"
        >
          <Bell size="18" />
          <span>通知</span>
        </NuxtLink>
        <NuxtLink
          v-if="isAuthenticated"
          to="/message"
          class="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
          @click="isMenuOpen = false"
        >
          <MessageCircle size="18" />
          <span>訊息</span>
        </NuxtLink>

        <!-- 行動版未登入時顯示登入按鈕 -->
        <NuxtLink
          v-if="!isAuthenticated"
          to="/login"
          class="block px-4 py-2 bg-emerald-600 text-white text-center rounded-lg"
          @click="isMenuOpen = false"
        >
          登入
        </NuxtLink>

        <!-- 行動版登入後顯示用戶選項 -->
        <div v-else class="space-y-2">
          <!-- 用戶資訊區塊 -->
          <div class="px-4 py-3 bg-gray-50 rounded-lg">
            <div class="flex items-center space-x-3">
              <div
                class="w-10 h-10 bg-emerald-500 text-white rounded-full flex items-center justify-center overflow-hidden"
              >
                <img
                  v-if="authStore.user?.avatar_url"
                  :src="authStore.user.avatar_url"
                  alt="用戶頭像"
                  class="w-full h-full object-cover"
                />
                <User v-else size="20" />
              </div>
              <div>
                <p class="font-medium">
                  {{ authStore.user?.nickname || "用戶" }}
                </p>
                <p class="text-sm text-gray-500">
                  {{ authStore.user?.email || "" }}
                </p>
              </div>
            </div>
          </div>

          <!-- 用戶選項 -->
          <NuxtLink
            to="/activities"
            class="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            @click="isMenuOpen = false"
          >
            <Activity size="18" />
            <span>我的活動</span>
          </NuxtLink>
          <NuxtLink
            to="/profile"
            class="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            @click="isMenuOpen = false"
          >
            <User size="18" />
            <span>個人資料</span>
          </NuxtLink>
          <NuxtLink
            to="/settings"
            class="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            @click="isMenuOpen = false"
          >
            <Settings size="18" />
            <span>設定</span>
          </NuxtLink>
          <button
            @click="confirmLogout"
            class="flex items-center space-x-2 w-full px-4 py-2 text-red-600 hover:bg-gray-100 rounded-lg text-left"
          >
            <LogOut size="18" />
            <span>登出</span>
          </button>
        </div>
      </div>
    </div>

    <!-- 登出確認對話框 -->
    <div
      v-if="showLogoutConfirm"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg p-6 max-w-sm mx-auto">
        <h3 class="text-lg font-medium mb-4">確認登出</h3>
        <p class="text-gray-600 mb-6">您確定要登出嗎？</p>
        <div class="flex justify-end space-x-3">
          <button
            @click="showLogoutConfirm = false"
            class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
          >
            取消
          </button>
          <button
            @click="handleLogout"
            class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            確認登出
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { onClickOutside } from "@vueuse/core";
import {
  Menu,
  X,
  Map,
  Package,
  Utensils,
  User,
  Bell,
  MessageCircle,
  ChevronDown,
  Settings,
  LogOut,
  Activity,
} from "lucide-vue-next";
import { useAuthStore } from "~/stores/auth";

const router = useRouter();
const authStore = useAuthStore();
const isMenuOpen = ref(false);
const showLogoutConfirm = ref(false);
const isAuthenticated = ref(false);
const showUserMenu = ref(false);
const userMenuRef = ref(null);

// 點擊外部關閉用戶選單
if (process.client) {
  onClickOutside(userMenuRef, () => {
    showUserMenu.value = false;
  });
}

onMounted(() => {
  checkAuthStatus();
});

// 監聽 authStore 的認證狀態變化
watch(
  () => authStore.isAuthenticated,
  (newValue) => {
    isAuthenticated.value = newValue;
  }
);

function checkAuthStatus() {
  isAuthenticated.value = authStore.checkAuth();
}

function toggleUserMenu() {
  showUserMenu.value = !showUserMenu.value;
}

function confirmLogout() {
  showLogoutConfirm.value = true;
  isMenuOpen.value = false;
  showUserMenu.value = false;
}

function handleLogout() {
  authStore.logout();
  showLogoutConfirm.value = false;
  isAuthenticated.value = false;
  router.push("/"); // 登出後導向首頁
}
</script>

<style scoped>
/* 確保下拉選單顯示在其他元素之上 */
.relative {
  position: relative;
}
</style>
