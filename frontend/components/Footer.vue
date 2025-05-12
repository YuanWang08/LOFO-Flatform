<template>
  <footer class="bg-gray-100 pt-12 pb-6 mt-12">
    <div class="container mx-auto px-4">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        <!-- 平台資訊 -->
        <div>
          <h3 class="text-lg font-bold mb-4">LOFO 平台</h3>
          <p class="text-gray-600 mb-4">
            LOFO
            是一個專為校園設計的遺失物與食物資訊分享平台，致力於幫助用戶尋回遺失物品並減少食物浪費。
          </p>
          <div class="flex space-x-4">
            <NuxtLink
              to="https://facebook.com"
              class="text-gray-500 hover:text-emerald-600 transition-colors"
            >
              <Facebook size="20" />
              <span class="sr-only">Facebook</span>
            </NuxtLink>
            <NuxtLink
              to="https://instagram.com"
              class="text-gray-500 hover:text-emerald-600 transition-colors"
            >
              <Instagram size="20" />
              <span class="sr-only">Instagram</span>
            </NuxtLink>
            <NuxtLink
              to="https://twitter.com"
              class="text-gray-500 hover:text-emerald-600 transition-colors"
            >
              <Twitter size="20" />
              <span class="sr-only">Twitter</span>
            </NuxtLink>
            <NuxtLink
              to="https://github.com"
              class="text-gray-500 hover:text-emerald-600 transition-colors"
            >
              <Github size="20" />
              <span class="sr-only">Github</span>
            </NuxtLink>
          </div>
        </div>

        <!-- 快速連結 -->
        <div>
          <h3 class="text-lg font-bold mb-4">快速連結</h3>
          <ul class="space-y-2">
            <li>
              <NuxtLink
                to="/map"
                class="text-gray-600 hover:text-emerald-600 transition-colors"
              >
                互動地圖
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/items"
                class="text-gray-600 hover:text-emerald-600 transition-colors"
              >
                遺失物列表
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/foods"
                class="text-gray-600 hover:text-emerald-600 transition-colors"
              >
                食物分享列表
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/submit/item"
                class="text-gray-600 hover:text-emerald-600 transition-colors"
              >
                登記遺失物
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/submit/food"
                class="text-gray-600 hover:text-emerald-600 transition-colors"
              >
                分享食物
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- 幫助與支援 -->
        <div>
          <h3 class="text-lg font-bold mb-4">幫助與支援</h3>
          <ul class="space-y-2">
            <li>
              <NuxtLink
                to="/faq"
                class="text-gray-600 hover:text-emerald-600 transition-colors"
              >
                常見問題
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/guide"
                class="text-gray-600 hover:text-emerald-600 transition-colors"
              >
                使用指南
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/terms"
                class="text-gray-600 hover:text-emerald-600 transition-colors"
              >
                服務條款
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/privacy"
                class="text-gray-600 hover:text-emerald-600 transition-colors"
              >
                隱私政策
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/contact"
                class="text-gray-600 hover:text-emerald-600 transition-colors"
              >
                聯絡我們
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- 聯絡資訊 -->
        <div>
          <h3 class="text-lg font-bold mb-4">聯絡資訊</h3>
          <ul class="space-y-3">
            <li class="flex items-start">
              <MapPin
                size="18"
                class="mr-2 text-emerald-600 flex-shrink-0 mt-0.5"
              />
              <span class="text-gray-600">32001 桃園市中壢區中大路300號</span>
            </li>
            <li class="flex items-center">
              <Phone size="18" class="mr-2 text-emerald-600 flex-shrink-0" />
              <span class="text-gray-600">0800-770-885</span>
            </li>
            <li class="flex items-center">
              <Mail size="18" class="mr-2 text-emerald-600 flex-shrink-0" />
              <span class="text-gray-600">support@lofo.edu.tw</span>
            </li>
          </ul>
        </div>
      </div>

      <div class="border-t border-gray-200 pt-6">
        <div class="flex flex-col md:flex-row justify-between items-center">
          <p class="text-gray-500 text-sm mb-4 md:mb-0">
            © {{ new Date().getFullYear() }} LOFO 平台. 保留所有權利.
          </p>
          <div class="flex space-x-4 text-sm">
            <NuxtLink
              to="/terms"
              class="text-gray-500 hover:text-emerald-600 transition-colors"
            >
              服務條款
            </NuxtLink>
            <NuxtLink
              to="/privacy"
              class="text-gray-500 hover:text-emerald-600 transition-colors"
            >
              隱私政策
            </NuxtLink>
            <NuxtLink
              to="/cookies"
              class="text-gray-500 hover:text-emerald-600 transition-colors"
            >
              Cookie 政策
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import {
  Facebook,
  Instagram,
  Twitter,
  Mail,
  Phone,
  MapPin,
  Github,
} from "lucide-vue-next";
</script>
