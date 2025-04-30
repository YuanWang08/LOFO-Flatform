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
            to="/profile"
            class="flex items-center space-x-1 text-gray-700 hover:text-emerald-600 transition-colors"
          >
            <User size="18" />
            <span>個人資料</span>
          </NuxtLink>
          <NuxtLink
            to="/notifications"
            class="flex items-center space-x-1 text-gray-700 hover:text-emerald-600 transition-colors"
          >
            <Bell size="18" />
            <span>通知</span>
          </NuxtLink>
          <NuxtLink
            v-if="!isAuthenticated"
            to="/login"
            class="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            登入
          </NuxtLink>
          <button
            v-else
            @click="confirmLogout"
            class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            登出
          </button>
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
          to="/profile"
          class="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
          @click="isMenuOpen = false"
        >
          <User size="18" />
          <span>個人資料</span>
        </NuxtLink>
        <NuxtLink
          to="/notifications"
          class="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
          @click="isMenuOpen = false"
        >
          <Bell size="18" />
          <span>通知</span>
        </NuxtLink>
        <NuxtLink
          v-if="!isAuthenticated"
          to="/login"
          class="block px-4 py-2 bg-emerald-600 text-white text-center rounded-lg"
          @click="isMenuOpen = false"
        >
          登入
        </NuxtLink>
        <button
          v-else
          @click="confirmLogout"
          class="block w-full px-4 py-2 bg-red-600 text-white text-center rounded-lg"
        >
          登出
        </button>
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
import { ref } from "vue";
import { Menu, X, Map, Package, Utensils, User, Bell } from "lucide-vue-next"; // Importing icons from lucide-vue-next
import { useAuthStore } from "~/stores/auth";

const router = useRouter();
const authStore = useAuthStore();
const isMenuOpen = ref(false);
const showLogoutConfirm = ref(false);
const isAuthenticated = ref(false);

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

function confirmLogout() {
  showLogoutConfirm.value = true;
  isMenuOpen.value = false; // 如果是行動版，關閉選單
}

function handleLogout() {
  authStore.logout();
  showLogoutConfirm.value = false;
  isAuthenticated.value = false;
  router.push("/"); // 登出後導向首頁
}
</script>
