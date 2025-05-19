<template>
  <div class="h-screen flex flex-col bg-gray-50">
    <!-- 聊天室主界面 -->
    <div class="flex-1 flex overflow-hidden">
      <!-- 左側聊天室列表 (在移動端可隱藏) -->
      <div
        v-show="showMobileList"
        class="w-full md:w-1/3 lg:w-1/4 border-r border-gray-200 flex flex-col bg-white md:block"
      >
        <!-- 搜索框 -->
        <div class="p-4 border-b">
          <div class="relative">
            <input
              v-model="searchInput"
              type="text"
              placeholder="搜尋聊天..."
              class="w-full border border-gray-300 rounded-full px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
            <span class="absolute left-3 top-2.5 text-gray-400">
              <Search class="w-5 h-5 text-gray-400" />
            </span>
          </div>
        </div>

        <!-- 聊天室列表 -->
        <div class="flex-1 overflow-y-auto">
          <div
            v-for="room in filteredChatRooms"
            :key="room.id"
            @click="selectChat(room)"
            :class="[
              'p-4 border-b hover:bg-gray-50 cursor-pointer transition-colors flex items-center',
              selectedChat && selectedChat.id === room.id
                ? 'bg-emerald-50'
                : '',
            ]"
          >
            <!-- 頭像 -->
            <div class="relative">
              <img
                :src="
                  room.contact.avatar || '/placeholder.svg?height=40&width=40'
                "
                alt="Avatar"
                class="w-12 h-12 rounded-full object-cover"
              />
              <span
                v-if="room.status === 'active'"
                class="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white"
              ></span>
            </div>

            <!-- 聊天室資訊 -->
            <div class="ml-3 flex-1">
              <div class="flex justify-between items-start">
                <h3 class="font-medium text-gray-800 truncate max-w-[120px]">
                  {{ room.contact.name }}
                </h3>
                <span class="text-xs text-gray-500">{{ room.time }}</span>
              </div>
              <div class="flex justify-between items-start mt-1">
                <p class="text-sm text-gray-600 truncate max-w-[150px]">
                  {{ room.lastMessage }}
                </p>
                <span
                  v-if="room.unread > 0"
                  class="bg-emerald-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                >
                  {{ room.unread }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 右側聊天區域 -->
      <div
        v-show="!showMobileList || !isMobile"
        class="w-full md:w-2/3 lg:w-3/4 flex flex-col bg-gray-100"
      >
        <div
          v-if="!selectedChat"
          class="flex-1 flex flex-col items-center justify-center p-4"
        >
          <div class="text-6xl text-gray-300 mb-4">
            <MessageCircle />
          </div>
          <p class="text-gray-500 text-xl mb-2">選擇一個聊天來開始對話</p>
          <p class="text-gray-400 text-center max-w-md">
            點擊左側的聊天室開始對話，或者透過物品和食物頁面與用戶聯繫。
          </p>
        </div>

        <div v-else class="flex-1 flex flex-col">
          <!-- 聊天室標題欄 -->
          <div
            class="bg-white border-b border-gray-200 p-4 flex items-center justify-between"
          >
            <div class="flex items-center">
              <!-- 返回按鈕（僅在移動端顯示） -->
              <button
                class="md:hidden mr-2 p-1 rounded-full hover:bg-gray-100"
                @click="showMobileList = true"
              >
                <i class="material-icons">arrow_back</i>
              </button>

              <!-- 聯絡人資訊 -->
              <div class="flex items-center">
                <img
                  :src="
                    selectedChat.contact.avatar ||
                    '/placeholder.svg?height=40&width=40'
                  "
                  alt="Contact Avatar"
                  class="w-10 h-10 rounded-full object-cover mr-3"
                />
                <div>
                  <h2 class="font-medium text-gray-800">
                    {{ selectedChat.contact.name }}
                  </h2>
                  <p class="text-xs text-gray-500 flex items-center">
                    <span
                      :class="[
                        'w-2 h-2 rounded-full mr-1',
                        selectedChat.status === 'active'
                          ? 'bg-emerald-500'
                          : 'bg-gray-400',
                      ]"
                    ></span>
                    {{ getStatusText(selectedChat.status) }}
                  </p>
                </div>
              </div>
            </div>

            <!-- 右側操作按鈕 -->
            <div class="flex items-center space-x-2">
              <!-- 資訊按鈕 -->
              <button
                class="p-2 rounded-full hover:bg-gray-100 relative"
                @click.stop="showInfo = !showInfo"
              >
                <i class="material-icons">info</i>
              </button>
            </div>
          </div>

          <!-- 信息面板（點擊資訊按鈕顯示） -->
          <div
            v-if="showInfo"
            class="absolute right-4 top-20 bg-white rounded-lg shadow-lg border border-gray-200 z-10 w-64"
            @click.stop
          >
            <div class="p-4 border-b border-gray-200">
              <h3 class="font-medium text-gray-800 mb-1">
                {{ selectedChat.title }}
              </h3>
              <p class="text-xs text-gray-500">
                {{ selectedChat.type === "item" ? "遺失物品" : "食物分享" }}
              </p>
            </div>

            <div v-if="selectedChat.type === 'item'" class="p-4">
              <div class="mb-3">
                <img
                  :src="
                    selectedChat.itemInfo.image ||
                    '/placeholder.svg?height=200&width=300'
                  "
                  alt="Item"
                  class="w-full h-32 object-cover rounded-lg mb-2"
                />
                <p class="text-sm font-medium text-gray-700 mb-1">
                  {{ selectedChat.itemInfo.title }}
                </p>
              </div>

              <div
                v-if="
                  selectedChat.status === 'active' &&
                  selectedChat.isOwner &&
                  selectedChat.itemInfo.is_with_owner
                "
                class="mt-4"
              >
                <button
                  @click="handleCompleteItemHandover"
                  class="w-full py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  已與對方完成物品交付
                </button>
              </div>
            </div>

            <div v-else-if="selectedChat.type === 'food'" class="p-4">
              <div class="mb-3">
                <img
                  :src="
                    selectedChat.foodInfo.image ||
                    '/placeholder.svg?height=200&width=300'
                  "
                  alt="Food"
                  class="w-full h-32 object-cover rounded-lg mb-2"
                />
                <p class="text-sm font-medium text-gray-700 mb-1">
                  {{ selectedChat.foodInfo.title }}
                </p>
                <p class="text-xs text-gray-500">
                  份數:
                  {{
                    selectedChat.foodInfo.reservedPortions +
                    "/" +
                    selectedChat.foodInfo.portions
                  }}
                </p>
              </div>

              <div
                v-if="
                  selectedChat.status === 'active' &&
                  selectedChat.isOwner &&
                  selectedChat.foodInfo.isReservationRequired
                "
                class="mt-4 space-y-2"
              >
                <button
                  @click="handleCompleteFoodHandover"
                  class="w-full py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  已交付食物
                </button>
                <button
                  @click="handleRejectFoodReservation"
                  class="w-full py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  拒絕預約
                </button>
              </div>
            </div>
          </div>

          <!-- 聊天消息區域 -->
          <div
            ref="messagesContainer"
            class="flex-1 overflow-y-auto p-4 space-y-4"
          >
            <div
              v-for="message in messages"
              :key="message.id"
              :class="[
                'flex',
                message.senderId === 'me'
                  ? 'justify-end'
                  : message.senderId === 'system'
                    ? 'justify-center'
                    : 'justify-start',
              ]"
            >
              <!-- 系統消息 -->
              <div
                v-if="message.senderId === 'system'"
                class="bg-gray-200 text-gray-700 px-4 py-2 rounded-full text-sm max-w-xs md:max-w-md inline-block"
              >
                {{ message.text }}
              </div>

              <!-- 用戶消息 -->
              <div v-else class="max-w-xs md:max-w-md">
                <div
                  :class="[
                    'px-4 py-2 rounded-lg inline-block',
                    message.senderId === 'me'
                      ? 'bg-emerald-600 text-white rounded-br-none'
                      : 'bg-white text-gray-800 rounded-bl-none',
                  ]"
                >
                  {{ message.text }}
                </div>
                <div
                  :class="[
                    'flex text-xs mt-1',
                    message.senderId === 'me' ? 'justify-end' : '',
                  ]"
                >
                  <span class="text-gray-500">
                    {{ formatMessageTime(message.time) }}
                  </span>
                </div>
              </div>
            </div>

            <!-- 滾動到底部的參考點 -->
            <div ref="messagesEnd"></div>
          </div>

          <!-- 輸入區域 -->
          <div class="bg-white border-t border-gray-200 p-3">
            <div
              v-if="selectedChat.status !== 'active'"
              class="text-center py-2 text-gray-500 bg-gray-100 rounded-lg mb-2"
            >
              {{ getDisabledMessageText(selectedChat.status) }}
            </div>
            <div v-else class="flex items-end">
              <div class="flex-1 bg-gray-100 rounded-lg px-4 py-2">
                <textarea
                  v-model="messageInput"
                  placeholder="輸入訊息..."
                  class="w-full bg-transparent outline-none resize-none max-h-28"
                  rows="1"
                  @keydown.enter.prevent="handleSendMessage"
                ></textarea>
              </div>
              <button
                @click="handleSendMessage"
                :disabled="isSending || !messageInput.trim()"
                class="ml-2 p-2 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <i class="material-icons">send</i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 確認對話框 -->
    <div
      v-if="confirmDialog.open"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
    >
      <div class="bg-white rounded-lg shadow-xl p-6 m-4 max-w-sm w-full">
        <h3 class="text-lg font-medium text-gray-900 mb-2">
          {{ confirmDialog.title }}
        </h3>
        <p class="text-sm text-gray-600 mb-4">
          {{ confirmDialog.description }}
        </p>
        <div v-if="isProcessing" class="flex justify-center mb-4">
          <div
            class="animate-spin rounded-full h-6 w-6 border-2 border-emerald-500 border-t-transparent"
          ></div>
        </div>
        <div class="flex justify-end space-x-3">
          <button
            @click="confirmDialog.open = false"
            class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
          >
            取消
          </button>
          <button
            @click="confirmDialog.action"
            :disabled="isProcessing"
            class="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
          >
            確認
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useRuntimeConfig, useCookie } from "#app";
import { useAuthStore } from "~/stores/auth";
import { io } from "socket.io-client";
import { MessageCircle, Search } from "lucide-vue-next";

const config = useRuntimeConfig();
const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const initialChatId = route.query.id ? route.query.id : null;

// 狀態變數
const chatRooms = ref([]);
const selectedChat = ref(null);
const messages = ref([]);
const messageInput = ref("");
const searchInput = ref("");
const isSending = ref(false);
const isProcessing = ref(false);
const showMobileList = ref(!initialChatId);
const showInfo = ref(false);
const messagesEnd = ref(null);
const messagesContainer = ref(null);
const confirmDialog = ref({
  open: false,
  title: "",
  description: "",
  action: () => {},
});
const socket = ref(null);
const isMobile = ref(window.innerWidth < 768);

// 監聽窗口尺寸變化
onMounted(() => {
  if (process.client) {
    // 初始化 Socket.IO 連線
    initSocket();

    // 獲取聊天室列表
    fetchChatRooms();

    // 設置窗口尺寸監聽
    window.addEventListener("resize", () => {
      isMobile.value = window.innerWidth < 768;
    });
  }
});

onUnmounted(() => {
  window.removeEventListener("resize", () => {
    isMobile.value = window.innerWidth < 768;
  });
});

// 過濾聊天室
const filteredChatRooms = computed(() => {
  if (!searchInput.value) return chatRooms.value;

  const query = searchInput.value.toLowerCase();
  return chatRooms.value.filter(
    (room) =>
      room.title.toLowerCase().includes(query) ||
      room.contact.name.toLowerCase().includes(query) ||
      room.lastMessage.toLowerCase().includes(query)
  );
});

// 獲取狀態顯示文字
const getStatusText = (status) => {
  switch (status) {
    case "active":
      return "在線";
    case "completed":
      return "已完成";
    case "cancelled":
      return "已取消";
    case "expired":
      return "已過期";
    default:
      return "未知狀態";
  }
};

// 獲取禁用訊息的顯示文字
const getDisabledMessageText = (status) => {
  switch (status) {
    case "completed":
      return "此對話已完成，無法發送新訊息";
    case "cancelled":
      return "此對話已取消，無法發送新訊息";
    case "expired":
      return "此對話已過期，無法發送新訊息";
    default:
      return "無法發送訊息";
  }
};

// 格式化消息時間
const formatMessageTime = (time) => {
  if (!time) return "";
  return formatDate(time);
};

// 初始化 Socket.IO
const initSocket = () => {
  if (!authStore.isLoggedIn) return;

  const token = useCookie("auth_token").value;

  if (!token) return;

  // 建立 Socket.IO 連接
  socket.value = io(config.public.BACKEND_BASE_URL, {
    auth: { token },
  });

  // 監聽連接事件
  socket.value.on("connect", () => {
    console.log("Socket.IO 連接成功");
  });

  // 監聽錯誤
  socket.value.on("error", (error) => {
    console.error("Socket.IO 錯誤:", error);
  });

  // 監聽新訊息
  socket.value.on("new-message", (message) => {
    if (
      selectedChat.value &&
      message.chatroom_id === selectedChat.value.chatroom_id
    ) {
      // 添加到當前聊天消息列表
      messages.value.push({
        id: message.message_id,
        senderId:
          message.sender_id === authStore.user.user_id
            ? "me"
            : message.sender_id,
        text: message.content,
        time: formatDate(message.createdAt),
        isRead: true,
      });
    }

    // 更新聊天室列表
    updateChatRoomWithMessage(message);
  });

  // 監聽聊天室更新
  socket.value.on("chatroom-update", (chatroomInfo) => {
    fetchChatRooms();
  });

  // 斷開連接
  socket.value.on("disconnect", () => {
    console.log("Socket.IO 連接已斷開");
  });
};

// 更新聊天室列表中的最後一條消息
const updateChatRoomWithMessage = (message) => {
  const roomIndex = chatRooms.value.findIndex(
    (room) => room.chatroom_id === message.chatroom_id
  );

  if (roomIndex !== -1) {
    const room = chatRooms.value[roomIndex];

    // 更新最後一條消息
    room.lastMessage = message.content;
    room.time = formatDate(message.createdAt);

    // 如果不是當前選中的聊天室，增加未讀消息數
    if (
      !selectedChat.value ||
      selectedChat.value.chatroom_id !== message.chatroom_id
    ) {
      room.unread = (room.unread || 0) + 1;
    }

    // 將此聊天室移到列表頂部
    chatRooms.value.splice(roomIndex, 1);
    chatRooms.value.unshift(room);
  }
};

// 格式化日期
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now - date;

  // 今天的消息只顯示時間
  if (diff < 24 * 60 * 60 * 1000 && date.getDate() === now.getDate()) {
    return date.toLocaleTimeString("zh-TW", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  // 昨天的消息顯示"昨天"
  if (diff < 48 * 60 * 60 * 1000 && date.getDate() === now.getDate() - 1) {
    return `昨天 ${date.toLocaleTimeString("zh-TW", { hour: "2-digit", minute: "2-digit" })}`;
  }

  // 過去一周的消息顯示星期幾
  if (diff < 7 * 24 * 60 * 60 * 1000) {
    const weekdays = ["日", "一", "二", "三", "四", "五", "六"];
    return `星期${weekdays[date.getDay()]} ${date.toLocaleTimeString("zh-TW", { hour: "2-digit", minute: "2-digit" })}`;
  }

  // 更早的消息顯示完整日期
  return `${date.toLocaleDateString("zh-TW")} ${date.toLocaleTimeString("zh-TW", { hour: "2-digit", minute: "2-digit" })}`;
};

// 從 API 獲取聊天室列表
const fetchChatRooms = async () => {
  if (!authStore.isLoggedIn) return;

  try {
    const response = await fetch(
      `${config.public.BACKEND_BASE_URL}/chatrooms`,
      {
        headers: {
          Authorization: `Bearer ${useCookie("auth_token").value}`,
        },
      }
    );

    const data = await response.json();

    if (data.success) {
      // 轉換為前端所需格式
      chatRooms.value = data.data.map((room) => {
        // 找到對話的另一方（非當前用戶）
        const otherParticipant = room.participants.find(
          (p) => p.user_id !== authStore.user.user_id
        );

        return {
          id: room.chatroom_id,
          chatroom_id: room.chatroom_id,
          type: room.event_type === "lost" ? "item" : "food",
          relatedId: room.event_id,
          title: "", // 將在下一步獲取
          lastMessage: room.last_message
            ? room.last_message.content
            : "沒有消息",
          time: room.last_message
            ? formatDate(room.last_message.created_at)
            : formatDate(room.created_at),
          unread: 0, // TODO: 實現未讀消息計數
          status: room.status === "open" ? "active" : "completed",
          contact: {
            id: otherParticipant ? otherParticipant.user_id : "",
            name: otherParticipant ? otherParticipant.username : "未知用戶",
            avatar: otherParticipant ? otherParticipant.avatar : "",
          },
          isOwner: false, // 將在獲取事件詳情時更新
        };
      });

      // 獲取每個聊天室關聯的事件詳情
      await Promise.all(
        chatRooms.value.map(async (room) => {
          if (room.type === "item") {
            await fetchItemDetails(room);
          } else if (room.type === "food") {
            await fetchFoodDetails(room);
          }
        })
      );

      // 如果有指定的初始聊天室ID，選擇它
      if (initialChatId) {
        const initialRoom = chatRooms.value.find(
          (room) => room.id === initialChatId
        );
        if (initialRoom) {
          selectChat(initialRoom);
        }
      }
    } else {
      console.error("獲取聊天室失敗:", data.message);
    }
  } catch (error) {
    console.error("API請求失敗:", error);
  }
};

// 獲取物品詳情
const fetchItemDetails = async (room) => {
  try {
    const response = await fetch(
      `${config.public.BACKEND_BASE_URL}/items/${room.relatedId}`,
      {
        headers: {
          Authorization: `Bearer ${useCookie("auth_token").value}`,
        },
      }
    );

    const data = await response.json();

    if (data.success) {
      const item = data.data;
      room.title = item.title;
      room.isOwner = item.created_by === authStore.user.user_id;
      room.itemInfo = {
        title: item.title,
        image: item.image_url,
        is_with_owner: item.is_with_owner,
        allow_message: item.allow_message,
      };
    }
  } catch (error) {
    console.error("獲取物品詳情失敗:", error);
  }
};

// 獲取食物詳情
const fetchFoodDetails = async (room) => {
  try {
    const response = await fetch(
      `${config.public.BACKEND_BASE_URL}/foods/${room.relatedId}`,
      {
        headers: {
          Authorization: `Bearer ${useCookie("auth_token").value}`,
        },
      }
    );

    const data = await response.json();

    if (data.success) {
      const food = data.data;
      room.title = food.title;
      room.isOwner = food.created_by === authStore.user.user_id;
      room.foodInfo = {
        title: food.title,
        image: food.image_url,
        portions: food.quantity,
        reservedPortions: food.reserved_quantity || 0,
        isReservationRequired: food.require_reservation,
      };
    }
  } catch (error) {
    console.error("獲取食物詳情失敗:", error);
  }
};

// 獲取聊天室訊息
const fetchChatroomMessages = async (chatroomId) => {
  try {
    const response = await fetch(
      `${config.public.BACKEND_BASE_URL}/messages/chatroom/${chatroomId}`,
      {
        headers: {
          Authorization: `Bearer ${useCookie("auth_token").value}`,
        },
      }
    );

    const data = await response.json();

    if (data.success) {
      // 格式化消息
      messages.value = data.data.messages
        .map((msg) => ({
          id: msg.message_id,
          senderId:
            msg.sender_id === authStore.user.user_id ? "me" : msg.sender_id,
          text: msg.content,
          time: formatDate(msg.createdAt),
          isRead: true,
        }))
        .reverse(); // 反轉順序使最新的消息在底部

      // 清除未讀標記
      const roomIndex = chatRooms.value.findIndex(
        (room) => room.chatroom_id === chatroomId
      );
      if (roomIndex !== -1) {
        chatRooms.value[roomIndex].unread = 0;
      }
    } else {
      console.error("獲取聊天消息失敗:", data.message);
    }
  } catch (error) {
    console.error("API請求失敗:", error);
  }
};

// 選擇聊天室
const selectChat = (room) => {
  selectedChat.value = room;
  fetchChatroomMessages(room.chatroom_id);

  // 如果是手機視圖，隱藏列表顯示聊天內容
  if (isMobile.value) {
    showMobileList.value = false;
  }

  // 加入聊天室的 Socket.IO 房間
  if (socket.value) {
    socket.value.emit("join-chatroom", room.chatroom_id);
  }

  // 更新URL，但不刷新頁面
  router.push({
    path: "/message",
    query: { id: room.id },
  });
};

// 當選擇聊天室時載入消息並滾動到底部
watch(
  () => selectedChat.value,
  (newChat) => {
    if (newChat) {
      // 滾動到最新消息
      nextTick(() => {
        if (messagesEnd.value) {
          messagesEnd.value.scrollIntoView({ behavior: "smooth" });
        }
      });
    }
  },
  { immediate: true }
);

// 滾動到最新消息 - 只在發送新消息時
watch(
  () => messages.value,
  async (newMessages, oldMessages) => {
    if (newMessages.length > oldMessages.length) {
      await nextTick();
      if (messagesEnd.value) {
        messagesEnd.value.scrollIntoView({ behavior: "smooth" });
      }
    }
  },
  { deep: true }
);

// 發送訊息
const handleSendMessage = async () => {
  if (
    !messageInput.value.trim() ||
    !selectedChat.value ||
    selectedChat.value.status !== "active"
  )
    return;

  isSending.value = true;
  const messageContent = messageInput.value.trim();
  messageInput.value = "";

  try {
    // 通過 Socket.IO 發送訊息
    if (socket.value) {
      socket.value.emit("send-message", {
        chatroom_id: selectedChat.value.chatroom_id,
        content: messageContent,
      });
    } else {
      // 備用：使用 REST API 發送
      const response = await fetch(
        `${config.public.BACKEND_BASE_URL}/messages/chatroom/${selectedChat.value.chatroom_id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${useCookie("auth_token").value}`,
          },
          body: JSON.stringify({ content: messageContent }),
        }
      );

      const data = await response.json();

      if (data.success) {
        // 添加消息到聊天記錄
        messages.value.push({
          id: data.data.message_id,
          senderId: "me",
          text: messageContent,
          time: formatDate(new Date()),
          isRead: true,
        });

        // 更新聊天室列表中的最後一條消息
        const roomIndex = chatRooms.value.findIndex(
          (room) => room.id === selectedChat.value.id
        );
        if (roomIndex !== -1) {
          chatRooms.value[roomIndex].lastMessage = messageContent;
          chatRooms.value[roomIndex].time = formatDate(new Date());
        }
      } else {
        console.error("發送訊息失敗:", data.message);
      }
    }
  } catch (error) {
    console.error("發送訊息失敗:", error);
  } finally {
    isSending.value = false;
  }
};

// 完成物品交付
const handleCompleteItemHandover = () => {
  if (!selectedChat.value || selectedChat.value.type !== "item") return;

  confirmDialog.value = {
    open: true,
    title: "確認完成物品交付",
    description: `確認您已將物品交付給 ${selectedChat.value.contact.name}？此操作將結束此事件及相關聊天室。`,
    action: async () => {
      isProcessing.value = true;

      try {
        // 1. 更新物品狀態為已交付
        const itemResponse = await fetch(
          `${config.public.BACKEND_BASE_URL}/items/${selectedChat.value.relatedId}/status`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${useCookie("auth_token").value}`,
            },
            body: JSON.stringify({ status: "claimed" }),
          }
        );

        const itemData = await itemResponse.json();

        if (itemData.success) {
          // 2. 關閉聊天室
          const chatroomResponse = await fetch(
            `${config.public.BACKEND_BASE_URL}/chatrooms/${selectedChat.value.chatroom_id}/status`,
            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${useCookie("auth_token").value}`,
              },
              body: JSON.stringify({ status: "closed" }),
            }
          );

          const chatroomData = await chatroomResponse.json();

          if (chatroomData.success) {
            // 3. 添加系統消息
            messages.value.push({
              id: Date.now(),
              senderId: "system",
              text: "此聊天已完成，物品已成功歸還給失主",
              time: formatDate(new Date()),
              isRead: true,
            });

            // 4. 更新聊天室狀態
            selectedChat.value.status = "completed";

            // 5. 更新聊天室列表
            const roomIndex = chatRooms.value.findIndex(
              (room) => room.id === selectedChat.value.id
            );
            if (roomIndex !== -1) {
              chatRooms.value[roomIndex].status = "completed";
            }
          }
        }
      } catch (error) {
        console.error("完成物品交付失敗:", error);
      } finally {
        isProcessing.value = false;
        confirmDialog.value.open = false;
      }
    },
  };
};

// 完成食物交付
const handleCompleteFoodHandover = () => {
  if (
    !selectedChat.value ||
    selectedChat.value.type !== "food" ||
    !selectedChat.value.foodInfo
  )
    return;

  confirmDialog.value = {
    open: true,
    title: "確認完成食物交付",
    description: `確認您已將食物交付給 ${selectedChat.value.contact.name}？此操作將減少可用份數。`,
    action: async () => {
      isProcessing.value = true;

      try {
        // 獲取預約信息
        const reservationResponse = await fetch(
          `${config.public.BACKEND_BASE_URL}/foods/${selectedChat.value.relatedId}/reservations`,
          {
            headers: {
              Authorization: `Bearer ${useCookie("auth_token").value}`,
            },
          }
        );

        const reservationData = await reservationResponse.json();

        if (reservationData.success) {
          // 找到此用戶的預約
          const userReservation = reservationData.data.find(
            (res) => res.user_id === selectedChat.value.contact.id
          );

          if (userReservation) {
            // 完成預約
            const completeResponse = await fetch(
              `${config.public.BACKEND_BASE_URL}/foods/${selectedChat.value.relatedId}/reservations/${userReservation.reservation_id}/complete`,
              {
                method: "PATCH",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${useCookie("auth_token").value}`,
                },
              }
            );

            const completeData = await completeResponse.json();

            if (completeData.success) {
              // 添加系統消息
              messages.value.push({
                id: Date.now(),
                senderId: "system",
                text: "食物交付已完成",
                time: formatDate(new Date()),
                isRead: true,
              });

              // 如果所有份數都被預約並完成，關閉聊天室
              if (
                selectedChat.value.foodInfo.portions ===
                selectedChat.value.foodInfo.reservedPortions
              ) {
                // 關閉聊天室
                await fetch(
                  `${config.public.BACKEND_BASE_URL}/chatrooms/${selectedChat.value.chatroom_id}/status`,
                  {
                    method: "PATCH",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${useCookie("auth_token").value}`,
                    },
                    body: JSON.stringify({ status: "closed" }),
                  }
                );

                selectedChat.value.status = "completed";

                // 更新聊天室列表
                const roomIndex = chatRooms.value.findIndex(
                  (room) => room.id === selectedChat.value.id
                );
                if (roomIndex !== -1) {
                  chatRooms.value[roomIndex].status = "completed";
                }
              }

              // 更新食物信息
              fetchFoodDetails(selectedChat.value);
            }
          }
        }
      } catch (error) {
        console.error("完成食物交付失敗:", error);
      } finally {
        isProcessing.value = false;
        confirmDialog.value.open = false;
      }
    },
  };
};

// 拒絕食物預約
const handleRejectFoodReservation = () => {
  if (
    !selectedChat.value ||
    selectedChat.value.type !== "food" ||
    !selectedChat.value.foodInfo
  )
    return;

  confirmDialog.value = {
    open: true,
    title: "確認拒絕預約",
    description: `確認您要拒絕 ${selectedChat.value.contact.name} 的食物預約？`,
    action: async () => {
      isProcessing.value = true;

      try {
        // 獲取預約信息
        const reservationResponse = await fetch(
          `${config.public.BACKEND_BASE_URL}/foods/${selectedChat.value.relatedId}/reservations`,
          {
            headers: {
              Authorization: `Bearer ${useCookie("auth_token").value}`,
            },
          }
        );

        const reservationData = await reservationResponse.json();

        if (reservationData.success) {
          // 找到此用戶的預約
          const userReservation = reservationData.data.find(
            (res) => res.user_id === selectedChat.value.contact.id
          );

          if (userReservation) {
            // 拒絕預約
            const rejectResponse = await fetch(
              `${config.public.BACKEND_BASE_URL}/foods/${selectedChat.value.relatedId}/reservations/${userReservation.reservation_id}/reject`,
              {
                method: "PATCH",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${useCookie("auth_token").value}`,
                },
              }
            );

            const rejectData = await rejectResponse.json();

            if (rejectData.success) {
              // 添加系統消息
              messages.value.push({
                id: Date.now(),
                senderId: "system",
                text: "預約已被拒絕",
                time: formatDate(new Date()),
                isRead: true,
              });

              // 更新聊天室列表
              fetchFoodDetails(selectedChat.value);
            }
          }
        }
      } catch (error) {
        console.error("拒絕預約失敗:", error);
      } finally {
        isProcessing.value = false;
        confirmDialog.value.open = false;
      }
    },
  };
};
</script>
