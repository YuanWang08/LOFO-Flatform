<template>
  <div class="container mx-auto px-4 py-8">
    <div v-if="loading" class="flex justify-center items-center min-h-screen">
      <div
        class="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"
      ></div>
    </div>

    <div v-else-if="error" class="text-center p-8 bg-red-100 rounded-lg">
      <h1 class="text-2xl font-bold text-red-700">{{ error }}</h1>
      <button
        @click="$router.push('/items')"
        class="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        返回物品列表
      </button>
    </div>

    <div v-else class="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <h1 class="text-2xl font-bold mb-6 text-gray-800">編輯物品資訊</h1>

      <div class="border p-4 rounded-lg mb-6 bg-yellow-50">
        <p class="text-amber-700">
          注意：物品標題和圖片一旦發布後不能修改。如需更改，請撤回物品並重新發布。
        </p>
      </div>

      <div class="mb-6">
        <h2 class="text-xl font-semibold mb-2 text-gray-700">
          物品標題與圖片 (不可修改)
        </h2>
        <div class="flex items-center mb-4">
          <div class="w-1/3">
            <img
              :src="formatImageUrl(item.image_url) || '/images/placeholder.png'"
              alt="物品圖片"
              class="rounded-lg object-cover h-48 w-full"
            />
          </div>
          <div class="w-2/3 pl-4">
            <p class="text-gray-700 font-semibold mb-2">標題:</p>
            <p class="text-gray-900 mb-4">{{ item.title }}</p>
          </div>
        </div>
      </div>

      <form @submit.prevent="updateItem" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- 分類 -->
          <div>
            <label for="category" class="block text-gray-700 font-medium mb-2"
              >分類</label
            >
            <select
              id="category"
              v-model="formData.category"
              class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="electronics">電子產品</option>
              <option value="clothing">衣物</option>
              <option value="books">書籍</option>
              <option value="accessories">配件</option>
              <option value="stationery">文具</option>
              <option value="others">其他</option>
            </select>
          </div>

          <!-- 地點 -->
          <div>
            <label for="location" class="block text-gray-700 font-medium mb-2"
              >地點</label
            >
            <input
              id="location"
              type="text"
              v-model="formData.location"
              class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="物品所在地點"
            />
          </div>
          <!-- 經緯度選取器 -->
          <div class="md:col-span-2">
            <label class="block text-gray-700 font-medium mb-2">位置座標</label>
            <LocationPicker
              :latitude="formData.latitude"
              :longitude="formData.longitude"
              @update:coordinates="
                (coords) => {
                  formData.latitude = coords.latitude;
                  formData.longitude = coords.longitude;
                }
              "
            />
          </div>

          <!-- 發現時間 -->
          <div>
            <label
              for="discover_time"
              class="block text-gray-700 font-medium mb-2"
              >發現時間</label
            >
            <input
              id="discover_time"
              type="datetime-local"
              v-model="formData.discover_time"
              class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <!-- 物品狀態 -->
          <div>
            <label for="status" class="block text-gray-700 font-medium mb-2"
              >物品狀態</label
            >
            <select
              id="status"
              v-model="formData.status"
              class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="available">可認領</option>
              <option value="pending">等待認領確認</option>
              <option value="claimed">已認領</option>
              <option value="closed">已關閉</option>
            </select>
          </div>

          <!-- 是否攜帶於身 -->
          <div>
            <label class="block text-gray-700 font-medium mb-2"
              >是否攜帶於身</label
            >
            <div class="flex space-x-4">
              <label class="inline-flex items-center">
                <input
                  type="radio"
                  v-model="formData.is_with_owner"
                  :value="true"
                  class="form-radio h-5 w-5 text-blue-600"
                />
                <span class="ml-2">是</span>
              </label>
              <label class="inline-flex items-center">
                <input
                  type="radio"
                  v-model="formData.is_with_owner"
                  :value="false"
                  class="form-radio h-5 w-5 text-blue-600"
                />
                <span class="ml-2">否</span>
              </label>
            </div>
          </div>

          <!-- 允許私訊聯繫 -->
          <div>
            <label class="block text-gray-700 font-medium mb-2"
              >允許私訊聯繫</label
            >
            <div class="flex space-x-4">
              <label class="inline-flex items-center">
                <input
                  type="radio"
                  v-model="formData.allow_message"
                  :value="true"
                  class="form-radio h-5 w-5 text-blue-600"
                />
                <span class="ml-2">是</span>
              </label>
              <label class="inline-flex items-center">
                <input
                  type="radio"
                  v-model="formData.allow_message"
                  :value="false"
                  class="form-radio h-5 w-5 text-blue-600"
                />
                <span class="ml-2">否</span>
              </label>
            </div>
          </div>
        </div>

        <!-- 關鍵字標籤 -->
        <div>
          <label for="keywords" class="block text-gray-700 font-medium mb-2"
            >關鍵字標籤</label
          >
          <div class="flex flex-wrap items-center mb-2">
            <div
              v-for="(keyword, index) in formData.keywords"
              :key="index"
              class="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm mr-2 mb-2 flex items-center"
            >
              {{ keyword }}
              <button
                type="button"
                @click="removeKeyword(index)"
                class="ml-1 text-blue-600 hover:text-blue-800 focus:outline-none"
              >
                ×
              </button>
            </div>
            <input
              v-model="newKeyword"
              @keydown.enter.prevent="addKeyword"
              placeholder="新增關鍵字並按Enter"
              class="border px-3 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm mb-2"
            />
          </div>
        </div>

        <!-- 聯絡方式 -->
        <div>
          <label for="contact" class="block text-gray-700 font-medium mb-2"
            >聯絡方式</label
          >
          <input
            id="contact"
            type="text"
            v-model="formData.contact"
            class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="可填寫電話或其他聯絡方式"
          />
        </div>

        <!-- 描述 -->
        <div>
          <label for="description" class="block text-gray-700 font-medium mb-2"
            >物品描述</label
          >
          <textarea
            id="description"
            v-model="formData.description"
            rows="5"
            class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="請描述物品特徵、發現地點詳細資訊等"
          ></textarea>
        </div>

        <div class="flex justify-end space-x-4">
          <button
            type="button"
            @click="$router.push(`/items/${id}`)"
            class="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            取消
          </button>
          <button
            type="submit"
            class="px-6 py-2 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            :disabled="submitting"
          >
            {{ submitting ? "儲存中..." : "儲存變更" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useRuntimeConfig, useCookie } from "#app";
import { useAuthStore } from "~/stores/auth";

const config = useRuntimeConfig();
const route = useRoute();
const router = useRouter();
const id = computed(() => route.params.id);

const item = ref({});
const formData = reactive({
  title: "",
  category: "",
  location: "",
  discover_time: "",
  latitude: 0,
  longitude: 0,
  description: "",
  contact: "",
  status: "available",
  is_with_owner: false,
  allow_message: true,
  keywords: [],
});

const loading = ref(true);
const submitting = ref(false);
const error = ref(null);
const newKeyword = ref("");

// 格式化圖片URL
const formatImageUrl = (url) => {
  if (!url) return "";

  // 如果已經是完整URL，直接返回
  if (url.startsWith("http")) {
    return url;
  }

  // 否則拼接後端base URL
  return `${config.public.BACKEND_BASE_URL}${url}`;
};

// 獲取物品原始資料
const fetchItem = async () => {
  loading.value = true;
  error.value = null;
  try {
    const response = await fetch(
      `${config.public.BACKEND_BASE_URL}/items/${id.value}`
    );
    if (!response.ok) {
      throw new Error(
        response.status === 404 ? "找不到指定物品" : "無法獲取物品資訊"
      );
    }

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message || "獲取物品資訊失敗");
    }

    item.value = data.data;

    // 將資料填入表單
    formData.title = item.value.title;
    formData.category = item.value.category;
    formData.location = item.value.location;
    formData.discover_time = formatDateTime(item.value.discover_time);
    formData.latitude = item.value.latitude;
    formData.longitude = item.value.longitude;
    formData.description = item.value.description;
    formData.contact = item.value.contact;
    formData.status = item.value.status;
    formData.is_with_owner = item.value.is_with_owner;
    formData.allow_message = item.value.allow_message;
    formData.keywords = Array.isArray(item.value.keywords)
      ? [...item.value.keywords]
      : [];
  } catch (err) {
    console.error("獲取物品失敗:", err);
    error.value = err.message || "獲取物品資訊時發生錯誤";
  } finally {
    loading.value = false;
  }
};

// 更新物品
const updateItem = async () => {
  submitting.value = true;
  try {
    // 移除不需要更新的欄位
    const payload = { ...formData };
    delete payload.title; // 標題不能被修改

    const authCookie = useCookie("auth_token");

    const response = await fetch(
      `${config.public.BACKEND_BASE_URL}/items/${id.value}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authCookie.value}`,
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      throw new Error(
        response.status === 403 ? "您沒有權限更新這個物品" : "無法更新物品資訊"
      );
    }

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message || "更新物品資訊失敗");
    }

    // 更新成功，跳轉回物品詳情頁
    router.push(`/items/${id.value}`);
  } catch (err) {
    console.error("更新物品失敗:", err);
    alert(err.message || "更新物品時發生錯誤");
  } finally {
    submitting.value = false;
  }
};

// 格式化日期時間為 input datetime-local 格式
const formatDateTime = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toISOString().slice(0, 16);
};

// 添加關鍵字
const addKeyword = () => {
  if (
    newKeyword.value.trim() &&
    !formData.keywords.includes(newKeyword.value.trim())
  ) {
    formData.keywords.push(newKeyword.value.trim());
    newKeyword.value = "";
  }
};

// 移除關鍵字
const removeKeyword = (index) => {
  formData.keywords.splice(index, 1);
};

onMounted(() => {
  fetchItem();
});
</script>
