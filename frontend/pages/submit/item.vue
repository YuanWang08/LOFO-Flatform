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
          <div
            class="mt-1 border-2 border-dashed border-gray-300 rounded-lg p-6 transition-colors"
            :class="{ 'border-emerald-500 bg-emerald-50': isDragging }"
            @dragover.prevent="isDragging = true"
            @dragleave.prevent="isDragging = false"
            @drop.prevent="handleFileDrop"
          >
            <div class="text-center">
              <Upload
                v-if="!previewImage"
                class="mx-auto h-12 w-12 text-gray-400"
              />
              <div v-if="!previewImage" class="mt-2">
                <label
                  for="file-upload"
                  class="cursor-pointer rounded-md font-medium text-emerald-600 hover:text-emerald-500"
                >
                  <span>上傳圖片</span>
                  <input
                    id="file-upload"
                    type="file"
                    class="sr-only"
                    accept="image/*"
                    @change="handleImageChange"
                  />
                </label>
                <p class="text-xs text-gray-500">PNG, JPG 格式，最大 10MB</p>
                <p class="text-xs text-emerald-600 mt-2">
                  上傳圖片後，Gemini AI 將自動協助您分析物品資訊
                </p>
              </div>
            </div>
          </div>
          <div v-if="previewImage" class="mt-3">
            <div
              class="relative aspect-video rounded-lg overflow-hidden border border-gray-300"
            >
              <img
                :src="previewImage"
                alt="Preview"
                class="object-contain w-full h-full"
              />
              <button
                type="button"
                @click="removeImage"
                class="absolute top-2 right-2 bg-gray-800 bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-70"
              >
                <X size="16" />
              </button>
              <!-- 分析中指示器 -->
              <div
                v-if="isAnalyzing"
                class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50"
              >
                <div class="text-center text-white">
                  <Loader2 class="animate-spin h-8 w-8 mx-auto mb-2" />
                  <p class="text-sm">正在使用 Gemini 分析物品...</p>
                </div>
              </div>
            </div>
            <!-- Gemini 分析按鈕 -->
            <div class="mt-2 flex justify-end">
              <button
                v-if="!isFirstUpload"
                type="button"
                @click="analyzeWithGemini"
                class="flex items-center gap-1 px-3 py-1 text-sm bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-md hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="isAnalyzing"
              >
                <span v-if="isAnalyzing">
                  <Loader2 class="animate-spin" size="14" />
                </span>
                <span>使用 Gemini 分析</span>
              </button>
            </div>
          </div>
        </div>

        <div class="mb-6">
          <h2 class="text-xl font-semibold mb-4">物品登記</h2>
          <div class="bg-emerald-50 border-l-4 border-emerald-500 p-4 mb-4">
            <div class="flex">
              <div class="flex-shrink-0">
                <InfoIcon class="h-5 w-5 text-emerald-500" />
              </div>
              <div class="ml-3">
                <p class="text-sm text-emerald-700">
                  您正在登記一個拾獲物品，此物品將在審核後顯示在公開平台上，以便失主認領。
                </p>
              </div>
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
          <label class="block text-sm font-medium mb-2">撿到日期時間</label>
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
          <label class="block text-sm font-medium mb-2">撿到地點</label>
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
            撿到地點描述
          </label>
          <input
            id="locationDescription"
            v-model="locationDescription"
            placeholder="請描述詳細地點，如：第一教學大樓3樓走廊"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <!-- 物品是否在您手上 -->
        <div class="mb-6">
          <label class="block text-sm font-medium mb-2">物品現在位置</label>
          <div class="flex items-center space-x-4">
            <div class="flex items-center">
              <input
                id="not-with-owner"
                v-model="is_with_owner"
                type="radio"
                :value="false"
                name="item-location"
                class="h-4 w-4 text-emerald-600 border-gray-300 focus:ring-emerald-500"
              />
              <label
                for="not-with-owner"
                class="ml-2 block text-sm text-gray-700"
              >
                留在原處
              </label>
            </div>
            <div class="flex items-center">
              <input
                id="with-owner"
                v-model="is_with_owner"
                type="radio"
                :value="true"
                name="item-location"
                class="h-4 w-4 text-emerald-600 border-gray-300 focus:ring-emerald-500"
              />
              <label for="with-owner" class="ml-2 block text-sm text-gray-700">
                已帶走（在我手上）
              </label>
            </div>
          </div>
        </div>

        <!-- 允許私訊 -->
        <div class="mb-6">
          <label class="block text-sm font-medium mb-2">允許私訊</label>
          <div
            v-if="is_with_owner"
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
                已帶走物品必須允許其他使用者傳送私訊給我
              </label>
            </div>
          </div>
          <div v-else class="flex items-center space-x-4">
            <div class="flex items-center">
              <input
                id="allow-message"
                v-model="allow_message"
                type="radio"
                :value="true"
                name="allow-message"
                class="h-4 w-4 text-emerald-600 border-gray-300 focus:ring-emerald-500"
              />
              <label
                for="allow-message"
                class="ml-2 block text-sm text-gray-700"
              >
                允許其他使用者傳送私訊給我
              </label>
            </div>
            <div class="flex items-center">
              <input
                id="disallow-message"
                v-model="allow_message"
                type="radio"
                :value="false"
                name="allow-message"
                class="h-4 w-4 text-emerald-600 border-gray-300 focus:ring-emerald-500"
              />
              <label
                for="disallow-message"
                class="ml-2 block text-sm text-gray-700"
              >
                不允許私訊
              </label>
            </div>
          </div>
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
import { ref, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useRuntimeConfig, useCookie } from "#app";
import Swal from "sweetalert2";
import {
  Upload,
  MapPin,
  Loader2,
  Package,
  Utensils,
  Plus,
  X,
  InfoIcon,
} from "lucide-vue-next";

const config = useRuntimeConfig();
const route = useRoute();
const router = useRouter();

const isItemActive = computed(() => route.path === "/submit/item");
const isFoodActive = computed(() => route.path === "/submit/food");

const isDragging = ref(false);
const isFirstUpload = ref(true); // 標記是否為首次上傳
const isAnalyzing = ref(false); // 標記是否正在分析中

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
const is_with_owner = ref(false);
const allow_message = ref(true);
const contact = ref("");

const isSubmitting = ref(false);
const previewImage = ref(null);

// 設置預設日期時間為當前時間
onMounted(() => {
  // 獲取當前日期和時間
  const now = new Date();

  // 格式化日期為 YYYY-MM-DD 格式
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  // 格式化時間為 HH:MM 格式
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");

  // 設置為默認值
  date.value = `${year}-${month}-${day}`;
  time.value = `${hours}:${minutes}`;
});

// 監聽is_with_owner變更，當選擇"已帶走"時自動設置allow_message為true
watch(is_with_owner, (newVal) => {
  if (newVal === true) {
    allow_message.value = true;
  }
});

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
    // 如果是首次上傳圖片，自動調用 Gemini 分析
    if (isFirstUpload.value) {
      analyzeWithGemini();
      isFirstUpload.value = false;
    }
  };
  reader.readAsDataURL(file);
};

const removeImage = () => {
  imageFile.value = null;
  previewImage.value = null;
  // 重設為首次上傳
  isFirstUpload.value = true;
};

// 使用 Gemini 分析圖片
const analyzeWithGemini = async () => {
  if (!imageFile.value) return;

  isAnalyzing.value = true;

  try {
    // 取得認證 Token
    const authCookie = useCookie("auth_token");

    if (!authCookie.value) {
      Swal.fire({
        icon: "warning",
        title: "需要登入",
        text: "您需要先登入才能使用 Gemini 分析功能",
        confirmButtonColor: "#10b981",
      });
      return;
    }

    const formData = new FormData();
    formData.append("image", imageFile.value);

    // 呼叫 Gemini API 分析物品
    const response = await fetch(
      `${config.public.BACKEND_BASE_URL}/gemini/analyze-item`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authCookie.value}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("分析失敗");
    }

    const result = await response.json();
    console.log("Gemini 分析結果:", result);

    // 更新表單資料
    title.value = result.title || title.value;
    category.value = result.category || category.value;
    description.value = result.description || description.value;

    // 更新關鍵字
    if (result.keywords && Array.isArray(result.keywords)) {
      keywordArray.value = result.keywords.slice(0, 6); // 確保最多 6 個關鍵字
    }

    // 顯示成功訊息
    Swal.fire({
      icon: "success",
      title: "分析完成",
      text: "Gemini 已成功分析物品資訊！",
      confirmButtonColor: "#10b981",
    });
  } catch (error) {
    console.error("Gemini 分析失敗:", error);

    Swal.fire({
      icon: "error",
      title: "分析失敗",
      text: "無法使用 Gemini 分析此圖片，請手動填寫資訊",
      confirmButtonColor: "#10b981",
    });
  } finally {
    isAnalyzing.value = false;
  }
};

const setLocation = (loc) => {
  location.value = loc;
  latitude.value = loc[0];
  longitude.value = loc[1];
  console.log("Selected location:", loc);
};

const handleSubmit = async () => {
  // 檢查是否已選擇地圖位置
  if (!latitude.value || !longitude.value) {
    Swal.fire({
      icon: "warning",
      title: "未選擇地點",
      text: "請在地圖上選擇撿到物品的位置",
      confirmButtonColor: "#10b981",
    });
    return;
  }

  isSubmitting.value = true;

  try {
    // 組合日期時間
    const discover_time = `${date.value}T${time.value}:00`;

    // 取得認證 Token
    const authCookie = useCookie("auth_token");

    if (!authCookie.value) {
      Swal.fire({
        icon: "warning",
        title: "需要登入",
        text: "您需要先登入才能提交物品信息",
        confirmButtonColor: "#10b981",
      });
      router.push("/login");
      return;
    }

    // 建立表單數據
    const formData = new FormData();
    formData.append("title", title.value);
    formData.append("category", category.value);
    formData.append("keywords", JSON.stringify(keywordArray.value));
    formData.append("description", description.value);
    formData.append("discover_time", discover_time);
    formData.append("latitude", latitude.value);
    formData.append("longitude", longitude.value);
    formData.append("is_with_owner", is_with_owner.value);
    formData.append("allow_message", allow_message.value);
    formData.append("contact", contact.value);
    formData.append("location", locationDescription.value);
    // 設置物品狀態為 'active'
    formData.append("status", "active");

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
    Swal.fire({
      icon: "success",
      title: "成功",
      text: "物品已成功登記！",
      confirmButtonColor: "#10b981",
    });

    // 提交成功後導航到物品清單頁面(之後導向/activities)
    router.push("/items");
  } catch (error) {
    console.error("提交失敗:", error);
    isSubmitting.value = false;
    Swal.fire({
      icon: "error",
      title: "提交失敗",
      text: "提交失敗，請稍後再試",
      confirmButtonColor: "#10b981",
    });
  }
};
</script>
