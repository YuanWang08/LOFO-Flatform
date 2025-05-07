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
            上傳物品照片
          </label>
          <div class="mt-1 flex items-center">
            <label
              for="image-upload"
              class="cursor-pointer bg-white border border-gray-300 rounded-md py-2 px-3 flex items-center justify-center text-sm text-gray-700 hover:bg-gray-50"
            >
              <Upload size="16" class="mr-2" />
              <span>選擇照片</span>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                class="sr-only"
                @change="handleImageChange"
              />
            </label>
          </div>
          <div v-if="previewImage" class="mt-3">
            <img
              :src="previewImage"
              alt="Preview"
              class="h-40 w-auto rounded-md object-cover"
            />
          </div>
        </div>

        <div class="mb-6">
          <h2 class="text-xl font-semibold mb-4">物品狀態</h2>
          <div class="flex space-x-4">
            <div class="flex items-center space-x-2">
              <input
                type="radio"
                id="found"
                value="found"
                v-model="itemType"
                class="h-4 w-4 text-emerald-600 focus:ring-emerald-500"
              />
              <label for="found" class="cursor-pointer"> 我撿到了物品 </label>
            </div>
            <div class="flex items-center space-x-2">
              <input
                type="radio"
                id="lost"
                value="lost"
                v-model="itemType"
                class="h-4 w-4 text-emerald-600 focus:ring-emerald-500"
              />
              <label for="lost" class="cursor-pointer"> 我遺失了物品 </label>
            </div>
          </div>
        </div>

        <div class="mb-6">
          <label for="title" class="block text-sm font-medium mb-2">
            物品名稱
          </label>
          <input
            id="title"
            v-model="title"
            placeholder="例如：黑色皮夾、AirPods、學生證"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            required
          />
        </div>

        <!-- 物品類別 -->
        <div class="mb-6">
          <label class="block text-sm font-medium mb-2">物品類別</label>
          <select
            v-model="category"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            required
          >
            <option value="有價票券">有價票券</option>
            <option value="3C電子">3C電子</option>
            <option value="身分證件">身分證件</option>
            <option value="運動物品">運動物品</option>
            <option value="眼鏡服裝">眼鏡服裝</option>
            <option value="文具書籍">文具書籍</option>
            <option value="保溫瓶">保溫瓶</option>
            <option value="手錶">手錶</option>
            <option value="鑰匙">鑰匙</option>
            <option value="雨傘">雨傘</option>
            <option value="其他">其他</option>
          </select>
        </div>

        <!-- 關鍵字 -->
        <div class="mb-6">
          <label class="block text-sm font-medium mb-2">建立關鍵字</label>
          <div class="flex items-center space-x-2">
            <input
              v-model="keywordInput"
              type="text"
              placeholder="輸入關鍵字後按Enter"
              class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              @keydown.enter.prevent="addKeyword"
            />
            <button
              type="button"
              @click="addKeyword"
              class="px-3 py-2 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none"
            >
              <Plus size="16" />
            </button>
          </div>
          <div class="mt-2 flex flex-wrap gap-2">
            <div
              v-for="(keyword, index) in keywordArray"
              :key="index"
              class="inline-flex items-center bg-emerald-100 px-2 py-1 rounded-md text-sm"
            >
              {{ keyword }}
              <button
                type="button"
                class="ml-1 text-gray-500 hover:text-gray-700 focus:outline-none"
                @click="removeKeyword(index)"
              >
                <X size="14" />
              </button>
            </div>
          </div>
          <p v-if="keywordArray.length >= 6" class="mt-1 text-sm text-red-500">
            已達到最大關鍵字數量 (6個)
          </p>
        </div>

        <div class="mb-6">
          <label for="description" class="block text-sm font-medium mb-2">
            物品描述
          </label>
          <textarea
            id="description"
            v-model="description"
            placeholder="請詳細描述物品的特徵、顏色、品牌等資訊"
            rows="4"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            required
          ></textarea>
        </div>

        <!-- 修改日期時間選擇 -->
        <div class="mb-6">
          <label class="block text-sm font-medium mb-2">
            {{ itemType === "found" ? "撿到日期時間" : "遺失日期時間" }}
          </label>
          <div class="flex space-x-2">
            <input
              v-model="date"
              type="date"
              class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
            <input
              v-model="time"
              type="time"
              class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>
        </div>

        <div class="mb-6">
          <label class="block text-sm font-medium mb-2">
            {{ itemType === "found" ? "撿到地點" : "遺失地點" }}
          </label>
          <div class="mb-2 text-sm text-gray-600 flex items-center">
            <MapPin size="16" class="mr-1" />
            <span>請在地圖上標記位置</span>
          </div>
          <client-only>
            <LocationPicker @location-select="setLocation" />
          </client-only>
          <p v-if="location" class="mt-2 text-sm text-gray-600">
            已選擇位置：{{ location[0].toFixed(6) }},
            {{ location[1].toFixed(6) }}
          </p>
        </div>

        <!-- 地點描述 -->
        <div class="mb-6">
          <label
            for="locationDescription"
            class="block text-sm font-medium mb-2"
          >
            {{ itemType === "found" ? "撿到地點描述" : "遺失地點描述" }}
          </label>
          <input
            id="locationDescription"
            v-model="locationDescription"
            placeholder="請描述詳細地點，如：第一教學大樓3樓走廊"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <!-- 物品現在狀態 -->
        <div class="mb-6">
          <label for="holdingState" class="block text-sm font-medium mb-2">
            物品現在狀態
          </label>
          <input
            id="holdingState"
            v-model="holding_state"
            placeholder="例如：原地擺放、交由警衛室保管、自己保管中"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            required
          />
        </div>

        <!-- 聯絡方式 -->
        <div class="mb-6">
          <label for="contact" class="block text-sm font-medium mb-2">
            聯絡方式
          </label>
          <textarea
            id="contact"
            v-model="contact"
            placeholder="請留下您的聯絡方式，如Line ID、電話或Email"
            rows="2"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            required
          ></textarea>
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
            <span v-else>提交登記</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useRuntimeConfig, useCookie } from "#app";
import {
  Upload,
  MapPin,
  Loader2,
  Package,
  Utensils,
  Plus,
  X,
} from "lucide-vue-next";

const config = useRuntimeConfig();
const route = useRoute();
const router = useRouter();

const isItemActive = computed(() => route.path === "/submit/item");
const isFoodActive = computed(() => route.path === "/submit/food");

const itemType = ref("found");

const title = ref("");
const category = ref("身分證件"); // 預設選項
const location = ref(null);
const latitude = ref("");
const longitude = ref("");
const description = ref("");
const date = ref("");
const time = ref("");
const imageFile = ref(null);

// 新增欄位
const keywordInput = ref("");
const keywordArray = ref([]);
const locationDescription = ref("");
const holding_state = ref("");
const contact = ref("");

const isSubmitting = ref(false);
const previewImage = ref(null);

// 關鍵字處理函數
const addKeyword = () => {
  if (keywordInput.value.trim() && keywordArray.value.length < 6) {
    keywordArray.value.push(keywordInput.value.trim());
    keywordInput.value = "";
  }
};

const removeKeyword = (index) => {
  keywordArray.value.splice(index, 1);
};

const handleImageChange = (e) => {
  const file = e.target.files?.[0];
  if (file) {
    imageFile.value = file;
    const reader = new FileReader();
    reader.onloadend = () => {
      previewImage.value = reader.result;
    };
    reader.readAsDataURL(file);
  }
};

const setLocation = (loc) => {
  location.value = loc;
  latitude.value = loc[0];
  longitude.value = loc[1];
  console.log("Selected location:", loc);
};

const handleSubmit = async () => {
  isSubmitting.value = true;

  try {
    // 組合日期時間
    const discover_time = `${date.value}T${time.value}:00`;

    // 取得認證 Token
    const authCookie = useCookie("auth_token");

    if (!authCookie.value) {
      alert("您需要先登入才能提交物品信息");
      router.push("/login");
      return;
    }

    // 建立表單數據
    const formData = new FormData();
    formData.append("title", title.value);
    formData.append("category", category.value);
    formData.append("keywords", JSON.stringify(keywordArray.value));
    formData.append("status", itemType.value);
    formData.append("description", description.value);
    formData.append("discover_time", discover_time);
    formData.append("latitude", latitude.value);
    formData.append("longitude", longitude.value);
    formData.append("holding_state", holding_state.value);
    formData.append("contact", contact.value);
    formData.append("location", locationDescription.value);

    if (imageFile.value) {
      formData.append("image", imageFile.value);
    }

    // 使用環境設定的後端API端點並添加認證標頭
    const response = await fetch(`${config.public.BACKEND_BASE_URL}/items`, {
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
    alert("物品已成功登記！");

    // 提交成功後導航到物品清單頁面(之後導向/activities)
    router.push("/items");
  } catch (error) {
    console.error("提交失敗:", error);
    isSubmitting.value = false;
    alert("提交失敗，請稍後再試");
  }
};
</script>
