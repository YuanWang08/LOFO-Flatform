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
        <h1 class="text-3xl font-bold mb-6">隱私政策</h1>
        <p class="text-gray-500 mb-8">最後更新日期：2025 年 5 月 12 日</p>

        <div class="prose max-w-none">
          <p>
            LOFO
            平台（以下簡稱「我們」或「本平台」）重視您的隱私。本隱私政策說明我們如何收集、使用、披露和保護您的個人資料。使用本平台，即表示您同意本隱私政策中描述的做法。
          </p>

          <h2 class="text-xl font-semibold mt-8 mb-4">1. 我們收集的資料</h2>
          <p>我們可能收集以下類型的個人資料：</p>
          <ul class="list-disc pl-6 space-y-2">
            <li>
              <strong>帳號資料</strong
              >：註冊時提供的資料，如姓名、電子郵件地址、密碼、頭像等。
            </li>
            <li>
              <strong>個人資料</strong
              >：您選擇在個人資料中提供的其他資訊，如聯絡方式、學校資訊等。
            </li>
            <li>
              <strong>內容資料</strong
              >：您在平台上發布的內容，包括遺失物登記、食物分享資訊、留言、評價等。
            </li>
            <li>
              <strong>位置資料</strong
              >：當您使用地圖標記功能時，我們會收集您標記的位置資訊。
            </li>
            <li>
              <strong>使用資料</strong
              >：有關您如何使用本平台的資訊，包括訪問時間、瀏覽頁面、點擊行為等。
            </li>
            <li>
              <strong>設備資料</strong>：有關您用於訪問本平台的設備的資訊，如 IP
              地址、瀏覽器類型、操作系統等。
            </li>
          </ul>

          <h2 class="text-xl font-semibold mt-8 mb-4">2. 我們如何收集資料</h2>
          <p>我們通過以下方式收集您的個人資料：</p>
          <ul class="list-disc pl-6 space-y-2">
            <li>
              <strong>直接提供</strong
              >：您在註冊帳號、填寫個人資料、發布內容或與其他用戶互動時直接提供的資訊。
            </li>
            <li>
              <strong>自動收集</strong
              >：當您使用本平台時，我們會自動收集某些資訊，如 IP
              地址、瀏覽器類型、訪問時間等。
            </li>
            <li>
              <strong>Cookie 和類似技術</strong>：我們使用 Cookie
              和類似技術來收集和存儲有關您使用本平台的資訊。
            </li>
            <li>
              <strong>第三方來源</strong
              >：在某些情況下，我們可能從第三方來源獲取您的資訊，如您選擇使用第三方帳號（如
              Google 或 Facebook）登入時。
            </li>
          </ul>

          <h2 class="text-xl font-semibold mt-8 mb-4">
            3. 我們如何使用您的資料
          </h2>
          <p>我們可能將您的個人資料用於以下目的：</p>
          <ul class="list-disc pl-6 space-y-2">
            <li>提供、維護和改進本平台的服務</li>
            <li>處理和管理您的帳號</li>
            <li>促進用戶之間的互動和交流</li>
            <li>匹配遺失物與撿到物品的資訊</li>
            <li>發送通知、更新和支援訊息</li>
            <li>防止、調查和處理欺詐、未經授權或非法活動</li>
            <li>確保本平台的安全性和完整性</li>
            <li>遵守法律義務</li>
            <li>經您同意的其他目的</li>
          </ul>

          <h2 class="text-xl font-semibold mt-8 mb-4">4. 資料共享與披露</h2>
          <p>我們可能在以下情況下共享您的個人資料：</p>
          <ul class="list-disc pl-6 space-y-2">
            <li>
              <strong>與其他用戶</strong
              >：當您發布遺失物登記或食物分享資訊時，您提供的某些資訊（如物品描述、位置、聯絡方式等）將對其他用戶可見。
            </li>
            <li>
              <strong>服務提供商</strong
              >：我們可能與幫助我們提供服務的第三方服務提供商共享資料，如雲存儲提供商、支付處理商等。
            </li>
            <li>
              <strong>法律要求</strong
              >：如法律要求、法院命令或政府機構的合法要求，我們可能披露您的資料。
            </li>
            <li>
              <strong>保護權益</strong
              >：當我們認為披露是保護本平台、我們的用戶或公眾的權利、財產或安全所必需時。
            </li>
            <li>
              <strong>業務轉讓</strong
              >：如果本平台涉及合併、收購或資產出售，您的資料可能作為此類交易的一部分被轉讓。
            </li>
            <li><strong>經您同意</strong>：在您同意的其他情況下。</li>
          </ul>

          <h2 class="text-xl font-semibold mt-8 mb-4">5. 資料安全</h2>
          <p>
            我們採取合理的技術和組織措施來保護您的個人資料免受未經授權的訪問、使用或披露。然而，請注意，沒有任何網絡傳輸或電子存儲方法是
            100%
            安全的。因此，雖然我們努力保護您的個人資料，但我們不能保證其絕對安全。
          </p>

          <h2 class="text-xl font-semibold mt-8 mb-4">6. 資料保留</h2>
          <p>
            我們將在實現本隱私政策中所述目的所需的時間內保留您的個人資料，除非法律要求或允許更長的保留期限。當不再需要您的個人資料時，我們將安全地刪除或匿名化處理這些資料。
          </p>

          <h2 class="text-xl font-semibold mt-8 mb-4">7. 您的權利</h2>
          <p>根據適用的資料保護法律，您可能擁有以下權利：</p>
          <ul class="list-disc pl-6 space-y-2">
            <li>
              <strong>訪問權</strong
              >：您有權獲取我們持有的關於您的個人資料的副本。
            </li>
            <li>
              <strong>更正權</strong>：您有權要求更正不準確或不完整的個人資料。
            </li>
            <li>
              <strong>刪除權</strong
              >：在某些情況下，您有權要求刪除您的個人資料。
            </li>
            <li>
              <strong>限制處理權</strong
              >：在某些情況下，您有權要求限制處理您的個人資料。
            </li>
            <li>
              <strong>資料可攜權</strong
              >：您有權以結構化、常用和機器可讀的格式接收您提供給我們的個人資料，並有權將這些資料傳輸給另一個控制者。
            </li>
            <li>
              <strong>反對權</strong
              >：在某些情況下，您有權反對處理您的個人資料。
            </li>
            <li>
              <strong>撤回同意權</strong
              >：如果我們基於您的同意處理您的個人資料，您有權隨時撤回您的同意。
            </li>
          </ul>
          <p>
            如果您希望行使上述任何權利，請
            <NuxtLink
              to="/contact"
              class="text-emerald-600 hover:text-emerald-700"
            >
              聯絡我們
            </NuxtLink>
            。
          </p>

          <h2 class="text-xl font-semibold mt-8 mb-4">8. Cookie 政策</h2>
          <p>
            我們使用 Cookie 和類似技術來收集和存儲有關您使用本平台的資訊。Cookie
            是存儲在您設備上的小型文本文件，用於記住您的偏好和設置，提供個性化體驗，以及幫助我們了解您如何使用本平台。
          </p>
          <p>我們使用以下類型的 Cookie：</p>
          <ul class="list-disc pl-6 space-y-2">
            <li>
              <strong>必要 Cookie</strong>：這些 Cookie
              對於本平台的運作是必不可少的，不能在我們的系統中關閉。
            </li>
            <li>
              <strong>功能 Cookie</strong>：這些 Cookie
              使本平台能夠記住您的選擇（如語言偏好）並提供增強的個性化功能。
            </li>
            <li>
              <strong>分析 Cookie</strong>：這些 Cookie
              幫助我們了解用戶如何使用本平台，以便我們改進服務。
            </li>
          </ul>
          <p>
            大多數網絡瀏覽器允許您控制 Cookie 的使用。您可以設置瀏覽器拒絕
            Cookie 或在 Cookie 被發送時通知您。然而，如果您選擇拒絕
            Cookie，本平台的某些功能可能無法正常工作。
          </p>

          <h2 class="text-xl font-semibold mt-8 mb-4">9. 兒童隱私</h2>
          <p>
            本平台不面向 16 歲以下的兒童。我們不會故意收集 16
            歲以下兒童的個人資料。如果您是父母或監護人，並且您認為您的孩子向我們提供了個人資料，請
            <NuxtLink
              to="/contact"
              class="text-emerald-600 hover:text-emerald-700"
            >
              聯絡我們
            </NuxtLink>
            ，我們將採取措施從我們的系統中刪除這些資料。
          </p>

          <h2 class="text-xl font-semibold mt-8 mb-4">10. 隱私政策的變更</h2>
          <p>
            我們可能會不時更新本隱私政策。更新後的政策將在本頁面上發布，並自發布之日起生效。如果我們對本隱私政策進行重大更改，我們將通過在本平台上發布通知或向您發送電子郵件來通知您。建議您定期查閱本隱私政策以了解任何變更。
          </p>

          <h2 class="text-xl font-semibold mt-8 mb-4">11. 聯絡我們</h2>
          <p>
            如果您對本隱私政策有任何疑問、意見或請求，請
            <NuxtLink
              to="/contact"
              class="text-emerald-600 hover:text-emerald-700"
            >
              聯絡我們
            </NuxtLink>
            。
          </p>

          <div class="mt-8 p-4 bg-gray-50 rounded-lg">
            <p class="font-medium">感謝您信任 LOFO 平台！</p>
            <p class="text-sm text-gray-600 mt-2">
              我們致力於保護您的隱私和個人資料安全。如果您對我們的隱私做法有任何疑慮，請隨時與我們聯絡。
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
