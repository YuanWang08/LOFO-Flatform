<template>
  <div class="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
    <div
      class="flex flex-col lg:flex-row bg-white rounded-lg shadow-lg overflow-hidden"
    >
      <!-- 聊天列表側邊欄 -->
      <div class="w-full lg:w-1/3 bg-gray-50 border-r border-gray-200">
        <div class="p-4 border-b border-gray-200">
          <h2 class="text-xl font-semibold text-gray-800">最近聊天</h2>
        </div>

        <!-- 搜尋欄 -->
        <div class="p-4 border-b border-gray-200">
          <div class="relative">
            <input
              type="text"
              v-model="searchQuery"
              placeholder="搜尋用戶..."
              class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span class="absolute right-3 top-2.5 text-gray-400">
              <i class="fas fa-search"></i>
            </span>
          </div>
        </div>
        <!-- 聊天列表 -->
        <div
          class="overflow-y-auto"
          style="height: calc(100vh - 200px); max-height: 400px"
        >
          <div v-if="loading" class="p-4 text-center text-gray-500">
            <div
              class="animate-spin inline-block w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full mr-2"
            ></div>
            載入中...
          </div>

          <div
            v-else-if="recentChats.length === 0"
            class="p-4 text-center text-gray-500"
          >
            暫無最近聊天
          </div>

          <div
            v-else
            v-for="chat in filteredChats"
            :key="chat.userId"
            @click="selectChat(chat.userId)"
            class="p-4 border-b border-gray-200 hover:bg-gray-100 cursor-pointer transition-colors"
            :class="{ 'bg-blue-50': selectedUserId === chat.userId }"
          >
            <div class="flex items-center space-x-3">
              <div class="relative">
                <img
                  :src="getUserAvatar(chat.userId)"
                  alt="用戶頭像"
                  class="w-12 h-12 rounded-full object-cover"
                />
                <span
                  v-if="isUserOnline(chat.userId)"
                  class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"
                ></span>
              </div>
              <div class="flex-1 min-w-0">
                <h3 class="text-sm font-medium text-gray-900 truncate">
                  {{ getUserName(chat.userId) }}
                </h3>
                <p class="text-sm text-gray-500 truncate">
                  {{ chat.lastMessage }}
                </p>
              </div>
              <div class="text-xs text-gray-400">
                {{ formatTime(chat.timestamp) }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 聊天內容區域 -->
      <div class="w-full lg:w-2/3 flex flex-col">
        <div
          v-if="!selectedUserId"
          class="flex-1 flex items-center justify-center bg-gray-50 p-8"
        >
          <div class="text-center">
            <div class="text-gray-400 mb-2">
              <i class="fas fa-comments text-5xl"></i>
            </div>
            <h3 class="text-xl font-medium text-gray-700 mb-2">選擇一個聊天</h3>
            <p class="text-gray-500">從左側選擇一個聊天室開始對話</p>
          </div>
        </div>

        <template v-else>
          <!-- 聊天標題 -->
          <div
            class="p-4 border-b border-gray-200 flex items-center justify-between"
          >
            <div class="flex items-center space-x-3">
              <img
                :src="getUserAvatar(selectedUserId)"
                alt="用戶頭像"
                class="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <h3 class="text-lg font-medium text-gray-900">
                  {{ getUserName(selectedUserId) }}
                </h3>
                <p v-if="isTyping" class="text-xs text-gray-500">正在輸入...</p>
                <p
                  v-else-if="isUserOnline(selectedUserId)"
                  class="text-xs text-green-500"
                >
                  在線
                </p>
                <p v-else class="text-xs text-gray-500">離線</p>
              </div>
            </div>
          </div>
          <!-- 聊天訊息 -->
          <div
            ref="messageContainer"
            class="flex-1 overflow-y-auto p-4 bg-gray-50"
            style="height: calc(100vh - 240px); max-height: 440px"
          >
            <div v-if="loading" class="text-center text-gray-500 py-4">
              <div
                class="animate-spin inline-block w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full mr-2"
              ></div>
              載入訊息中...
            </div>
            <div
              v-else-if="messages.length === 0"
              class="text-center text-gray-500 py-4"
            >
              暫無訊息，發送第一條訊息開始對話吧！
            </div>
            <div v-else>
              <div
                v-for="(message, index) in messages"
                :key="message._id"
                class="mb-4"
              >
                <!-- 日期分隔線 -->
                <div
                  v-if="showDateDivider(message, index)"
                  class="flex justify-center my-4"
                >
                  <div
                    class="bg-gray-200 rounded-full px-3 py-1 text-xs text-gray-600"
                  >
                    {{ formatDate(message.timestamp) }}
                  </div>
                </div>

                <!-- 訊息氣泡 -->
                <div
                  class="flex"
                  :class="
                    message.senderId === currentUser.user_id
                      ? 'justify-end'
                      : 'justify-start'
                  "
                >
                  <div
                    v-if="message.senderId !== currentUser.user_id"
                    class="mr-2 flex-shrink-0"
                  >
                    <img
                      :src="getUserAvatar(message.senderId)"
                      alt="用戶頭像"
                      class="w-8 h-8 rounded-full object-cover"
                    />
                  </div>
                  <div
                    class="max-w-[70%] rounded-lg px-4 py-2 break-words"
                    :class="
                      message.senderId === currentUser.user_id
                        ? 'bg-blue-500 text-white rounded-br-none'
                        : 'bg-white text-gray-800 rounded-bl-none'
                    "
                  >
                    <div class="text-sm">{{ message.content }}</div>
                    <div
                      class="text-xs mt-1 text-right"
                      :class="
                        message.senderId === currentUser.user_id
                          ? 'text-blue-100'
                          : 'text-gray-400'
                      "
                    >
                      {{ formatMessageTime(message.timestamp) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 訊息輸入區域 -->
          <div class="p-4 border-t border-gray-200 bg-white">
            <form @submit.prevent="sendMessage" class="flex space-x-2">
              <div class="flex-1 relative">
                <textarea
                  v-model="newMessage"
                  @input="handleTyping"
                  @keydown.enter.prevent="sendMessage"
                  placeholder="輸入訊息..."
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none overflow-hidden max-h-32"
                  :rows="newMessageRows"
                ></textarea>
              </div>
              <button
                type="submit"
                :disabled="!newMessage.trim()"
                class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send class="h-5 w-5" />
              </button>
            </form>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted, nextTick } from "vue";
import { io } from "socket.io-client";
import { useAuthStore } from "~/stores/auth";
import { useRouter, useRoute } from "vue-router";
import { useCookie } from "#app";
import { Send } from "lucide-vue-next";

const router = useRouter();
const authStore = useAuthStore();
const config = useRuntimeConfig();

// 響應式狀態
const socket = ref(null);
const currentUser = ref(null);
const recentChats = ref([]);
const messages = ref([]);
const selectedUserId = ref(null);
const newMessage = ref("");
const newMessageRows = ref(1);
const searchQuery = ref("");
const loading = ref(false);
const userTypingTimeout = ref(null);
const isTyping = ref(false);
const messageContainer = ref(null);
const authCookie = useCookie("auth_token");
const userCache = ref({}); // 新增：用戶資訊快取

// 計算屬性
const filteredChats = computed(() => {
  if (!searchQuery.value.trim()) return recentChats.value;

  return recentChats.value.filter((chat) =>
    getUserName(chat.userId)
      .toLowerCase()
      .includes(searchQuery.value.toLowerCase())
  );
});

// 方法
const initializeSocket = () => {
  const baseUrl = config.public.SOCKET_URL || "http://localhost:3001";

  socket.value = io(baseUrl, {
    auth: {
      token: authCookie.value,
    },
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });

  // socket 連接事件監聽
  socket.value.on("connect", () => {
    console.log("Socket connected");
  });
  socket.value.on("connect_error", (error) => {
    console.error("Socket connection error:", error);
    if (error.message.includes("身份驗證失敗")) {
      // 如果是認證錯誤，可能需要重新登錄
      alert("連接失敗：身份認證問題，請重新登錄");
      router.push("/login");
    } else {
      alert(`連接失敗：${error.message || "未知錯誤"}`);
    }
  });

  socket.value.on("error", (data) => {
    console.error("Socket error:", data);
    alert(data.message);
  });

  // 監聽私人訊息
  socket.value.on("private-message", (message) => {
    // 如果是當前正在聊天的用戶，直接加入訊息列表
    if (selectedUserId.value === message.senderId) {
      messages.value.push(message);
      scrollToBottom();
    }

    // 更新最近聊天列表
    updateRecentChatsList(message);
  });

  // 監聽訊息發送確認
  socket.value.on("message-sent", (message) => {
    // 尋找是否有同樣ID的訊息，如果沒有才添加
    const existingMessage = messages.value.find((m) => m._id === message._id);
    if (!existingMessage) {
      messages.value.push(message);
      scrollToBottom();
    }

    // 更新最近聊天列表
    updateRecentChatsList(message);
  });

  // 監聽對方正在輸入
  socket.value.on("private-user-typing", (data) => {
    if (selectedUserId.value === data.user_id) {
      isTyping.value = data.isTyping;
    }
  });
};

const fetchRecentChats = async () => {
  try {
    loading.value = true;
    const response = await fetch(
      `${config.public.BACKEND_BASE_URL}/chat/recent`,
      {
        headers: {
          Authorization: `Bearer ${useCookie("auth_token").value}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "獲取最近聊天列表失敗");
    }

    const result = await response.json();
    if (result.success) {
      recentChats.value = result.data;

      // 預先獲取所有聊天對象的用戶資訊
      for (const chat of recentChats.value) {
        fetchUserInfo(chat.userId);
      }
    }
  } catch (error) {
    console.error("獲取最近聊天列表失敗:", error);
  } finally {
    loading.value = false;
  }
};

const selectChat = (userId) => {
  selectedUserId.value = userId;
  fetchMessages(userId);

  // 確保我們有這個用戶的資訊
  fetchUserInfo(userId);

  // 可選：標記為已讀
};

const fetchMessages = async (userId) => {
  messages.value = [];
  loading.value = true;

  try {
    const response = await fetch(
      `${config.public.BACKEND_BASE_URL}/chat/private/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${useCookie("auth_token").value}`,
        },
      }
    );
    const result = await response.json();
    if (result.success) {
      messages.value = result.data.messages;
      scrollToBottom();
    }
  } catch (error) {
    console.error("獲取聊天記錄失敗:", error);
  } finally {
    loading.value = false;
  }
};

const updateRecentChatsList = (message) => {
  // 檢查這個用戶是否已經在列表中
  const existingChat = recentChats.value.find(
    (chat) =>
      chat.userId ===
      (message.senderId === currentUser.value.user_id
        ? message.receiverId
        : message.senderId)
  );

  const partnerId =
    message.senderId === currentUser.value.user_id
      ? message.receiverId
      : message.senderId;

  if (existingChat) {
    // 更新現有聊天
    existingChat.lastMessage = message.content;
    existingChat.timestamp = message.timestamp;

    // 重新排序列表
    recentChats.value.sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );
  } else {
    // 添加新聊天
    recentChats.value.unshift({
      userId: partnerId,
      lastMessage: message.content,
      timestamp: message.timestamp,
    });
  }
};

const sendMessage = () => {
  if (!newMessage.value.trim() || !selectedUserId.value) return;

  // 透過 socket 發送訊息
  socket.value.emit("private-message", {
    receiverId: selectedUserId.value,
    content: newMessage.value.trim(),
  });

  // 清空輸入框
  newMessage.value = "";
  newMessageRows.value = 1;

  // 通知對方我已停止輸入
  socket.value.emit("private-typing", {
    receiverId: selectedUserId.value,
    isTyping: false,
  });
};

const handleTyping = () => {
  // 根據內容調整輸入框高度
  const lines = newMessage.value.split("\n").length;
  newMessageRows.value = Math.min(Math.max(1, lines), 4);

  // 通知對方我正在輸入
  if (selectedUserId.value) {
    // 清除之前的計時器
    clearTimeout(userTypingTimeout.value);

    // 發送正在輸入狀態
    socket.value.emit("private-typing", {
      receiverId: selectedUserId.value,
      isTyping: true,
    });

    // 設定計時器，3秒後自動停止輸入狀態
    userTypingTimeout.value = setTimeout(() => {
      socket.value.emit("private-typing", {
        receiverId: selectedUserId.value,
        isTyping: false,
      });
    }, 3000);
  }
};

const scrollToBottom = () => {
  // 等待 DOM 更新後滾動至底部
  nextTick(() => {
    if (messageContainer.value) {
      messageContainer.value.scrollTop = messageContainer.value.scrollHeight;
    }
  });
};

const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}年${month}月${day}日`;
};

const formatMessageTime = (timestamp) => {
  const date = new Date(timestamp);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};

const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  const now = new Date();
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  // 判斷是否為今天
  if (isSameDay(date, now)) {
    return `${hours}:${minutes}`;
  }

  // 判斷是否為昨天
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (isSameDay(date, yesterday)) {
    return `昨天 ${hours}:${minutes}`;
  }

  // 判斷是否為最近7天
  const oneWeekAgo = new Date(now);
  oneWeekAgo.setDate(now.getDate() - 7);
  if (date >= oneWeekAgo) {
    const weekdays = ["日", "一", "二", "三", "四", "五", "六"];
    const weekday = weekdays[date.getDay()];
    return `週${weekday} ${hours}:${minutes}`;
  }

  // 顯示月日
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${month}/${day}`;
};

const showDateDivider = (message, index) => {
  if (index === 0) return true;

  const currentDate = new Date(message.timestamp);
  const prevDate = new Date(messages.value[index - 1].timestamp);

  return !isSameDay(currentDate, prevDate);
};

// 自定義判斷是否為同一天的方法
const isSameDay = (date1, date2) => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

const getUserName = (userId) => {
  // 如果用戶資料存在於快取中，直接返回
  if (userCache.value[userId]) {
    return userCache.value[userId].nickname || `用戶 ${userId.slice(-4)}`;
  }

  // 從API獲取用戶資訊
  fetchUserInfo(userId);

  // 在資料加載前顯示臨時名稱
  return `用戶 ${userId.slice(-4)}`;
};

const getUserAvatar = (userId) => {
  // 如果用戶資料存在於快取中，直接返回
  if (userCache.value[userId] && userCache.value[userId].avatar_url) {
    return formatImageUrl(userCache.value[userId].avatar_url);
  }

  // 從API獲取用戶資訊
  fetchUserInfo(userId);

  // 在資料加載前使用預設頭像
  return `/placeholder.svg?height=150&width=150`;
};

const isUserOnline = (userId) => {
  // 這個函數可以根據實際情況實現
  // 簡單實現，隨機返回
  return Math.random() > 0.5;
};

// 格式化圖片URL
const formatImageUrl = (url) => {
  if (!url) return `/placeholder.svg?height=50&width=50`;
  if (url.startsWith("http")) return url;
  return `${config.public.BACKEND_BASE_URL}${url}`;
};

// 從API獲取用戶資訊
const fetchUserInfo = async (userId) => {
  // 防止重複請求
  if (userCache.value[userId] && userCache.value[userId].isLoading) return;

  // 設置一個臨時值以標記正在加載  userCache.value[userId] = { ...userCache.value[userId], isLoading: true };

  try {
    const response = await fetch(
      `${config.public.BACKEND_BASE_URL}/user/info/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${authCookie.value}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("獲取用戶資訊失敗");
    }

    const result = await response.json();

    if (result.success) {
      // 更新快取
      userCache.value[userId] = {
        ...result.data,
        isLoading: false,
      };
    }
  } catch (error) {
    console.error(`獲取用戶 ${userId} 資訊失敗:`, error);
    // 設置標記表示加載失敗，但保留可能已有的其他資訊
    userCache.value[userId] = {
      ...userCache.value[userId],
      isLoading: false,
      loadError: true,
    };
  }
};

// 生命週期鉤子
onMounted(async () => {
  // 確保用戶已登錄
  if (!authStore.isAuthenticated) {
    router.push("/login");
    return;
  }

  currentUser.value = authStore.user;

  // 初始化 socket.io 連接
  initializeSocket();

  // 獲取最近聊天列表
  await fetchRecentChats();

  // 檢查URL參數，如果有指定聊天ID，則打開該聊天
  const route = useRoute();
  if (route.query.id) {
    // 處理從食物/物品頁面跳轉過來的聊天室ID
    // 先檢查是否已經在最近聊天列表中
    const chatToOpen = recentChats.value.find(
      (chat) => chat.userId === route.query.id
    );
    if (chatToOpen) {
      // 如果找到匹配的聊天，直接打開
      selectChat(chatToOpen.userId);
    } else {
      // 如果在最近聊天中找不到，嘗試通過API獲取聊天信息
      try {
        const response = await fetch(
          `${config.public.BACKEND_BASE_URL}/chatrooms/${route.query.id}`,
          {
            headers: {
              Authorization: `Bearer ${authCookie.value}`,
            },
          }
        );

        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data) {
            // 找到聊天室中的對方用戶ID
            const otherParticipants = result.data.participants.filter(
              (p) => p.user_id !== currentUser.value.user_id
            );

            if (otherParticipants.length > 0) {
              // 選擇第一個其他參與者開始聊天
              selectChat(otherParticipants[0].user_id);
            }
          }
        }
      } catch (error) {
        console.error("獲取聊天室信息失敗:", error);
      }
    }
  }
});

onUnmounted(() => {
  // 斷開 socket 連接
  if (socket.value) {
    socket.value.disconnect();
  }
});
</script>

<style scoped>
/* 根據需要添加樣式 */
</style>
