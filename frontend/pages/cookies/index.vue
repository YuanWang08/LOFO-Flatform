<template>
  <div class="container mx-auto px-4 py-8 max-w-4xl">
    <!-- 返回按鈕 -->
    <div class="mb-6">
      <NuxtLink
        to="/"
        class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
      >
        <ArrowLeft class="mr-2 h-4 w-4" />
        返回首頁
      </NuxtLink>
    </div>

    <div class="bg-white rounded-lg shadow-md p-8">
      <h1 class="text-3xl font-bold mb-6 text-emerald-600">Cookies 政策</h1>

      <div class="prose max-w-none">
        <p class="text-gray-600 mb-8">最後更新日期：2023年5月15日</p>

        <section class="mb-8">
          <h2 class="text-2xl font-semibold mb-4">什麼是 Cookies？</h2>
          <p>
            Cookies 是小型文本文件，當您訪問網站時，這些文件會存儲在您的設備上。
            它們被廣泛用於使網站正常運行，並提供網站擁有者有關用戶體驗的信息。
          </p>
        </section>

        <section class="mb-8">
          <h2 class="text-2xl font-semibold mb-4">我們如何使用 Cookies</h2>
          <p class="mb-4">
            LOFO 平台使用 cookies
            來提供更好的用戶體驗、記住您的偏好設置，並幫助我們了解您如何使用我們的網站。
            我們使用的 cookies 類型包括：
          </p>
          <ul class="list-disc pl-6 space-y-2">
            <li>
              <strong>必要性 Cookies：</strong> 這些 cookies
              對於網站的基本功能是必不可少的，無法禁用。
            </li>
            <li>
              <strong>功能性 Cookies：</strong> 這些 cookies
              使我們能夠記住您的偏好設置和選擇，例如語言偏好或登錄信息。
            </li>
            <li>
              <strong>分析性 Cookies：</strong> 這些 cookies
              幫助我們了解用戶如何與我們的網站互動，使我們能夠改進我們的服務。
            </li>
            <li>
              <strong>廣告 Cookies：</strong> 這些 cookies
              用於向您展示相關廣告，並幫助我們衡量廣告活動的效果。
            </li>
          </ul>
        </section>

        <section class="mb-8">
          <h2 class="text-2xl font-semibold mb-4">第三方 Cookies</h2>
          <p>
            除了我們自己的 cookies 外，我們還可能使用第三方服務提供商的
            cookies，例如分析工具和社交媒體平台。 這些第三方可能會使用 cookies
            來收集有關您使用我們網站的信息，並可能將這些信息與他們收集的其他信息結合使用。
          </p>
        </section>

        <section class="mb-8">
          <h2 class="text-2xl font-semibold mb-4">我們使用的具體 Cookies</h2>
          <div class="overflow-x-auto">
            <table class="min-w-full border-collapse border border-gray-300">
              <thead>
                <tr class="bg-gray-100">
                  <th class="border border-gray-300 px-4 py-2 text-left">
                    Cookie 名稱
                  </th>
                  <th class="border border-gray-300 px-4 py-2 text-left">
                    提供者
                  </th>
                  <th class="border border-gray-300 px-4 py-2 text-left">
                    目的
                  </th>
                  <th class="border border-gray-300 px-4 py-2 text-left">
                    過期時間
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="border border-gray-300 px-4 py-2">session_id</td>
                  <td class="border border-gray-300 px-4 py-2">LOFO</td>
                  <td class="border border-gray-300 px-4 py-2">
                    維持用戶登錄狀態
                  </td>
                  <td class="border border-gray-300 px-4 py-2">30天</td>
                </tr>
                <tr class="bg-gray-50">
                  <td class="border border-gray-300 px-4 py-2">
                    language_preference
                  </td>
                  <td class="border border-gray-300 px-4 py-2">LOFO</td>
                  <td class="border border-gray-300 px-4 py-2">
                    記住用戶語言偏好
                  </td>
                  <td class="border border-gray-300 px-4 py-2">1年</td>
                </tr>
                <tr>
                  <td class="border border-gray-300 px-4 py-2">_ga</td>
                  <td class="border border-gray-300 px-4 py-2">
                    Google Analytics
                  </td>
                  <td class="border border-gray-300 px-4 py-2">分析用戶行為</td>
                  <td class="border border-gray-300 px-4 py-2">2年</td>
                </tr>
                <tr class="bg-gray-50">
                  <td class="border border-gray-300 px-4 py-2">_fbp</td>
                  <td class="border border-gray-300 px-4 py-2">Facebook</td>
                  <td class="border border-gray-300 px-4 py-2">追蹤廣告效果</td>
                  <td class="border border-gray-300 px-4 py-2">3個月</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section class="mb-8">
          <h2 class="text-2xl font-semibold mb-4">如何管理 Cookies</h2>
          <p class="mb-4">
            大多數網絡瀏覽器允許您通過瀏覽器設置控制
            cookies。您可以設置瀏覽器拒絕接受 cookies，或在設置 cookie
            時通知您。 但請注意，禁用某些 cookies
            可能會影響我們網站的功能和您的用戶體驗。
          </p>
          <p class="mb-4">以下是一些常見瀏覽器的 cookie 管理指南：</p>
          <ul class="list-disc pl-6 space-y-2">
            <li>
              <a
                href="https://support.google.com/chrome/answer/95647"
                target="_blank"
                rel="noopener noreferrer"
                class="text-emerald-600 hover:underline"
                >Google Chrome</a
              >
            </li>
            <li>
              <a
                href="https://support.mozilla.org/zh-TW/kb/cookies-information-websites-store-on-your-computer"
                target="_blank"
                rel="noopener noreferrer"
                class="text-emerald-600 hover:underline"
                >Mozilla Firefox</a
              >
            </li>
            <li>
              <a
                href="https://support.apple.com/zh-tw/guide/safari/sfri11471/mac"
                target="_blank"
                rel="noopener noreferrer"
                class="text-emerald-600 hover:underline"
                >Safari</a
              >
            </li>
            <li>
              <a
                href="https://support.microsoft.com/zh-tw/microsoft-edge/在-microsoft-edge-中刪除-cookie-63947406-40ac-c3b8-57b9-2a946a29ae09"
                target="_blank"
                rel="noopener noreferrer"
                class="text-emerald-600 hover:underline"
                >Microsoft Edge</a
              >
            </li>
          </ul>
        </section>

        <section class="mb-8">
          <h2 class="text-2xl font-semibold mb-4">Cookie 同意</h2>
          <p>
            當您首次訪問我們的網站時，我們會要求您同意使用非必要性
            cookies。您可以隨時通過點擊網站底部的「Cookie 設置」來更改您的
            cookie 偏好。
          </p>
        </section>

        <section class="mb-8">
          <h2 class="text-2xl font-semibold mb-4">政策變更</h2>
          <p>
            我們可能會不時更新此 Cookie
            政策。任何變更將在本頁面上發布，如有重大變更，我們將通過網站通知或電子郵件通知您。
            我們建議您定期查看此頁面以了解我們 Cookie 使用的最新信息。
          </p>
        </section>

        <section>
          <h2 class="text-2xl font-semibold mb-4">聯絡我們</h2>
          <p class="mb-4">
            如果您對我們的 Cookie 政策有任何疑問或需要更多信息，請聯絡我們：
          </p>
          <ul class="list-disc pl-6 space-y-2">
            <li>電子郵件：privacy@lofo.example.com</li>
            <li>電話：(02) 1234-5678</li>
            <li>地址：台北市信義區松高路1號</li>
          </ul>
          <p class="mt-4">
            您也可以訪問我們的<NuxtLink
              to="/privacy"
              class="text-emerald-600 hover:underline"
              >隱私政策</NuxtLink
            >頁面，了解更多關於我們如何處理您的個人數據的信息。
          </p>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ArrowLeft } from "lucide-vue-next";
</script>
