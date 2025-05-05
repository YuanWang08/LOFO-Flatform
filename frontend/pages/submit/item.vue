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

        <div class="mb-6">
          <label for="date" class="block text-sm font-medium mb-2">
            {{ itemType === "found" ? "撿到日期" : "遺失日期" }}
          </label>
          <input
            id="date"
            v-model="date"
            type="date"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            required
          />
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
import { useRoute } from "vue-router";
import { Upload, MapPin, Loader2, Package, Utensils } from "lucide-vue-next";

const route = useRoute();

const isItemActive = computed(() => route.path === "/submit/item");
const isFoodActive = computed(() => route.path === "/submit/food");

const itemType = ref("found");
const title = ref("");
const description = ref("");
const date = ref("");
const location = ref(null);
const isSubmitting = ref(false);
const previewImage = ref(null);

const handleImageChange = (e) => {
  const file = e.target.files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onloadend = () => {
      previewImage.value = reader.result;
    };
    reader.readAsDataURL(file);
  }
};

const setLocation = (loc) => {
  location.value = loc;
};

const handleSubmit = async () => {
  isSubmitting.value = true;

  // 模擬 API 請求
  setTimeout(() => {
    isSubmitting.value = false;
    alert("物品已成功登記！");
    // 重置表單或重定向
  }, 1500);
};
</script>
