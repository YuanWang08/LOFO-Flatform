<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-5xl mx-auto">
      <h1 class="text-3xl font-bold mb-2">聯絡我們</h1>
      <p class="text-gray-600 mb-8">有任何問題或建議？請隨時與我們聯絡</p>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- 聯絡表單 -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-lg shadow-md p-6">
            <div v-if="isSubmitted" class="text-center py-8">
              <div
                class="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <CheckCircle class="h-8 w-8 text-emerald-600" />
              </div>
              <h2 class="text-2xl font-bold mb-2">訊息已送出！</h2>
              <p class="text-gray-600 mb-6">
                感謝您的來信。我們已收到您的訊息，將盡快回覆您。通常我們會在 1-2
                個工作日內回覆。
              </p>
              <button
                @click="isSubmitted = false"
                class="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
              >
                發送另一則訊息
              </button>
            </div>
            <form v-else @submit.prevent="handleSubmit">
              <h2 class="text-xl font-semibold mb-4">發送訊息</h2>
              <div class="space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="space-y-2">
                    <label
                      for="name"
                      class="block text-sm font-medium text-gray-700"
                      >姓名</label
                    >
                    <input
                      id="name"
                      v-model="formState.name"
                      type="text"
                      placeholder="請輸入您的姓名"
                      class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      required
                    />
                  </div>
                  <div class="space-y-2">
                    <label
                      for="email"
                      class="block text-sm font-medium text-gray-700"
                      >電子郵件</label
                    >
                    <input
                      id="email"
                      v-model="formState.email"
                      type="email"
                      placeholder="請輸入您的電子郵件"
                      class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      required
                    />
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="space-y-2">
                    <label
                      for="subject"
                      class="block text-sm font-medium text-gray-700"
                      >主旨</label
                    >
                    <input
                      id="subject"
                      v-model="formState.subject"
                      type="text"
                      placeholder="請輸入訊息主旨"
                      class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      required
                    />
                  </div>
                  <div class="space-y-2">
                    <label
                      for="category"
                      class="block text-sm font-medium text-gray-700"
                      >問題類別</label
                    >
                    <select
                      id="category"
                      v-model="formState.category"
                      class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      required
                    >
                      <option value="" disabled selected>請選擇問題類別</option>
                      <option value="general">一般問題</option>
                      <option value="account">帳號問題</option>
                      <option value="lost-found">遺失物相關</option>
                      <option value="food-sharing">食物分享相關</option>
                      <option value="technical">技術問題</option>
                      <option value="suggestion">建議與回饋</option>
                      <option value="other">其他</option>
                    </select>
                  </div>
                </div>

                <div class="space-y-2">
                  <label
                    for="message"
                    class="block text-sm font-medium text-gray-700"
                    >訊息內容</label
                  >
                  <textarea
                    id="message"
                    v-model="formState.message"
                    placeholder="請詳細描述您的問題或建議..."
                    rows="6"
                    class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  class="w-full px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  :disabled="isSubmitting"
                >
                  <div
                    v-if="isSubmitting"
                    class="flex items-center justify-center"
                  >
                    <Loader2 class="mr-2 h-4 w-4 animate-spin" />
                    發送中...
                  </div>
                  <div v-else class="flex items-center justify-center">
                    <Send class="mr-2 h-4 w-4" />
                    發送訊息
                  </div>
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- 聯絡資訊 -->
        <div class="space-y-6">
          <div class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-xl font-semibold mb-4">聯絡資訊</h2>
            <div class="space-y-4">
              <div class="flex items-start">
                <MapPin class="h-5 w-5 text-emerald-600 mt-1 mr-3" />
                <div>
                  <p class="font-medium">地址</p>
                  <p class="text-gray-600">32001 桃園市中壢區中大路300號</p>
                  <p class="text-gray-600">國立中央大學</p>
                </div>
              </div>
              <div class="flex items-start">
                <Mail class="h-5 w-5 text-emerald-600 mt-1 mr-3" />
                <div>
                  <p class="font-medium">電子郵件</p>
                  <p class="text-gray-600">support@lofo.edu.tw</p>
                </div>
              </div>
              <div class="flex items-start">
                <Phone class="h-5 w-5 text-emerald-600 mt-1 mr-3" />
                <div>
                  <p class="font-medium">電話</p>
                  <p class="text-gray-600">0800-770-885</p>
                </div>
              </div>
              <div class="flex items-start">
                <Clock class="h-5 w-5 text-emerald-600 mt-1 mr-3" />
                <div>
                  <p class="font-medium">服務時間</p>
                  <p class="text-gray-600">週一至週五：不提供服務</p>
                  <p class="text-gray-600">週六、週日及國定假日：休息</p>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-xl font-semibold mb-4">常見問題</h2>
            <p class="text-gray-600 mb-4">
              在聯絡我們之前，您可以查看我們的常見問題解答，可能已經有您想問的問題的答案。
            </p>
            <NuxtLink to="/faq">
              <button
                class="w-full px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-md hover:bg-gray-50 transition-colors flex items-center justify-center"
              >
                <HelpCircle class="mr-2 h-4 w-4" />
                查看常見問題
              </button>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  Loader2,
  CheckCircle,
  HelpCircle,
} from "lucide-vue-next";

const formState = reactive({
  name: "",
  email: "",
  subject: "",
  category: "",
  message: "",
});

const isSubmitting = ref(false);
const isSubmitted = ref(false);

const handleSubmit = () => {
  isSubmitting.value = true;

  // 模擬表單提交
  setTimeout(() => {
    isSubmitting.value = false;
    isSubmitted.value = true;
    // 在實際應用中，這裡應該是發送表單數據到後端的代碼

    // 重置表單
    formState.name = "";
    formState.email = "";
    formState.subject = "";
    formState.category = "";
    formState.message = "";
  }, 1500);
};
</script>
