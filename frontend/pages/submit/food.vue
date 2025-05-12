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

        <div class="mb-6">
          <label for="description" class="block text-sm font-medium mb-2">
            食物描述
          </label>
          <textarea
            id="description"
            v-model="description"
            placeholder="請詳細描述食物的內容、數量、是否為素食等資訊"
            rows="4"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            required
          ></textarea>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label for="portions" class="block text-sm font-medium mb-2">
              份數
            </label>
            <input
              id="portions"
              v-model="portions"
              type="number"
              min="1"
              placeholder="可分享的份數"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>
          <div>
            <label for="expiry" class="block text-sm font-medium mb-2">
              有效期限
            </label>
            <input
              id="expiry"
              v-model="expiry"
              type="datetime-local"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>
        </div>

        <div class="mb-6">
          <div class="flex items-center space-x-2">
            <input
              id="reservation"
              type="checkbox"
              v-model="requireReservation"
              class="h-4 w-4 text-emerald-600 focus:ring-emerald-500 rounded"
            />
            <label for="reservation" class="cursor-pointer">
              需要預約才能領取
            </label>
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
            已選擇位置：{{ location[0].toFixed(6) }},
            {{ location[1].toFixed(6) }}
          </p>
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
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { Upload, MapPin, Loader2, Package, Utensils, X } from "lucide-vue-next";

const route = useRoute();

const isItemActive = computed(() => route.path === "/submit/item");
const isFoodActive = computed(() => route.path === "/submit/food");

const title = ref("");
const description = ref("");
const portions = ref(1);
const expiry = ref("");
const location = ref(null);
const isSubmitting = ref(false);
const previewImage = ref(null);
const requireReservation = ref(true);
const isDragging = ref(false);
const imageFile = ref(null);

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
  expiry.value = `${year}-${month}-${day}T${hours}:${minutes}`;
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
};

const handleSubmit = async () => {
  isSubmitting.value = true;

  // 模擬 API 請求
  setTimeout(() => {
    isSubmitting.value = false;
    alert("食物分享已成功登記！");
    // 重置表單或重定向
  }, 1500);
};
</script>
