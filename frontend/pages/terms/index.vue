<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-3xl mx-auto">
      <div class="mb-6">
        <NuxtLink to="/">
          <button
            class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex items-center"
          >
            <ArrowLeft class="mr-2 h-4 w-4" />
            返回首頁
          </button>
        </NuxtLink>
      </div>

      <div class="bg-white rounded-lg shadow-md p-8">
        <h1 class="text-3xl font-bold mb-6">服務條款</h1>
        <p class="text-gray-500 mb-8">最後更新日期：2025 年 5 月 12 日</p>

        <div class="prose max-w-none">
          <p>
            歡迎使用 LOFO
            平台（以下簡稱「本平台」）。本服務條款（以下簡稱「條款」）規定了您使用本平台的條件和規則。請在使用本平台前仔細閱讀本條款。註冊帳號或使用本平台，即表示您同意受本條款的約束。
          </p>

          <h2 class="text-xl font-semibold mt-8 mb-4">1. 服務說明</h2>
          <p>
            LOFO
            平台是一個專為校園設計的遺失物與食物資訊分享平台，旨在幫助用戶尋回遺失物品並減少食物浪費。本平台提供的服務包括但不限於：遺失物登記與查詢、食物分享資訊發布與預約、互動地圖、站內訊息等功能。
          </p>

          <h2 class="text-xl font-semibold mt-8 mb-4">2. 帳號註冊與安全</h2>
          <p>
            2.1 註冊資格：您必須年滿 16
            歲，並具有完全民事行為能力才能註冊和使用本平台。
          </p>
          <p>
            2.2
            註冊資訊：您必須提供真實、準確、完整的個人資料，並在資料變更時及時更新。本平台保留驗證用戶身份的權利，但不承擔驗證的義務。
          </p>
          <p>
            2.3
            帳號安全：您有責任保護您的帳號和密碼安全，並對使用您帳號進行的所有活動負責。如發現未經授權使用您帳號的情況，請立即通知本平台。
          </p>
          <p>
            2.4
            帳號限制：本平台保留在用戶違反本條款或法律法規的情況下，暫停或終止用戶帳號的權利，且無需事先通知。
          </p>

          <h2 class="text-xl font-semibold mt-8 mb-4">3. 用戶行為規範</h2>
          <p>
            3.1
            合法使用：您同意僅將本平台用於合法目的，並遵守所有適用的法律法規。
          </p>
          <p>3.2 禁止行為：使用本平台時，您不得：</p>
          <ul class="list-disc pl-6 space-y-2">
            <li>發布虛假、誤導或欺詐性資訊</li>
            <li>侵犯他人的知識產權、隱私權或其他合法權益</li>
            <li>發布含有暴力、色情、歧視、誹謗或其他不適當內容的資訊</li>
            <li>利用本平台進行商業宣傳或未經授權的廣告活動</li>
            <li>使用自動化程序或機器人干擾本平台的正常運作</li>
            <li>試圖未經授權訪問本平台的系統或網絡</li>
            <li>利用本平台從事任何非法活動或損害他人權益的行為</li>
          </ul>
          <p>
            3.3
            內容責任：您對自己發布在本平台上的所有內容負責，包括文字、圖片和其他媒體。本平台不對用戶發布的內容承擔責任，但保留刪除違規內容的權利。
          </p>

          <h2 class="text-xl font-semibold mt-8 mb-4">
            4. 遺失物與食物分享規則
          </h2>
          <p>4.1 遺失物登記：</p>
          <ul class="list-disc pl-6 space-y-2">
            <li>登記遺失物或撿到物品時，請提供準確、詳細的資訊</li>
            <li>
              對於貴重物品（如錢包、證件、電子設備等），建議先交由校園失物招領處保管
            </li>
            <li>
              請勿在公開資訊中顯示敏感個人資料（如身份證號碼、銀行卡號等）
            </li>
            <li>物品交接應在公共場所進行，確保雙方安全</li>
          </ul>
          <p>4.2 食物分享：</p>
          <ul class="list-disc pl-6 space-y-2">
            <li>僅分享新鮮、衛生、未過期的食物</li>
            <li>準確描述食物的成分，特別是可能引起過敏的成分</li>
            <li>設定合理的有效期限，確保食物在被取用時仍然安全可食用</li>
            <li>如預約後無法前往取用，請提前取消預約</li>
            <li>
              本平台不對食物的質量和安全承擔責任，分享者和取用者應自行判斷食物狀況
            </li>
          </ul>

          <h2 class="text-xl font-semibold mt-8 mb-4">5. 知識產權</h2>
          <p>
            5.1
            平台內容：本平台的所有內容，包括但不限於文字、圖像、標誌、按鈕圖標、軟件和音頻文件，均為本平台或其內容提供者所有，受著作權、商標和其他知識產權法律保護。
          </p>
          <p>
            5.2
            用戶內容：您保留您發布在本平台上的內容的所有權利。但您授予本平台全球性、非獨占性、免費的許可，允許本平台使用、複製、修改、發布、展示和分發您的內容，用於提供和推廣本平台服務。
          </p>

          <h2 class="text-xl font-semibold mt-8 mb-4">6. 隱私保護</h2>
          <p>
            本平台重視用戶隱私保護，收集和使用您的個人資料時將遵循我們的
            <NuxtLink
              to="/privacy"
              class="text-emerald-600 hover:text-emerald-700"
            >
              隱私政策
            </NuxtLink>
            。使用本平台，即表示您同意我們按照隱私政策收集和使用您的個人資料。
          </p>

          <h2 class="text-xl font-semibold mt-8 mb-4">7. 免責聲明</h2>
          <p>
            7.1
            服務「按現狀」提供：本平台的服務按「現狀」和「可用性」提供，不提供任何明示或暗示的保證，包括但不限於適銷性、特定用途適用性和非侵權性的保證。
          </p>
          <p>
            7.2
            責任限制：在法律允許的最大範圍內，本平台不對因使用或無法使用本平台服務而導致的任何直接、間接、附帶、特殊、衍生性或懲罰性損害承擔責任。
          </p>
          <p>
            7.3
            第三方行為：本平台不對用戶之間的交易或互動負責，包括但不限於物品交接、食物分享等活動中可能發生的糾紛或損失。
          </p>

          <h2 class="text-xl font-semibold mt-8 mb-4">8. 條款修改</h2>
          <p>
            本平台保留隨時修改本條款的權利。修改後的條款將在本頁面上發布，並自發布之日起生效。繼續使用本平台，即表示您接受修改後的條款。建議您定期查閱本條款以了解任何變更。
          </p>

          <h2 class="text-xl font-semibold mt-8 mb-4">9. 適用法律與爭議解決</h2>
          <p>
            本條款受中華民國法律管轄。因使用本平台或本條款引起的任何爭議，雙方應首先通過友好協商解決；協商不成的，應提交至台灣桃園地方法院進行訴訟解決。
          </p>

          <h2 class="text-xl font-semibold mt-8 mb-4">10. 聯絡我們</h2>
          <p>
            如您對本條款有任何疑問或建議，請
            <NuxtLink
              to="/contact"
              class="text-emerald-600 hover:text-emerald-700"
            >
              聯絡我們
            </NuxtLink>
            。
          </p>

          <div class="mt-8 p-4 bg-gray-50 rounded-lg">
            <p class="font-medium">感謝您使用 LOFO 平台！</p>
            <p class="text-sm text-gray-600 mt-2">
              使用本平台即表示您已閱讀並同意本服務條款。我們鼓勵您積極參與社區互助，共同創造一個友善、誠信的校園環境。
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ArrowLeft } from "lucide-vue-next";
</script>
