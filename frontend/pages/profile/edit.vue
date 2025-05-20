<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-4xl mx-auto">
      <!-- 頁面標題 -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-800">編輯個人資料</h1>
        <p class="text-gray-600 mt-2">更新您的個人資訊</p>
      </div>

      <!-- 主要表單卡片 -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <div v-if="loading" class="flex justify-center items-center py-8">
          <div
            class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"
          ></div>
        </div>

        <div
          v-else-if="error"
          class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
        >
          <p>{{ error }}</p>
          <button
            @click="fetchUserInfo"
            class="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            重新載入
          </button>
        </div>

        <form v-else @submit.prevent="saveProfile" class="space-y-6">
          <!-- 頭像上傳區域 -->
          <div class="flex flex-col items-center mb-6">
            <div class="relative mb-4">
              <div
                class="w-32 h-32 rounded-full overflow-hidden bg-gray-200 border-4 border-white shadow"
              >
                <img
                  :src="formatImageUrl(form.avatar_url)"
                  alt="用戶頭像"
                  class="w-full h-full object-cover"
                />
              </div>
              <button
                type="button"
                @click="openFileInput"
                class="absolute bottom-0 right-0 bg-emerald-600 text-white p-2 rounded-full shadow-md hover:bg-emerald-700 transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </button>
              <input
                ref="fileInput"
                type="file"
                accept="image/*"
                @change="handleFileUpload"
                class="hidden"
              />
            </div>
            <p class="text-gray-600 text-sm">點擊圖標更改頭像</p>
          </div>

          <!-- 基本資料表單 -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- 識別符（不可編輯） -->
            <div>
              <label
                for="identifier"
                class="block text-sm font-medium text-gray-700 mb-1"
                >識別符</label
              >
              <input
                type="text"
                id="identifier"
                v-model="form.identifier"
                disabled
                class="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500"
              />
              <p class="mt-1 text-xs text-gray-500">識別符無法更改</p>
            </div>

            <!-- 暱稱 -->
            <div>
              <label
                for="nickname"
                class="block text-sm font-medium text-gray-700 mb-1"
                >暱稱</label
              >
              <input
                type="text"
                id="nickname"
                v-model="form.nickname"
                class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="請輸入您的暱稱"
              />
              <p class="mt-1 text-xs text-gray-500">
                此暱稱將顯示在您的個人資料頁面
              </p>
            </div>

            <!-- 電子郵件 -->
            <div>
              <label
                for="email"
                class="block text-sm font-medium text-gray-700 mb-1"
                >電子郵件</label
              >
              <input
                type="email"
                id="email"
                v-model="form.email"
                class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="請輸入您的電子郵件"
              />
              <p class="mt-1 text-xs text-gray-500">用於接收通知和系統訊息</p>
            </div>

            <!-- 聯絡電話 -->
            <div>
              <label
                for="phone"
                class="block text-sm font-medium text-gray-700 mb-1"
                >聯絡電話</label
              >
              <input
                type="tel"
                id="phone"
                v-model="form.phone"
                class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="請輸入您的聯絡電話"
              />
              <p class="mt-1 text-xs text-gray-500">用於緊急聯繫</p>
            </div>
          </div>

          <!-- 自我介紹 -->
          <div>
            <label
              for="bio"
              class="block text-sm font-medium text-gray-700 mb-1"
              >自我介紹</label
            >
            <textarea
              id="bio"
              v-model="form.bio"
              rows="4"
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="請簡單介紹您自己"
            ></textarea>
            <p class="mt-1 text-xs text-gray-500">讓其他使用者更了解您</p>
          </div>

          <!-- Discord Webhook -->
          <div>
            <label
              for="discord"
              class="block text-sm font-medium text-gray-700 mb-1"
              >Discord Webhook</label
            >
            <input
              type="text"
              id="discord"
              v-model="form.discord_webhook"
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="請輸入您的 Discord Webhook URL"
            />
            <p class="mt-1 text-xs text-gray-500">用於接收 Discord 通知</p>
          </div>

          <!-- 操作按鈕 -->
          <div class="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              @click="resetForm"
              class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
            >
              取消變更
            </button>
            <button
              type="submit"
              :disabled="isSaving"
              class="px-6 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors disabled:opacity-50"
            >
              {{ isSaving ? "儲存中..." : "儲存變更" }}
            </button>
          </div>
        </form>
      </div>

      <!-- 變更密碼區塊 -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 class="text-xl font-semibold mb-4 text-gray-800">變更密碼</h2>
        <p class="text-gray-600 mb-6">如需變更密碼，請點擊下方按鈕</p>

        <NuxtLink to="/profile/change-password">
          <button
            class="px-6 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
          >
            前往變更密碼
          </button>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useRuntimeConfig, useCookie } from "#app";
import { useAuthStore } from "~/stores/auth";
import Swal from "sweetalert2";

const router = useRouter();
const config = useRuntimeConfig();
const authStore = useAuthStore();
const fileInput = ref(null);

// 格式化圖片URL
const formatImageUrl = (url) => {
  if (!url) return "/placeholder.svg?height=200&width=300";

  // 如果已經是完整URL，直接返回
  if (url.startsWith("http")) {
    return url;
  }

  // 否則拼接後端base URL
  return `${config.public.BACKEND_BASE_URL}${url}`;
};

// 表單數據
const form = reactive({
  nickname: "",
  email: "",
  avatar_url: "",
  phone: "",
  bio: "",
  discord_webhook: "",
  identifier: "",
});

// 狀態變數
const loading = ref(true);
const error = ref(null);
const isSaving = ref(false);

// 在頁面加載時獲取用戶資料
onMounted(() => {
  fetchUserInfo();
});

// 獲取用戶資料
const fetchUserInfo = async () => {
  loading.value = true;
  error.value = null;

  try {
    if (!authStore.isAuthenticated) {
      router.push("/login");
      return;
    }

    const token = useCookie("auth_token").value;
    const response = await fetch(
      `${config.public.BACKEND_BASE_URL}/user/info`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (response.ok) {
      const userData = data.dataValues || data; // 填充表單數據
      form.nickname = userData.nickname || "";
      form.email = userData.email || "";
      form.avatar_url = userData.avatar_url || "";
      form.phone = userData.phone || "";
      form.bio = userData.description || "";
      form.discord_webhook = userData.discord_webhook || "";
      form.identifier = userData.identifier || "";
    } else {
      error.value = data.message || "獲取用戶資料失敗";
      console.error("Failed to fetch user info:", data);
    }
  } catch (err) {
    error.value = "網絡錯誤，請稍後再試";
    console.error("Error fetching user info:", err);
  } finally {
    loading.value = false;
  }
};

// 上傳頭像
const openFileInput = () => {
  fileInput.value.click();
};

const handleFileUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  // 檢查檔案類型和大小
  if (!file.type.match("image.*")) {
    Swal.fire({
      icon: "error",
      title: "格式錯誤",
      text: "請上傳圖片檔案",
      confirmButtonColor: "#10b981",
    });
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    // 5MB 限制
    Swal.fire({
      icon: "error",
      title: "檔案過大",
      text: "檔案大小不能超過 5MB",
      confirmButtonColor: "#10b981",
    });
    return;
  }

  try {
    // 顯示本地預覽
    const reader = new FileReader();
    reader.onload = (e) => {
      form.avatar_url = e.target.result;
    };
    reader.readAsDataURL(file); // 上傳到後端
    const formData = new FormData();
    formData.append("avatar", file);

    const token = useCookie("auth_token").value;
    const response = await fetch(
      `${config.public.BACKEND_BASE_URL}/user/avatar`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );
    const data = await response.json();
    if (response.ok) {
      console.log("頭像上傳成功:", data);
      // 更新頭像URL為服務器上的真實路徑
      if (data.data && data.data.avatar_url) {
        form.avatar_url = data.data.avatar_url;
        // 同時更新 authStore 中的頭像
        authStore.updateUserInfo({
          avatar_url: data.data.avatar_url,
        });
      }
    } else {
      Swal.fire({
        icon: "error",
        title: "上傳失敗",
        text: data.message || "頭像上傳失敗",
        confirmButtonColor: "#10b981",
      });
      console.error("頭像上傳失敗:", data);
    }
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "上傳失敗",
      text: "頭像上傳失敗，請稍後再試",
      confirmButtonColor: "#10b981",
    });
    console.error("頭像上傳錯誤:", error);
  }
};

// 重置表單
const resetForm = () => {
  fetchUserInfo();
};

// 儲存個人資料
const saveProfile = async () => {
  isSaving.value = true;

  try {
    const token = useCookie("auth_token").value;
    const userData = {
      nickname: form.nickname,
      email: form.email,
      phone: form.phone,
      description: form.bio, // 映射到後端的 description 字段
      discord_webhook: form.discord_webhook,
    };

    const response = await fetch(
      `${config.public.BACKEND_BASE_URL}/user/update`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      }
    );
    const data = await response.json();
    if (response.ok) {
      Swal.fire({
        icon: "success",
        title: "成功",
        text: "個人資料更新成功!",
        confirmButtonColor: "#10b981",
      });
      console.log("個人資料更新成功:", data);

      // 更新 authStore 中的用戶資訊
      authStore.updateUserInfo({
        nickname: form.nickname,
        email: form.email,
        avatar_url: form.avatar_url,
        description: form.bio,
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "更新失敗",
        text: data.message || "更新失敗，請稍後再試",
        confirmButtonColor: "#10b981",
      });
      console.error("更新失敗:", data);
    }
  } catch (err) {
    Swal.fire({
      icon: "error",
      title: "更新失敗",
      text: "更新失敗，請稍後再試",
      confirmButtonColor: "#10b981",
    });
    console.error("Error updating profile:", err);
  } finally {
    isSaving.value = false;
  }
};
</script>
