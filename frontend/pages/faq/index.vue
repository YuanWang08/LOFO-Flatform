<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold mb-2">常見問題</h1>
      <p class="text-gray-600 mb-8">找到您對 LOFO 平台的疑問解答</p>

      <!-- 搜索框 -->
      <div class="relative mb-8">
        <Search
          class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
        />
        <input
          type="text"
          placeholder="搜尋問題..."
          class="w-full border border-gray-300 rounded-md px-3 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          v-model="searchQuery"
        />
        <p v-if="searchQuery" class="mt-2 text-sm text-gray-500">
          找到 {{ totalFilteredCount }} 個相關問題
          <template v-if="totalFilteredCount === 0">
            。請嘗試其他關鍵字或
            <NuxtLink
              to="/contact"
              class="text-emerald-600 hover:text-emerald-700 ml-1"
            >
              聯絡我們
            </NuxtLink>
          </template>
        </p>
      </div>

      <!-- 分類標籤 -->
      <div class="mb-8">
        <div class="border-b border-gray-200">
          <div class="flex flex-wrap -mb-px">
            <button
              v-for="(tab, index) in tabs"
              :key="index"
              :class="`py-2 px-4 border-b-2 flex items-center gap-2 ${activeTab === tab.value ? 'border-emerald-500 text-emerald-600 font-medium' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`"
              @click="activeTab = tab.value"
            >
              <component :is="tab.icon" class="h-5 w-5" />
              <span>{{ tab.label }}</span>
              <span v-if="searchQuery" class="text-xs"
                >({{ getFilteredCount(tab.value) }})</span
              >
            </button>
          </div>
        </div>
      </div>

      <!-- 問題內容 -->
      <div
        v-if="getFilteredQuestions(activeTab).length === 0"
        class="text-center py-8"
      >
        <component
          :is="getTabIcon(activeTab)"
          class="mx-auto h-12 w-12 text-gray-400"
        />
        <h3 class="mt-4 text-lg font-medium text-gray-900">沒有找到相關問題</h3>
        <p class="mt-2 text-gray-500">
          請嘗試其他關鍵字或
          <NuxtLink
            to="/contact"
            class="text-emerald-600 hover:text-emerald-700 ml-1"
          >
            聯絡我們
          </NuxtLink>
        </p>
      </div>
      <div v-else>
        <div
          v-for="(item, index) in getFilteredQuestions(activeTab)"
          :key="item.id"
          class="mb-4"
        >
          <div
            class="border border-gray-200 rounded-md overflow-hidden"
            :class="{ 'bg-gray-50': expandedQuestion === item.id }"
          >
            <button
              class="w-full text-left px-4 py-3 flex justify-between items-center"
              @click="toggleQuestion(item.id)"
            >
              <span class="font-medium">{{ item.question }}</span>
              <ChevronDown
                class="h-5 w-5 text-gray-500 transition-transform"
                :class="{
                  'transform rotate-180': expandedQuestion === item.id,
                }"
              />
            </button>
            <div
              v-if="expandedQuestion === item.id"
              class="px-4 py-3 border-t border-gray-200 text-gray-700"
            >
              {{ item.answer }}
            </div>
          </div>
        </div>
      </div>

      <!-- 聯絡我們 -->
      <div class="mt-12 bg-gray-50 p-6 rounded-lg text-center">
        <h2 class="text-xl font-semibold mb-2">沒有找到您的問題？</h2>
        <p class="text-gray-600 mb-4">
          如果您有其他問題或需要進一步協助，請隨時聯絡我們
        </p>
        <NuxtLink
          to="/contact"
          class="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
        >
          <MessageSquare class="mr-2 h-4 w-4" />
          聯絡我們
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import {
  Search,
  Info,
  Package,
  HelpCircle,
  Utensils,
  MessageSquare,
  ChevronDown,
} from "lucide-vue-next";

const searchQuery = ref("");
const expandedQuestion = ref(null);

const tabs = [
  { value: "general", label: "一般問題", icon: Info },
  { value: "lost-items", label: "遺失物品", icon: Package },
  { value: "found-items", label: "拾獲物品", icon: HelpCircle },
  { value: "food-sharing", label: "食物分享", icon: Utensils },
];

const activeTab = ref("general");

// 常見問題數據
const faqData = {
  general: [
    {
      id: "general-1",
      question: "LOFO 平台是什麼？",
      answer:
        "LOFO 是一個專為校園設計的遺失物與食物資訊分享平台，致力於幫助用戶尋回遺失物品並減少食物浪費。透過地圖標記、智能分析與社群互動，讓尋物與分享食物變得更簡單。",
    },
    {
      id: "general-2",
      question: "如何註冊 LOFO 帳號？",
      answer:
        "您可以點擊網站右上角的「登入」按鈕，然後選擇「立即註冊」。您可以使用電子郵件註冊，或直接使用中央 Portal 帳號登入。註冊過程簡單，只需填寫基本資料並同意服務條款即可。",
    },
    {
      id: "general-3",
      question: "LOFO 平台的積分系統是如何運作的？",
      answer:
        "您可以透過協助他人尋回物品或分享食物獲得積分。發布遺失物或撿到物品可獲得 5 積分，成功協助他人尋回物品可獲得 10 積分，分享食物可根據份數獲得 1-5 積分。積分可以提升您的用戶等級，解鎖更多功能並增加您在平台上的可信度。",
    },
    {
      id: "general-4",
      question: "忘記密碼怎麼辦？",
      answer:
        "如果您忘記了密碼，可以在登入頁面點擊「忘記密碼」，然後輸入您註冊時使用的電子郵件。系統會發送重設密碼的連結到您的郵箱。如果您使用中央 Portal 帳號登入，請聯繫學校 IT 部門重設您的 Portal 密碼。",
    },
    {
      id: "general-5",
      question: "如何修改個人資料？",
      answer:
        "登入後，點擊右上角的頭像或用戶名，選擇「個人資料」，然後點擊「編輯個人資料」按鈕。您可以修改頭像、用戶名、聯絡方式等資訊。請注意，某些基本資訊（如電子郵件）可能無法修改，如需更改請聯繫客服。",
    },
  ],
  "lost-items": [
    {
      id: "lost-1",
      question: "如何登記遺失物品？",
      answer:
        "點擊網站頂部導航欄的「登記遺失物」或首頁上的相應按鈕。填寫遺失物品的詳細資訊，包括名稱、描述、遺失地點和時間。您還可以上傳物品的照片以增加被找回的機會。最後，設定您希望的聯絡方式，然後提交表單。",
    },
    {
      id: "lost-2",
      question: "如何增加遺失物品被找回的機率？",
      answer:
        "提供盡可能詳細的物品描述，包括特徵、顏色、品牌等資訊。上傳清晰的物品照片。準確標記遺失地點。定期查看平台上的最新撿到物品。設定通知，當有符合您遺失物品特徵的物品被上傳時，系統會通知您。",
    },
    {
      id: "lost-3",
      question: "我的遺失物品被找回了，如何標記？",
      answer:
        "當您的遺失物品被找回後，請登入您的帳號，前往「我的遺失物」頁面，找到相應的物品，點擊「標記為已找回」按鈕。系統會詢問您是如何找回物品的，這有助於我們改進平台服務。標記後，該物品將不再顯示在公開的遺失物列表中。",
    },
    {
      id: "lost-4",
      question: "如何聯絡撿到我物品的人？",
      answer:
        "當您在平台上看到可能是您遺失物品的貼文時，可以點擊該物品詳情頁面上的「發送訊息」按鈕與撿到者聯絡。根據撿到者設定的聯絡方式，您可能需要使用站內訊息、電子郵件或電話聯絡。請尊重對方的隱私，並在公共場所進行物品交接。",
    },
    {
      id: "lost-5",
      question: "我可以編輯或刪除已發布的遺失物品嗎？",
      answer:
        "是的，您可以編輯或刪除您發布的遺失物品。前往「我的遺失物」頁面，找到相應的物品，點擊「編輯」或「刪除」按鈕。編輯可以更新物品的描述、照片或聯絡方式。請注意，如果物品已有人回應，建議不要刪除貼文，而是將其標記為已找回。",
    },
  ],
  "found-items": [
    {
      id: "found-1",
      question: "我撿到了物品，如何在平台上登記？",
      answer:
        "點擊網站頂部導航欄的「登記遺失物」或首頁上的相應按鈕，然後選擇「我撿到了物品」選項。填寫撿到物品的詳細資訊，包括名稱、描述、撿到地點和時間。上傳物品的照片以幫助失主識別。設定您希望的聯絡方式，然後提交表單。",
    },
    {
      id: "found-2",
      question: "撿到貴重物品（如錢包、手機）應該怎麼處理？",
      answer:
        "對於貴重物品，建議您先將物品交給校園失物招領處或警衛室保管，然後在平台上登記資訊，註明物品的保管地點。這樣既確保了物品的安全，又增加了失主找回物品的機會。請不要在平台上公開顯示證件號碼、銀行卡號等敏感資訊。",
    },
    {
      id: "found-3",
      question: "如何確認來認領物品的人是真正的失主？",
      answer:
        "要求對方詳細描述物品的特徵，特別是那些沒有在貼文中提到的細節。對於貴重物品，可以要求對方出示相關證明，如購買收據、物品照片、或能證明物品屬於他們的其他證據。建議在公共場所進行物品交接，必要時可請校園保安人員協助。",
    },
    {
      id: "found-4",
      question: "撿到物品多久後可以自行處理？",
      answer:
        "根據一般規定，撿到物品應保管至少 3 個月，給失主足夠的時間尋找。如果超過這段時間仍無人認領，您可以選擇自行處理或捐贈。但在處理前，建議更新平台上的貼文狀態，並考慮將物品捐給有需要的人或慈善機構。",
    },
    {
      id: "found-5",
      question: "我可以因為幫助他人找回物品而獲得獎勵嗎？",
      answer:
        "LOFO 平台鼓勵無償幫助他人，您會因為協助找回物品獲得平台積分作為獎勵。這些積分可以提升您的用戶等級和信譽。至於物質獎勵，這取決於失主的個人決定，平台不強制要求失主提供獎勵。請記住，真誠的感謝和社區互助精神是最有價值的回報。",
    },
  ],
  "food-sharing": [
    {
      id: "food-1",
      question: "如何分享食物？",
      answer:
        "點擊網站頂部導航欄的「分享食物」或首頁上的相應按鈕。填寫食物的詳細資訊，包括名稱、描述、份數、保存期限和分享地點。上傳食物的照片，設定是否需要預約，然後提交表單。請確保分享的食物新鮮衛生，並準確設定有效期限。",
    },
    {
      id: "food-2",
      question: "哪些食物適合在平台上分享？",
      answer:
        "適合分享的食物包括：未開封的包裝食品、當天製作的多餘食物、訂餐後的剩餘食物、節日或活動後的剩餘餐點等。食物必須新鮮衛生，未過期，且未被污染。請不要分享已經開始變質或可能導致食品安全問題的食物。",
    },
    {
      id: "food-3",
      question: "如何預約他人分享的食物？",
      answer:
        "瀏覽食物分享列表，找到您感興趣的食物，點擊進入詳情頁面。如果食物狀態為「可預約」，您可以選擇預約的份數，然後點擊「預約食物」按鈕。系統會通知食物分享者，您也會收到預約成功的通知。請按照約定的時間地點前往取用食物。",
    },
    {
      id: "food-4",
      question: "食物分享有哪些注意事項？",
      answer:
        "分享者：確保食物新鮮衛生，準確描述食物內容（特別是過敏原），設定合理的有效期限，準時在約定地點等待取用者。取用者：尊重分享者的時間，如無法前往請提前取消預約，取用後可給予分享者評價和感謝。雙方都應在公共場所進行食物交接，注意個人安全。",
    },
    {
      id: "food-5",
      question: "如果預約的食物無人取用，該怎麼辦？",
      answer:
        "如果預約者未在約定時間內取用食物，分享者可以在系統中標記該預約為「未取用」，這會影響預約者的信用評分。然後，分享者可以選擇重新開放預約，或者如果食物仍然新鮮，可以延長有效期限。如果食物即將過期，建議分享者自行處理或尋找其他途徑分享。",
    },
  ],
};

// 根據搜索查詢過濾問題
const filterQuestions = (questions) => {
  if (!searchQuery.value) return questions;
  return questions.filter(
    (q) =>
      q.question.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
};

// 獲取特定分類的過濾後問題
const getFilteredQuestions = (category) => {
  const categoryMap = {
    general: "general",
    "lost-items": "lost-items",
    "found-items": "found-items",
    "food-sharing": "food-sharing",
  };

  return filterQuestions(faqData[categoryMap[category]] || []);
};

// 獲取特定分類的過濾後問題數量
const getFilteredCount = (category) => {
  return getFilteredQuestions(category).length;
};

// 計算總過濾後問題數量
const totalFilteredCount = computed(() => {
  return (
    getFilteredCount("general") +
    getFilteredCount("lost-items") +
    getFilteredCount("found-items") +
    getFilteredCount("food-sharing")
  );
});

// 獲取標籤對應的圖標
const getTabIcon = (tab) => {
  const iconMap = {
    general: Info,
    "lost-items": Package,
    "found-items": HelpCircle,
    "food-sharing": Utensils,
  };
  return iconMap[tab] || Info;
};

// 切換問題展開/收起
const toggleQuestion = (id) => {
  if (expandedQuestion.value === id) {
    expandedQuestion.value = null;
  } else {
    expandedQuestion.value = id;
  }
};
</script>
