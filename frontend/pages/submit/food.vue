<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-6">登記資訊</h1>

    <div class="flex justify-center mb-6">
      <div class="w-full max-w-md">
        <div class="grid grid-cols-2 bg-gray-100 p-1 rounded-lg">
          <NuxtLink
            to="/submit/item"
            class="flex items-center justify-center gap-2 py-2 rounded-md transition-colors"
            :class="isItemActive ? 'bg-white shadow-sm' : 'hover:bg-gray-50'"
          >
            <Package size="18" />
            <span>遺失物刊登</span>
          </NuxtLink>
          <NuxtLink
            to="/submit/food"
            class="flex items-center justify-center gap-2 py-2 rounded-md transition-colors"
            :class="isFoodActive ? 'bg-white shadow-sm' : 'hover:bg-gray-50'"
          >
            <Utensils size="18" />
            <span>食物分享</span>
          </NuxtLink>
        </div>
      </div>
    </div>

    <div class="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <form @submit.prevent="handleSubmit">
        <div class="mb-6">
          <label for="image" class="block text-sm font-medium mb-2">
            上傳食物照片
          </label>
          <div
            class="mt-1 border-2 border-dashed border-gray-300 rounded-lg p-6 transition-colors"
            :class="{ 'border-emerald-500 bg-emerald-50': isDragging }"
            @dragover.prevent="isDragging = true"
            @dragleave.prevent="isDragging = false"
            @drop.prevent="handleFileDrop"
          >
            <div class="text-center">
              <Upload class="mx-auto h-12 w-12 text-gray-400" />
              <div class="mt-2 flex justify-center text-sm text-gray-600">
                <label
                  for="image-upload-food"
                  class="relative cursor-pointer rounded-md font-medium text-emerald-600 hover:text-emerald-500"
                >
                  <span>點擊上傳照片</span>
                  <input
                    id="image-upload-food"
                    type="file"
                    accept="image/*"
                    class="sr-only"
                    @change="handleImageChange"
                  />
                </label>
                <p class="pl-1">或將檔案拖曳至此處</p>
              </div>
              <p class="text-xs text-gray-500">支援PNG、JPG、GIF等圖片格式</p>
            </div>
          </div>
          <div v-if="previewImage" class="mt-3">
            <div class="relative">
              <img
                :src="previewImage"
                alt="Preview"
                class="h-40 w-auto rounded-md object-cover"
              />
              <button
                type="button"
                @click="removeImage"
                class="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
              >
                <X size="16" class="text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        <div class="mb-6">
          <label for="title" class="block text-sm font-medium mb-2">
            食物名稱
          </label>
          <input
            id="title"
            v-model="title"
            placeholder="例如：披薩、便當、麵包"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            required
          />
        </div>

        <!-- 食物類別 -->
        <div class="mb-6">
          <label for="category" class="block text-sm font-medium mb-2">
            食物類別
          </label>
          <select
            id="category"
            v-model="category"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            required
          >
            <option value="即期品">即期品</option>
            <option value="水果">水果</option>
            <option value="蔬菜">蔬菜</option>
            <option value="飲料">飲料</option>
            <option value="零食">零食</option>
            <option value="烘焙食品">烘焙食品</option>
            <option value="剩菜">剩菜</option>
          </select>
        </div>

        <!-- 食物描述 -->
        <div class="mb-6">
          <label for="description" class="block text-sm font-medium mb-2">
            食物描述
          </label>
          <textarea
            id="description"
            v-model="description"
            placeholder="請詳細描述食物的內容、新鮮度、是否為素食等資訊"
            rows="4"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            required
          ></textarea>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label for="quantity" class="block text-sm font-medium mb-2">
              份數
            </label>
            <input
              id="quantity"
              v-model="quantity"
              type="number"
              min="1"
              placeholder="可分享的份數"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>
          <div>
            <label for="expire_date" class="block text-sm font-medium mb-2">
              有效期限
            </label>
            <input
              id="expire_date"
              v-model="expire_date"
              type="datetime-local"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>
        </div>

        <!-- 取用方法 -->
        <div class="mb-6">
          <label class="block text-sm font-medium mb-2">取用方法</label>
          <div class="flex items-center space-x-4">
            <div class="flex items-center">
              <input
                id="pickup-self"
                v-model="pickup_method"
                type="radio"
                value="self"
                name="pickup-method"
                class="h-4 w-4 text-emerald-600 border-gray-300 focus:ring-emerald-500"
              />
              <label for="pickup-self" class="ml-2 block text-sm text-gray-700">
                自取（不需預約直接前往）
              </label>
            </div>
            <div class="flex items-center">
              <input
                id="pickup-reserve"
                v-model="pickup_method"
                type="radio"
                value="reserve"
                name="pickup-method"
                class="h-4 w-4 text-emerald-600 border-gray-300 focus:ring-emerald-500"
              />
              <label
                for="pickup-reserve"
                class="ml-2 block text-sm text-gray-700"
              >
                預約（需要先預約再取用）
              </label>
            </div>
          </div>
        </div>

        <!-- 允許私訊 -->
        <div class="mb-6">
          <label class="block text-sm font-medium mb-2">允許私訊</label>
          <div
            v-if="pickup_method === 'reserve'"
            class="p-3 bg-gray-50 border border-gray-200 rounded-md"
          >
            <div class="flex items-center">
              <input
                id="allow-message"
                v-model="allow_message"
                type="radio"
                :value="true"
                name="allow-message"
                class="h-4 w-4 text-emerald-600 border-gray-300 focus:ring-emerald-500"
                checked
                disabled
              />
              <label
                for="allow-message"
                class="ml-2 block text-sm text-gray-700"
              >
                預約取用必須允許其他使用者傳送私訊給您
              </label>
            </div>
          </div>
          <div v-else class="flex items-center space-x-4">
            <div class="flex items-center">
              <input
                id="allow-message-yes"
                v-model="allow_message"
                type="radio"
                :value="true"
                name="allow-message"
                class="h-4 w-4 text-emerald-600 border-gray-300 focus:ring-emerald-500"
              />
              <label
                for="allow-message-yes"
                class="ml-2 block text-sm text-gray-700"
              >
                允許其他使用者傳送私訊給我
              </label>
            </div>
            <div class="flex items-center">
              <input
                id="allow-message-no"
                v-model="allow_message"
                type="radio"
                :value="false"
                name="allow-message"
                class="h-4 w-4 text-emerald-600 border-gray-300 focus:ring-emerald-500"
              />
              <label
                for="allow-message-no"
                class="ml-2 block text-sm text-gray-700"
              >
                不允許私訊
              </label>
            </div>
          </div>
        </div>

        <div class="mb-6">
          <label class="block text-sm font-medium mb-2">分享地點</label>
          <div class="mb-2 text-sm text-gray-600 flex items-center">
            <MapPin size="16" class="mr-1" />
            <span>請在地圖上標記位置</span>
          </div>
          <client-only>
            <LocationPicker @location-select="setLocation" />
          </client-only>
          <p v-if="location" class="mt-2 text-sm text-gray-600">
            已選擇位置：{{ latitude }}, {{ longitude }}
          </p>
        </div>

        <!-- 地點詳細描述 -->
        <div class="mb-6">
          <label
            for="locationDescription"
            class="block text-sm font-medium mb-2"
          >
            地點詳細描述
          </label>
          <input
            id="locationDescription"
            v-model="locationDescription"
            placeholder="請描述詳細地點，如：第一教學大樓2樓餐廳"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            required
          />
        </div>

        <div class="mt-8">
          <button
            type="submit"
            class="w-full px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md transition-colors"
            :disabled="isSubmitting"
          >
            <div v-if="isSubmitting" class="flex items-center justify-center">
              <Loader2 class="mr-2 h-4 w-4 animate-spin" />
              處理中...
            </div>
            <span v-else>提交分享</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Upload, MapPin, Loader2, Package, Utensils, X } from "lucide-vue-next";

const route = useRoute();
const router = useRouter();
const config = useRuntimeConfig();

const isItemActive = computed(() => route.path === "/submit/item");
const isFoodActive = computed(() => route.path === "/submit/food");

const title = ref("");
const description = ref("");
const quantity = ref(1); // 改為 quantity 與後端保持一致
const expire_date = ref(""); // 改為 expire_date 與後端保持一致
const location = ref(null);
const latitude = ref("");
const longitude = ref("");
const locationDescription = ref("");
const isSubmitting = ref(false);
const previewImage = ref(null);
const isDragging = ref(false);
const imageFile = ref(null);
const category = ref("即期品"); // 預設食物類別
const pickup_method = ref("self"); // 預設取用方法
const allow_message = ref(false); // 預設不允許私訊

// 監聽取用方法變更，當選擇"預約"時自動設置allow_message為true
watch(pickup_method, (newVal) => {
  if (newVal === "reserve") {
    allow_message.value = true;
  }
});

// 設置預設日期時間為當前時間
onMounted(() => {
  // 獲取當前日期和時間
  const now = new Date();

  // 格式化為 datetime-local 輸入框所需的格式 (YYYY-MM-DDThh:mm)
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");

  // 設置為默認值
  expire_date.value = `${year}-${month}-${day}T${hours}:${minutes}`;
});

const handleImageChange = (e) => {
  const file = e.target.files?.[0];
  if (file) {
    processSelectedFile(file);
  }
};

const handleFileDrop = (e) => {
  isDragging.value = false;
  const file = e.dataTransfer.files?.[0];
  if (file && file.type.startsWith("image/")) {
    processSelectedFile(file);
  }
};

const processSelectedFile = (file) => {
  imageFile.value = file;
  const reader = new FileReader();
  reader.onloadend = () => {
    previewImage.value = reader.result;
  };
  reader.readAsDataURL(file);
};

const removeImage = () => {
  imageFile.value = null;
  previewImage.value = null;
};

const setLocation = (loc) => {
  location.value = loc;
  latitude.value = loc[0].toFixed(6);
  longitude.value = loc[1].toFixed(6);
};

const handleSubmit = async () => {
  isSubmitting.value = true;

  try {
    // 取得認證 Token
    const authCookie = useCookie("auth_token");

    if (!authCookie.value) {
      alert("您需要先登入才能提交食物分享資訊");
      router.push("/login");
      return;
    }

    // 建立表單數據
    const formData = new FormData();
    formData.append("title", title.value);
    formData.append("category", category.value);
    formData.append("description", description.value);
    formData.append("quantity", quantity.value);
    formData.append("expire_date", expire_date.value);
    formData.append("location", locationDescription.value);
    formData.append("latitude", latitude.value);
    formData.append("longitude", longitude.value);
    formData.append("pickup_method", pickup_method.value);
    formData.append("allow_message", allow_message.value);

    // 設置食物狀態為 'active'
    formData.append("status", "active");

    if (imageFile.value) {
      formData.append("image", imageFile.value);
    }

    // 使用環境設定的後端API端點並添加認證標頭
    const response = await fetch(`${config.public.BACKEND_BASE_URL}/foods`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authCookie.value}`,
        // 不要設置 Content-Type，因為 FormData 會自動設置正確的 multipart/form-data
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error("伺服器回應錯誤");
    }

    const result = await response.json();
    console.log("提交成功:", result);

    isSubmitting.value = false;
    alert("食物分享已成功登記！");

    // 提交成功後導航到食物頁面
    router.push("/foods");
  } catch (error) {
    console.error("提交失敗:", error);
    isSubmitting.value = false;
    alert("提交失敗，請稍後再試");
  }
};
</script>
