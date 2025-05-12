<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-4xl mx-auto">
      <!-- 個人資料卡片 -->
      <div class="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div
          class="relative h-40 bg-gradient-to-r from-emerald-500 to-teal-400"
        ></div>
        <div class="relative px-6 pb-6">
          <div class="flex justify-between">
            <div class="flex-1">
              <div class="relative -mt-16 mb-4">
                <div
                  class="w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-gray-200"
                >
                  <img alt="用戶頭像" class="w-full h-full object-cover" />
                </div>
                <!-- <button class="absolute bottom-0 right-0 p-1.5 bg-gray  />
                </div> -->
              </div>
              <h1 class="text-2xl font-bold">王小明</h1>
              <p class="text-gray-500">@wangxiaoming</p>
            </div>
            <div class="mt-4">
              <button
                class="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
              >
                編輯個人資料
              </button>
            </div>
          </div>

          <!-- 用戶統計資訊 -->
          <div class="flex flex-wrap gap-6 mt-6">
            <div class="text-center">
              <p class="text-2xl font-bold">12</p>
              <p class="text-gray-500 text-sm">已發布物品</p>
            </div>
            <div class="text-center">
              <p class="text-2xl font-bold">8</p>
              <p class="text-gray-500 text-sm">已分享食物</p>
            </div>
            <div class="text-center">
              <p class="text-2xl font-bold">5</p>
              <p class="text-gray-500 text-sm">已幫助他人</p>
            </div>
            <div class="text-center">
              <p class="text-2xl font-bold">120</p>
              <p class="text-gray-500 text-sm">積分</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 功能導航卡片 -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center mb-4">
            <Package class="h-6 w-6 text-amber-500 mr-3" />
            <h2 class="text-xl font-semibold">我的遺失物</h2>
          </div>
          <p class="text-gray-600 mb-4">查看您發布的遺失物品和協助找回的物品</p>
          <NuxtLink to="/profile/items">
            <button
              class="w-full px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600 transition-colors"
            >
              查看我的遺失物
            </button>
          </NuxtLink>
        </div>

        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center mb-4">
            <Utensils class="h-6 w-6 text-emerald-500 mr-3" />
            <h2 class="text-xl font-semibold">我的食物分享</h2>
          </div>
          <p class="text-gray-600 mb-4">查看您分享的食物和預約的食物</p>
          <NuxtLink to="/profile/foods">
            <button
              class="w-full px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 transition-colors"
            >
              查看我的食物分享
            </button>
          </NuxtLink>
        </div>

        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center mb-4">
            <Bell class="h-6 w-6 text-blue-500 mr-3" />
            <h2 class="text-xl font-semibold">我的通知</h2>
          </div>
          <p class="text-gray-600 mb-4">查看系統通知和互動消息</p>
          <NuxtLink to="/notifications">
            <button
              class="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              查看我的通知
            </button>
          </NuxtLink>
        </div>

        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center mb-4">
            <CalendarClock class="h-6 w-6 text-purple-500 mr-3" />
            <h2 class="text-xl font-semibold">活動記錄</h2>
          </div>
          <p class="text-gray-600 mb-4">查看您在平台上的所有活動歷史記錄</p>
          <NuxtLink to="/activities">
            <button
              class="w-full px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors"
            >
              查看活動記錄
            </button>
          </NuxtLink>
        </div>
      </div>

      <!-- 帳戶設置卡片 -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-xl font-semibold mb-4">帳戶設置</h2>

        <div class="space-y-4">
          <div
            class="flex items-center justify-between p-3 hover:bg-gray-50 rounded-md transition-colors"
          >
            <div class="flex items-center">
              <User class="h-5 w-5 text-gray-500 mr-3" />
              <span>個人資料設置</span>
            </div>
            <ChevronRight class="h-5 w-5 text-gray-400" />
          </div>

          <div
            class="flex items-center justify-between p-3 hover:bg-gray-50 rounded-md transition-colors"
          >
            <div class="flex items-center">
              <Bell class="h-5 w-5 text-gray-500 mr-3" />
              <span>通知設置</span>
            </div>
            <ChevronRight class="h-5 w-5 text-gray-400" />
          </div>

          <div
            class="flex items-center justify-between p-3 hover:bg-gray-50 rounded-md transition-colors"
          >
            <div class="flex items-center">
              <Lock class="h-5 w-5 text-gray-500 mr-3" />
              <span>隱私與安全</span>
            </div>
            <ChevronRight class="h-5 w-5 text-gray-400" />
          </div>

          <div
            class="flex items-center justify-between p-3 hover:bg-gray-50 rounded-md transition-colors"
          >
            <div class="flex items-center">
              <KeyRound class="h-5 w-5 text-gray-500 mr-3" />
              <span>更改密碼</span>
            </div>
            <ChevronRight class="h-5 w-5 text-gray-400" />
          </div>

          <div
            class="flex items-center justify-between p-3 hover:bg-gray-50 rounded-md transition-colors"
          >
            <div class="flex items-center">
              <HelpCircle class="h-5 w-5 text-gray-500 mr-3" />
              <span>幫助與支援</span>
            </div>
            <ChevronRight class="h-5 w-5 text-gray-400" />
          </div>

          <div
            class="flex items-center justify-between p-3 hover:bg-gray-50 rounded-md transition-colors text-red-500"
          >
            <div class="flex items-center">
              <LogOut class="h-5 w-5 mr-3" />
              <span>登出</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  Package,
  Utensils,
  Bell,
  User,
  Lock,
  KeyRound,
  HelpCircle,
  LogOut,
  ChevronRight,
  CalendarClock,
} from "lucide-vue-next";
</script>
