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
        @click="$router.push('/foods')"
        class="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        返回食物列表
      </button>
    </div>

    <div v-else class="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <h1 class="text-2xl font-bold mb-6 text-gray-800">編輯食物資訊</h1>

      <div class="border p-4 rounded-lg mb-6 bg-yellow-50">
        <p class="text-amber-700">
          注意：食物標題和圖片一旦發布後不能修改。如需更改，請撤回食物並重新發布。
        </p>
      </div>
      <div class="mb-6">
        <h2 class="text-xl font-semibold mb-2 text-gray-700">
          食物資訊 (不可修改)
        </h2>
        <!-- 標題 -->
        <div class="mb-4">
          <h1 class="text-2xl font-bold text-gray-900">{{ food.title }}</h1>
        </div>
        <!-- 圖片 -->
        <div class="mb-4">
          <img
            :src="formatImageUrl(food.image_url) || '/images/placeholder.png'"
            alt="食物圖片"
            class="rounded-lg object-contain max-h-72 w-auto mx-auto"
          />
        </div>
      </div>

      <form @submit.prevent="updateFood" class="space-y-6">
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
              <option value="fruits">水果</option>
              <option value="vegetables">蔬菜</option>
              <option value="dairy">乳製品</option>
              <option value="meat">肉類</option>
              <option value="seafood">海鮮</option>
              <option value="grains">穀物</option>
              <option value="snacks">零食</option>
              <option value="drinks">飲料</option>
              <option value="cooked">熟食</option>
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
              placeholder="食物所在地點"
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

          <!-- 到期日期 -->
          <div>
            <label
              for="expire_date"
              class="block text-gray-700 font-medium mb-2"
              >到期日期</label
            >
            <input
              id="expire_date"
              type="date"
              v-model="formData.expire_date"
              class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <!-- 食物狀態 -->
          <div>
            <label for="status" class="block text-gray-700 font-medium mb-2"
              >食物狀態</label
            >
            <select
              id="status"
              v-model="formData.status"
              class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="available">可預約</option>
              <option value="reserved">已預約</option>
              <option value="shared">已分享</option>
              <option value="expired">已過期</option>
              <option value="withdrawn">已撤回</option>
            </select>
          </div>

          <!-- 數量 -->
          <div>
            <label for="quantity" class="block text-gray-700 font-medium mb-2"
              >數量</label
            >
            <input
              id="quantity"
              type="number"
              v-model="formData.quantity"
              min="1"
              class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="提供的數量"
            />
          </div>

          <!-- 領取方式 -->
          <div>
            <label
              for="pickup_method"
              class="block text-gray-700 font-medium mb-2"
              >領取方式</label
            >
            <select
              id="pickup_method"
              v-model="formData.pickup_method"
              class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="self-pickup">自取</option>
              <option value="delivery">外送</option>
              <option value="both">兩者皆可</option>
            </select>
          </div>
        </div>

        <!-- 描述 -->
        <div>
          <label for="description" class="block text-gray-700 font-medium mb-2"
            >食物描述</label
          >
          <textarea
            id="description"
            v-model="formData.description"
            rows="5"
            class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="請描述食物特徵、保存情況等資訊"
          ></textarea>
        </div>

        <div class="flex justify-end space-x-4">
          <button
            type="button"
            @click="$router.push(`/foods/${id}`)"
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

const config = useRuntimeConfig();
const route = useRoute();
const router = useRouter();
const id = computed(() => route.params.id);

const food = ref({});
const formData = reactive({
  title: "",
  category: "",
  location: "",
  expire_date: "",
  latitude: 0,
  longitude: 0,
  description: "",
  quantity: 1,
  status: "available",
  pickup_method: "self-pickup",
});

const loading = ref(true);
const submitting = ref(false);
const error = ref(null);

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

// 獲取食物原始資料
const fetchFood = async () => {
  loading.value = true;
  error.value = null;

  try {
    const response = await fetch(
      `${config.public.BACKEND_BASE_URL}/foods/${id.value}`
    );
    if (!response.ok) {
      throw new Error(
        response.status === 404 ? "找不到指定食物" : "無法獲取食物資訊"
      );
    }

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message || "獲取食物資訊失敗");
    }
    food.value = data.data;

    // 將資料填入表單，確保每個欄位都有默認值
    formData.title = food.value.title || "";
    formData.category = food.value.category || "fruits";
    formData.location = food.value.location || "";
    formData.expire_date = formatDate(food.value.expire_date) || "";
    formData.latitude = food.value.latitude || 0;
    formData.longitude = food.value.longitude || 0;
    formData.description = food.value.description || "";
    formData.quantity = food.value.quantity || 1;
    formData.status = food.value.status || "available";
    formData.pickup_method = food.value.pickup_method || "self-pickup";
  } catch (err) {
    console.error("獲取食物失敗:", err);
    error.value = err.message || "獲取食物資訊時發生錯誤";
  } finally {
    loading.value = false;
  }
};

// 更新食物
const updateFood = async () => {
  submitting.value = true;

  try {
    // 移除不需要更新的欄位
    const payload = { ...formData };
    delete payload.title; // 標題不能被修改

    const authCookie = useCookie("auth_token");

    const response = await fetch(
      `${config.public.BACKEND_BASE_URL}/foods/${id.value}`,
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
        response.status === 403 ? "您沒有權限更新這個食物" : "無法更新食物資訊"
      );
    }

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message || "更新食物資訊失敗");
    }

    // 更新成功，跳轉回食物詳情頁
    router.push(`/foods/${id.value}`);
  } catch (err) {
    console.error("更新食物失敗:", err);
    alert(err.message || "更新食物時發生錯誤");
  } finally {
    submitting.value = false;
  }
};

// 格式化日期為 input date 格式 (YYYY-MM-DD)
const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toISOString().split("T")[0];
};

onMounted(() => {
  fetchFood();
});
</script>
