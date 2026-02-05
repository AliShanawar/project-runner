import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { Socket } from "socket.io-client";
import { closeSocket, initSocket } from "@/lib/socket";
import type { ChatMessage, ChatSummary } from "@/types";

type RawMessage = {
  _id: string;
  chat: string | { _id: string };
  sender: ChatMessage["sender"];
  content: string;
  type?: ChatMessage["type"];
  status?: ChatMessage["status"];
  createdAt: string;
  updatedAt?: string;
};

type ChatHistoryPayload = {
  chat: ChatSummary;
  messages: RawMessage[];
};

type ChatErrorPayload = { message?: string };

type TypingPayload = { senderId: string };

type TypingMap = Record<string, boolean>;
type MessageMap = Record<string, ChatMessage[]>;

interface ChatState {
  socket: Socket | null;
  isConnected: boolean;
  currentUserId: string | null;
  chats: ChatSummary[];
  messages: MessageMap;
  activeChatId: string | null;
  typingUsers: TypingMap;
  loadingChats: boolean;
  loadingMessages: boolean;
  loadingMoreMessages: boolean;
  error: string | null;
  chatPages: Record<string, number>;
  hasMoreMessages: Record<string, boolean>;

  connect: (userId: string) => void;
  disconnect: () => void;
  fetchChats: () => void;
  setActiveChatId: (chatId: string | null) => void;
  fetchChatHistory: (params: {
    receiverId: string;
    page?: number;
    limit?: number;
  }) => void;
  loadMoreMessages: (receiverId: string) => void;
  sendMessage: (params: {
    receiverId: string;
    content: string;
    type?: ChatMessage["type"];
  }) => void;
  startTyping: (receiverId: string) => void;
  stopTyping: (receiverId: string) => void;
  markSeen: (messageId: string) => void;
  deleteMessage: (messageId: string) => void;
}

const getChatIdFromMessage = (message: RawMessage) =>
  typeof message?.chat === "string" ? message.chat : message?.chat?._id || "";

const normalizeMessage = (message: RawMessage): ChatMessage => {
  const chatId = getChatIdFromMessage(message);
  return {
    _id: message._id,
    chat: chatId,
    sender: message.sender,
    content: message.content,
    type: message.type || "text",
    status: message.status,
    createdAt: message.createdAt,
    updatedAt: message.updatedAt,
  };
};

export const useChatStore = create<ChatState>()(
  devtools((set, get) => ({
    socket: null,
    isConnected: false,
    currentUserId: null,
    chats: [],
    messages: {},
    activeChatId: null,
    typingUsers: {},
    loadingChats: false,
    loadingMessages: false,
    loadingMoreMessages: false,
    error: null,
    chatPages: {},
    hasMoreMessages: {},

    connect: (userId) => {
      const existing = get().socket;
      if (existing && get().currentUserId === userId) return;

      const socket = initSocket(userId);
      set({ socket, currentUserId: userId });

      socket.on("connect", () => set({ isConnected: true }));
      socket.on("disconnect", () => set({ isConnected: false }));

      socket.on("all_chats", (chats: ChatSummary[]) => {
        set({ chats, loadingChats: false });
      });

      socket.on("chat_history", ({ chat, messages }: ChatHistoryPayload) => {
        const fallbackMessage = messages[0];
        const chatId =
          chat?._id ||
          (fallbackMessage ? getChatIdFromMessage(fallbackMessage) : "");
        if (!chatId) return;

        const normalizedMessages = messages.map(normalizeMessage);
        const isLoadingMore = get().loadingMoreMessages;

        set((state) => {
          const existingMessages = state.messages[chatId] || [];

          // If loading more (page > 1), prepend older messages
          // Otherwise, replace with initial messages
          const updatedMessages = isLoadingMore
            ? [...normalizedMessages, ...existingMessages]
            : normalizedMessages;

          // If we received fewer messages than the limit (20), no more to load
          const hasMore = normalizedMessages.length >= 20;

          return {
            activeChatId: chatId,
            messages: {
              ...state.messages,
              [chatId]: updatedMessages,
            },
            hasMoreMessages: {
              ...state.hasMoreMessages,
              [chatId]: hasMore,
            },
            loadingMessages: false,
            loadingMoreMessages: false,
            error: null,
          };
        });
      });

      const handleIncoming = (incoming: RawMessage) => {
        const message = normalizeMessage(incoming);
        const chatId = message.chat;

        set((state) => {
          const chatMessages = state.messages[chatId] || [];
          const exists = chatMessages.some((m) => m._id === message._id);
          const updatedMessages = exists
            ? chatMessages.map((m) => (m._id === message._id ? message : m))
            : [...chatMessages, message];

          const updatedChats = state.chats.map((chat) =>
            chat._id === chatId
              ? { ...chat, lastMessage: message, updatedAt: message.createdAt }
              : chat,
          );

          return {
            messages: { ...state.messages, [chatId]: updatedMessages },
            chats: updatedChats,
          };
        });
      };

      socket.on("receive_message", handleIncoming);
      socket.on("message_sent", handleIncoming);

      socket.on("message_seen", (payload: RawMessage) => {
        const message = normalizeMessage(payload);
        const chatId = message.chat;
        set((state) => ({
          messages: {
            ...state.messages,
            [chatId]: (state.messages[chatId] || []).map((m) =>
              m._id === message._id ? { ...m, status: message.status } : m,
            ),
          },
        }));
      });

      socket.on("message_deleted", (payload: RawMessage) => {
        const message = normalizeMessage(payload);
        const chatId = message.chat;
        set((state) => ({
          messages: {
            ...state.messages,
            [chatId]: (state.messages[chatId] || []).map((m) =>
              m._id === message._id ? message : m,
            ),
          },
        }));
      });

      socket.on("user_typing", ({ senderId }: TypingPayload) => {
        set((state) => ({
          typingUsers: { ...state.typingUsers, [senderId]: true },
        }));
      });

      socket.on("user_stop_typing", ({ senderId }: TypingPayload) => {
        set((state) => {
          const updated = { ...state.typingUsers };
          delete updated[senderId];
          return { typingUsers: updated };
        });
      });

      socket.on("chat_found_or_created", (chat: ChatSummary) => {
        set((state) => {
          const exists = state.chats.some((c) => c._id === chat._id);
          return exists
            ? state
            : { chats: [chat, ...state.chats], activeChatId: chat._id };
        });
      });

      socket.on("chat_error", (payload: ChatErrorPayload) => {
        set({
          error: payload?.message || "Chat error",
          loadingMessages: false,
        });
      });
    },

    disconnect: () => {
      closeSocket();
      set({
        socket: null,
        isConnected: false,
        currentUserId: null,
        activeChatId: null,
        typingUsers: {},
      });
    },

    fetchChats: () => {
      console.log("Fetched chats", get().chats);
      const socket = get().socket;
      const userId = get().currentUserId;
      if (!socket || !userId) return;
      set({ loadingChats: true });
      socket.emit("fetch_all_chats", { userId });
    },

    setActiveChatId: (chatId) => {
      set((state) => ({
        activeChatId: chatId,
        chatPages: {
          ...state.chatPages,
          [chatId || ""]: 1,
        },
      }));
    },

    fetchChatHistory: ({ receiverId, page = 1, limit = 20 }) => {
      const socket = get().socket;
      const senderId = get().currentUserId;
      if (!socket || !senderId) return;

      set((state) => ({
        loadingMessages: true,
        chatPages: {
          ...state.chatPages,
          [state.activeChatId || ""]: page,
        },
      }));

      socket.emit("fetch_chat", { senderId, receiverId, page, limit });
    },

    loadMoreMessages: (receiverId) => {
      const socket = get().socket;
      const senderId = get().currentUserId;
      const activeChatId = get().activeChatId;

      if (!socket || !senderId || !activeChatId) return;

      const currentPage = get().chatPages[activeChatId] || 1;
      const hasMore = get().hasMoreMessages[activeChatId] !== false;
      const isLoading = get().loadingMoreMessages;

      // Don't load if already loading or no more messages
      if (isLoading || !hasMore) return;

      const nextPage = currentPage + 1;

      set((state) => ({
        loadingMoreMessages: true,
        chatPages: {
          ...state.chatPages,
          [activeChatId]: nextPage,
        },
      }));

      socket.emit("fetch_chat", { senderId, receiverId, page: nextPage, limit: 20 });
    },

    sendMessage: ({ receiverId, content, type = "text" }) => {
      const socket = get().socket;
      const senderId = get().currentUserId;
      if (!socket || !senderId || !content.trim()) return;

      socket.emit("send_message", {
        senderId,
        receiverId,
        content,
        type,
      });
    },

    startTyping: (receiverId) => {
      const socket = get().socket;
      const senderId = get().currentUserId;
      if (!socket || !senderId) return;
      socket.emit("typing", { senderId, receiverId });
    },

    stopTyping: (receiverId) => {
      const socket = get().socket;
      const senderId = get().currentUserId;
      if (!socket || !senderId) return;
      socket.emit("stop_typing", { senderId, receiverId });
    },

    markSeen: (messageId) => {
      const socket = get().socket;
      if (!socket) return;
      socket.emit("mark_seen", { messageId });
    },

    deleteMessage: (messageId) => {
      const socket = get().socket;
      const senderId = get().currentUserId;
      if (!socket || !senderId) return;
      socket.emit("delete_message", { messageId, senderId });
    },
  })),
);
