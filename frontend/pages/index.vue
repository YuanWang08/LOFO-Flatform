<template>
  <div class="container mx-auto px-4 py-8">
    <section class="py-12 md:py-20">
      <div class="max-w-4xl mx-auto text-center">
        <h1 class="text-4xl md:text-6xl font-bold mb-6">
          LOFO 遺失物與食物資訊分享平台
        </h1>
        <p class="text-xl md:text-2xl mb-8">
          透過地圖標記、智能分析與社群互動，讓尋物與分享食物變得更簡單
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <NuxtLink
            to="/map"
            class="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg text-lg font-medium transition-colors"
          >
            開始探索地圖
          </NuxtLink>
          <NuxtLink
            to="/submit/item"
            class="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg text-lg font-medium transition-colors"
          >
            登記遺失物
          </NuxtLink>
        </div>
      </div>
    </section>

    <section class="py-12 bg-gray-50 rounded-xl">
      <div class="max-w-6xl mx-auto">
        <h2 class="text-3xl font-bold text-center mb-12">平台特色</h2>
        <div class="grid md:grid-cols-3 gap-8">
          <div class="bg-white p-6 rounded-lg shadow-md">
            <div
              class="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-4 mx-auto"
            >
              <MapPin class="text-emerald-600" size="24" />
            </div>
            <h3 class="text-xl font-semibold text-center mb-3">地圖標記系統</h3>
            <p class="text-gray-600 text-center">
              透過互動式地圖，精確標記遺失物與食物分享的位置，讓尋找與分享更加直觀
            </p>
          </div>
          <div class="bg-white p-6 rounded-lg shadow-md">
            <div
              class="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-4 mx-auto"
            >
              <Search class="text-amber-600" size="24" />
            </div>
            <h3 class="text-xl font-semibold text-center mb-3">智能搜尋</h3>
            <p class="text-gray-600 text-center">
              結合AI技術，自動生成關鍵字與標籤，讓搜尋更精準，提高尋回物品的機率
            </p>
          </div>
          <div class="bg-white p-6 rounded-lg shadow-md">
            <div
              class="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mb-4 mx-auto"
            >
              <Share2 class="text-rose-600" size="24" />
            </div>
            <h3 class="text-xl font-semibold text-center mb-3">食物共享</h3>
            <p class="text-gray-600 text-center">
              設定食物份數與有效時間，讓多餘的食物不被浪費，透過預約系統避免白跑一趟
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="py-12">
      <div class="max-w-6xl mx-auto">
        <h2 class="text-3xl font-bold text-center mb-12">如何使用</h2>
        <div class="grid md:grid-cols-2 gap-12">
          <div class="bg-emerald-50 p-6 rounded-lg">
            <h3 class="text-2xl font-semibold mb-4 text-emerald-700">
              遺失物協尋
            </h3>
            <ol class="space-y-4 list-decimal list-inside text-gray-700">
              <li>在地圖上標記您撿到或遺失物品的位置</li>
              <li>上傳物品照片與詳細描述</li>
              <li>系統會自動生成關鍵標籤，提高搜尋匹配率</li>
              <li>透過站內通知或郵件接收最新進展</li>
              <li>成功協助他人尋回物品可獲得積分提升等級</li>
            </ol>
            <div class="mt-6">
              <NuxtLink
                to="/submit/item"
                class="inline-block bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-lg font-medium transition-colors"
              >
                登記遺失物
              </NuxtLink>
            </div>
          </div>
          <div class="bg-amber-50 p-6 rounded-lg">
            <h3 class="text-2xl font-semibold mb-4 text-amber-700">食物分享</h3>
            <ol class="space-y-4 list-decimal list-inside text-gray-700">
              <li>在地圖上標記您想分享食物的位置</li>
              <li>上傳食物照片與詳細資訊（份數、保存期限等）</li>
              <li>設定可取用時間與預約選項</li>
              <li>其他用戶可預約並在指定時間取用</li>
              <li>成功分享食物可獲得積分提升等級</li>
            </ol>
            <div class="mt-6">
              <NuxtLink
                to="/submit/food"
                class="inline-block bg-amber-500 hover:bg-amber-600 text-white px-5 py-2 rounded-lg font-medium transition-colors"
              >
                分享食物
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="py-12 bg-gray-50 rounded-xl">
      <div class="max-w-4xl mx-auto text-center">
        <div
          class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6 mx-auto"
        >
          <Award class="text-purple-600" size="32" />
        </div>
        <h2 class="text-3xl font-bold mb-6">積分與等級系統</h2>
        <p class="text-xl mb-8">
          透過協助他人尋回物品或分享食物獲得積分，提升您的平台等級。
          等級越高，您的個人資料將獲得獨特的標識，展示您對社群的貢獻。
        </p>
        <NuxtLink
          to="/profile"
          class="inline-block bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg text-lg font-medium transition-colors"
        >
          查看我的積分
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup>
import { MapPin, Search, Share2, Award } from "lucide-vue-next";
</script>
