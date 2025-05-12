<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold mb-2">使用指南</h1>
      <p class="text-gray-600 mb-8">了解如何使用 LOFO 平台的各項功能</p>

      <!-- 平台介紹 -->
      <section class="mb-12">
        <h2 class="text-2xl font-bold mb-4">平台介紹</h2>
        <div class="bg-white rounded-lg shadow-md p-6">
          <p class="mb-4">
            LOFO
            是一個專為校園設計的遺失物與食物資訊分享平台，致力於幫助用戶尋回遺失物品並減少食物浪費。透過地圖標記、智能分析與社群互動，讓尋物與分享食物變得更簡單。
          </p>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div class="flex flex-col items-center text-center">
              <div
                class="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4"
              >
                <MapPin class="h-8 w-8 text-emerald-600" />
              </div>
              <h3 class="font-semibold mb-2">地圖標記系統</h3>
              <p class="text-gray-600 text-sm">
                透過互動式地圖，精確標記遺失物與食物分享的位置
              </p>
            </div>
            <div class="flex flex-col items-center text-center">
              <div
                class="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4"
              >
                <Search class="h-8 w-8 text-amber-600" />
              </div>
              <h3 class="font-semibold mb-2">智能搜尋</h3>
              <p class="text-gray-600 text-sm">
                結合 AI 技術，自動生成關鍵字與標籤，讓搜尋更精準
              </p>
            </div>
            <div class="flex flex-col items-center text-center">
              <div
                class="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mb-4"
              >
                <Utensils class="h-8 w-8 text-rose-600" />
              </div>
              <h3 class="font-semibold mb-2">食物共享</h3>
              <p class="text-gray-600 text-sm">
                設定食物份數與有效時間，讓多餘的食物不被浪費
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- 遺失物協尋指南 -->
      <section class="mb-12">
        <h2 class="text-2xl font-bold mb-4">遺失物協尋指南</h2>
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-start mb-6">
            <div
              class="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0"
            >
              <Package class="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <h3 class="text-xl font-semibold mb-2">如何登記遺失物</h3>
              <p class="text-gray-600 mb-4">
                無論您是遺失物品還是撿到物品，都可以透過以下步驟在平台上登記資訊，增加物品尋回的機會。
              </p>
            </div>
          </div>

          <div class="space-y-6 pl-16">
            <div class="relative">
              <div
                class="absolute left-0 top-0 w-8 h-8 bg-amber-500 text-white rounded-full flex items-center justify-center"
              >
                1
              </div>
              <div class="pl-12">
                <h4 class="font-semibold mb-1">登記物品資訊</h4>
                <p class="text-gray-600 text-sm">
                  點擊頁面頂部的「登記遺失物」按鈕，選擇您是遺失物品還是撿到物品，然後填寫物品的基本資訊，包括名稱、描述、類別等。
                </p>
              </div>
            </div>

            <div class="relative">
              <div
                class="absolute left-0 top-0 w-8 h-8 bg-amber-500 text-white rounded-full flex items-center justify-center"
              >
                2
              </div>
              <div class="pl-12">
                <h4 class="font-semibold mb-1">標記地點與時間</h4>
                <p class="text-gray-600 text-sm">
                  在地圖上標記您遺失或撿到物品的位置，並設定日期和時間。準確的位置和時間資訊可以大幅提高物品被找回的機率。
                </p>
              </div>
            </div>

            <div class="relative">
              <div
                class="absolute left-0 top-0 w-8 h-8 bg-amber-500 text-white rounded-full flex items-center justify-center"
              >
                3
              </div>
              <div class="pl-12">
                <h4 class="font-semibold mb-1">上傳物品照片</h4>
                <p class="text-gray-600 text-sm">
                  上傳物品的清晰照片，從多個角度拍攝以展示物品的特徵。照片是識別物品的重要依據，可以幫助失主或拾獲者確認物品。
                </p>
              </div>
            </div>

            <div class="relative">
              <div
                class="absolute left-0 top-0 w-8 h-8 bg-amber-500 text-white rounded-full flex items-center justify-center"
              >
                4
              </div>
              <div class="pl-12">
                <h4 class="font-semibold mb-1">設定聯絡方式</h4>
                <p class="text-gray-600 text-sm">
                  選擇您希望的聯絡方式，可以是站內訊息、電子郵件或電話。請注意保護個人隱私，建議優先使用站內訊息功能。
                </p>
              </div>
            </div>

            <div class="relative">
              <div
                class="absolute left-0 top-0 w-8 h-8 bg-amber-500 text-white rounded-full flex items-center justify-center"
              >
                5
              </div>
              <div class="pl-12">
                <h4 class="font-semibold mb-1">接收通知與互動</h4>
                <p class="text-gray-600 text-sm">
                  登記完成後，系統會自動匹配相似的物品並通知您。當有人回應您的貼文時，您也會收到通知。請及時查看並回覆訊息。
                </p>
              </div>
            </div>
          </div>

          <div class="mt-8 text-center">
            <NuxtLink to="/submit/item">
              <button
                class="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors flex items-center mx-auto"
              >
                立即登記遺失物
                <ArrowRight class="ml-2 h-4 w-4" />
              </button>
            </NuxtLink>
          </div>
        </div>
      </section>

      <!-- 食物分享指南 -->
      <section class="mb-12">
        <h2 class="text-2xl font-bold mb-4">食物分享指南</h2>
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-start mb-6">
            <div
              class="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0"
            >
              <Utensils class="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <h3 class="text-xl font-semibold mb-2">如何分享與預約食物</h3>
              <p class="text-gray-600 mb-4">
                LOFO
                平台讓您可以輕鬆分享多餘的食物，或預約他人分享的食物，減少浪費並幫助有需要的人。
              </p>
            </div>
          </div>

          <div class="space-y-6 pl-16">
            <div class="relative">
              <div
                class="absolute left-0 top-0 w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center"
              >
                1
              </div>
              <div class="pl-12">
                <h4 class="font-semibold mb-1">登記食物資訊</h4>
                <p class="text-gray-600 text-sm">
                  點擊頁面頂部的「分享食物」按鈕，填寫食物的基本資訊，包括名稱、描述、份數、是否為素食等。請確保提供準確的食物資訊，特別是過敏原相關資訊。
                </p>
              </div>
            </div>

            <div class="relative">
              <div
                class="absolute left-0 top-0 w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center"
              >
                2
              </div>
              <div class="pl-12">
                <h4 class="font-semibold mb-1">設定有效期限與地點</h4>
                <p class="text-gray-600 text-sm">
                  設定食物的有效期限和分享地點。有效期限應考慮食物的保存狀況，確保食物在被取用時仍然新鮮安全。在地圖上準確標記取用地點。
                </p>
              </div>
            </div>

            <div class="relative">
              <div
                class="absolute left-0 top-0 w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center"
              >
                3
              </div>
              <div class="pl-12">
                <h4 class="font-semibold mb-1">上傳食物照片</h4>
                <p class="text-gray-600 text-sm">
                  上傳食物的清晰照片，展示食物的外觀和包裝。好的照片可以增加食物被預約的機率，也能幫助取用者確認食物的狀況。
                </p>
              </div>
            </div>

            <div class="relative">
              <div
                class="absolute left-0 top-0 w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center"
              >
                4
              </div>
              <div class="pl-12">
                <h4 class="font-semibold mb-1">預約與取用流程</h4>
                <p class="text-gray-600 text-sm">
                  如果您想預約他人分享的食物，只需點擊食物詳情頁面的「預約」按鈕，選擇預約份數，然後按照約定的時間地點前往取用。取用後，請記得在系統中確認取用完成。
                </p>
              </div>
            </div>

            <div class="relative">
              <div
                class="absolute left-0 top-0 w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center"
              >
                5
              </div>
              <div class="pl-12">
                <h4 class="font-semibold mb-1">食物安全注意事項</h4>
                <p class="text-gray-600 text-sm">
                  分享者應確保食物的衛生與安全，不分享過期或變質的食物。取用者在取用前應檢查食物狀況，如有疑慮請勿食用。雙方都應遵守約定的時間，尊重彼此的時間安排。
                </p>
              </div>
            </div>
          </div>

          <div class="mt-8 text-center">
            <NuxtLink to="/submit/food">
              <button
                class="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors flex items-center mx-auto"
              >
                立即分享食物
                <ArrowRight class="ml-2 h-4 w-4" />
              </button>
            </NuxtLink>
          </div>
        </div>
      </section>

      <!-- 平台功能介紹 -->
      <section class="mb-12">
        <h2 class="text-2xl font-bold mb-4">平台功能介紹</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="bg-white rounded-lg shadow-md p-6">
            <div class="flex items-center mb-4">
              <MapPin class="h-6 w-6 text-emerald-600 mr-3" />
              <h3 class="text-lg font-semibold">互動地圖</h3>
            </div>
            <p class="text-gray-600 text-sm mb-4">
              透過互動式地圖，您可以直觀地查看校園內的遺失物和食物分享位置。點擊地圖上的標記可以查看詳細資訊，也可以根據類別和狀態篩選顯示的項目。
            </p>
            <NuxtLink to="/map">
              <button
                class="w-full px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-md hover:bg-gray-50 transition-colors flex items-center justify-center"
              >
                查看地圖
                <ArrowRight class="ml-2 h-4 w-4" />
              </button>
            </NuxtLink>
          </div>

          <div class="bg-white rounded-lg shadow-md p-6">
            <div class="flex items-center mb-4">
              <MessageCircle class="h-6 w-6 text-emerald-600 mr-3" />
              <h3 class="text-lg font-semibold">站內訊息</h3>
            </div>
            <p class="text-gray-600 text-sm mb-4">
              使用站內訊息功能與其他用戶安全地溝通，無需透露個人聯絡方式。您可以詢問物品或食物的詳情，安排交接時間和地點，或表達感謝。
            </p>
            <NuxtLink to="/message">
              <button
                class="w-full px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-md hover:bg-gray-50 transition-colors flex items-center justify-center"
              >
                查看訊息
                <ArrowRight class="ml-2 h-4 w-4" />
              </button>
            </NuxtLink>
          </div>

          <div class="bg-white rounded-lg shadow-md p-6">
            <div class="flex items-center mb-4">
              <Bell class="h-6 w-6 text-emerald-600 mr-3" />
              <h3 class="text-lg font-semibold">通知系統</h3>
            </div>
            <p class="text-gray-600 text-sm mb-4">
              通知系統會即時提醒您重要事件，如有人回應您的遺失物、您的食物被預約、系統找到可能符合您遺失物品的匹配等。您可以自定義通知設置。
            </p>
            <NuxtLink to="/notifications">
              <button
                class="w-full px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-md hover:bg-gray-50 transition-colors flex items-center justify-center"
              >
                查看通知
                <ArrowRight class="ml-2 h-4 w-4" />
              </button>
            </NuxtLink>
          </div>

          <div class="bg-white rounded-lg shadow-md p-6">
            <div class="flex items-center mb-4">
              <User class="h-6 w-6 text-emerald-600 mr-3" />
              <h3 class="text-lg font-semibold">個人資料</h3>
            </div>
            <p class="text-gray-600 text-sm mb-4">
              在個人資料頁面，您可以管理您的基本資訊、查看您發布的遺失物和食物分享記錄、追蹤您的積分和等級，以及設定帳戶偏好。
            </p>
            <NuxtLink to="/profile">
              <button
                class="w-full px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-md hover:bg-gray-50 transition-colors flex items-center justify-center"
              >
                查看個人資料
                <ArrowRight class="ml-2 h-4 w-4" />
              </button>
            </NuxtLink>
          </div>
        </div>
      </section>

      <!-- 積分與等級系統 -->
      <section class="mb-12">
        <h2 class="text-2xl font-bold mb-4">積分與等級系統</h2>
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-start mb-6">
            <div
              class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0"
            >
              <Award class="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h3 class="text-xl font-semibold mb-2">如何獲得積分與提升等級</h3>
              <p class="text-gray-600 mb-4">
                LOFO
                平台設有積分與等級系統，鼓勵用戶積極參與社區互助。積分可以提升您的用戶等級，解鎖更多功能並增加您在平台上的可信度。
              </p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div class="bg-gray-50 p-4 rounded-lg">
              <h4 class="font-semibold mb-3 flex items-center">
                <CheckCircle class="h-5 w-5 text-emerald-500 mr-2" />
                獲得積分的方式
              </h4>
              <ul class="space-y-2 text-sm text-gray-600">
                <li class="flex items-start">
                  <span
                    class="bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded-full mr-2 mt-0.5"
                  >
                    +5
                  </span>
                  <span>登記遺失物或撿到物品</span>
                </li>
                <li class="flex items-start">
                  <span
                    class="bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded-full mr-2 mt-0.5"
                  >
                    +10
                  </span>
                  <span>成功協助他人尋回物品</span>
                </li>
                <li class="flex items-start">
                  <span
                    class="bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded-full mr-2 mt-0.5"
                  >
                    +3
                  </span>
                  <span>分享食物（每次）</span>
                </li>
                <li class="flex items-start">
                  <span
                    class="bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded-full mr-2 mt-0.5"
                  >
                    +1
                  </span>
                  <span>收到正面評價（每次）</span>
                </li>
                <li class="flex items-start">
                  <span
                    class="bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded-full mr-2 mt-0.5"
                  >
                    +2
                  </span>
                  <span>完成個人資料填寫</span>
                </li>
              </ul>
            </div>

            <div class="bg-gray-50 p-4 rounded-lg">
              <h4 class="font-semibold mb-3 flex items-center">
                <CheckCircle class="h-5 w-5 text-emerald-500 mr-2" />
                等級特權
              </h4>
              <ul class="space-y-2 text-sm text-gray-600">
                <li class="flex items-start">
                  <span
                    class="bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded-full mr-2 mt-0.5"
                    >Lv.1</span
                  >
                  <span>新手：基本功能使用權限</span>
                </li>
                <li class="flex items-start">
                  <span
                    class="bg-green-200 text-green-800 text-xs px-2 py-1 rounded-full mr-2 mt-0.5"
                  >
                    Lv.2
                  </span>
                  <span>活躍用戶：獲得特殊徽章，提高貼文顯示優先級</span>
                </li>
                <li class="flex items-start">
                  <span
                    class="bg-blue-200 text-blue-800 text-xs px-2 py-1 rounded-full mr-2 mt-0.5"
                    >Lv.3</span
                  >
                  <span>資深用戶：解鎖進階搜尋功能，獲得更多曝光機會</span>
                </li>
                <li class="flex items-start">
                  <span
                    class="bg-purple-200 text-purple-800 text-xs px-2 py-1 rounded-full mr-2 mt-0.5"
                  >
                    Lv.4
                  </span>
                  <span>專家：貼文置頂權限，獲得專屬客服支援</span>
                </li>
                <li class="flex items-start">
                  <span
                    class="bg-amber-200 text-amber-800 text-xs px-2 py-1 rounded-full mr-2 mt-0.5"
                  >
                    Lv.5
                  </span>
                  <span>大師：成為社區顧問，參與平台功能建議與測試</span>
                </li>
              </ul>
            </div>
          </div>

          <p class="text-sm text-gray-600">
            積分和等級系統旨在鼓勵正向行為和社區互助精神。請注意，濫用系統可能導致積分扣除或帳號限制。如有任何疑問，請參考
            <NuxtLink
              to="/terms"
              class="text-emerald-600 hover:text-emerald-700 mx-1"
            >
              服務條款
            </NuxtLink>
            或
            <NuxtLink
              to="/contact"
              class="text-emerald-600 hover:text-emerald-700 mx-1"
            >
              聯絡我們
            </NuxtLink>
            。
          </p>
        </div>
      </section>

      <!-- 常見問題連結 -->
      <section class="bg-gray-50 p-6 rounded-lg text-center">
        <h2 class="text-xl font-semibold mb-2">還有其他問題？</h2>
        <p class="text-gray-600 mb-4">
          查看我們的常見問題解答，或直接聯絡我們獲取幫助
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <NuxtLink to="/faq">
            <button
              class="px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              查看常見問題
            </button>
          </NuxtLink>
          <NuxtLink to="/contact">
            <button
              class="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
            >
              聯絡我們
            </button>
          </NuxtLink>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import {
  MapPin,
  Search,
  Package,
  Utensils,
  MessageCircle,
  Bell,
  User,
  Award,
  ArrowRight,
  CheckCircle,
} from "lucide-vue-next";
</script>
