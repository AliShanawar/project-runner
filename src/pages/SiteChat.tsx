import { useEffect, useMemo, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Send, Loader2, CheckCheck, Check } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useChatStore } from "@/store/chat.store";
import type { ChatMessage, ChatSummary } from "@/types";

const getOtherParticipant = (chat: ChatSummary | undefined, userId?: string) =>
  chat?.participants.find((p) => p._id !== userId);

const getChatDisplayName = (chat: ChatSummary | undefined, userId?: string) => {
  if (!chat) return "Conversation";
  if (chat.isGroupChat) {
    return chat.chatName || "Group chat";
  }
  const other = getOtherParticipant(chat, userId);
  return other?.name || other?.email || chat.chatName || "Conversation";
};

const formatTime = (value?: string) => {
  if (!value) return "";
  const date = new Date(value);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const SiteChat = () => {
  const { user } = useAuthStore();
  const chats = useChatStore((state) => state.chats);
  const messages = useChatStore((state) => state.messages);
  const activeChatId = useChatStore((state) => state.activeChatId);
  const typingUsers = useChatStore((state) => state.typingUsers);
  const loadingChats = useChatStore((state) => state.loadingChats);
  const loadingMessages = useChatStore((state) => state.loadingMessages);
  const connect = useChatStore((state) => state.connect);
  const fetchChats = useChatStore((state) => state.fetchChats);
  const fetchChatHistory = useChatStore((state) => state.fetchChatHistory);
  const setActiveChatId = useChatStore((state) => state.setActiveChatId);
  const sendMessage = useChatStore((state) => state.sendMessage);
  const startTyping = useChatStore((state) => state.startTyping);
  const stopTyping = useChatStore((state) => state.stopTyping);
  const markSeen = useChatStore((state) => state.markSeen);

  const [search, setSearch] = useState("");
  const [messageText, setMessageText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const userId = user?._id;

  useEffect(() => {
    if (userId) {
      connect(userId);
      fetchChats();
    }
  }, [userId, connect, fetchChats]);

  useEffect(() => {
    if (!userId || activeChatId || chats.length === 0) return;
    const firstChat = chats[0];
    setActiveChatId(firstChat._id);
    const other = getOtherParticipant(firstChat, userId);
    if (other?._id) {
      fetchChatHistory({ receiverId: other._id });
    }
  }, [activeChatId, chats, fetchChatHistory, setActiveChatId, userId]);

  const filteredChats = useMemo(() => {
    if (!search.trim()) return chats;
    const query = search.toLowerCase();
    return chats.filter((chat) => {
      const other = getOtherParticipant(chat, userId);
      return (
        chat.chatName?.toLowerCase().includes(query) ||
        other?.name?.toLowerCase().includes(query) ||
        other?.email?.toLowerCase().includes(query)
      );
    });
  }, [chats, search, userId]);

  const activeChat = chats.find((chat) => chat._id === activeChatId);
  const receiver = getOtherParticipant(activeChat, userId);
  const activeMessages: ChatMessage[] = useMemo(() => {
    if (!activeChatId) return [];
    return messages[activeChatId] || [];
  }, [activeChatId, messages]);
  const lastSeenMessageIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [activeMessages, loadingMessages]);

  useEffect(() => {
    lastSeenMessageIdRef.current = null;
  }, [activeChatId]);

  useEffect(() => {
    if (!userId || !receiver?._id || activeMessages.length === 0) return;
    const lastMessage = activeMessages[activeMessages.length - 1];
    if (
      !lastMessage ||
      lastMessage.sender._id === userId ||
      lastMessage.status === "seen" ||
      lastSeenMessageIdRef.current === lastMessage._id
    ) {
      return;
    }

    markSeen(lastMessage._id);
    lastSeenMessageIdRef.current = lastMessage._id;
  }, [activeMessages, markSeen, receiver?._id, userId]);

  const handleSelectChat = (chat: ChatSummary) => {
    setActiveChatId(chat._id);
    if (userId) {
      const other = getOtherParticipant(chat, userId);
      if (other?._id) {
        fetchChatHistory({ receiverId: other._id });
      }
    }
  };

  const handleSendMessage = (event: React.FormEvent) => {
    event.preventDefault();
    if (!messageText.trim() || !receiver?._id) return;
    setIsSending(true);
    sendMessage({
      receiverId: receiver._id,
      content: messageText.trim(),
      type: "text",
    });
    setMessageText("");
    stopTyping(receiver._id);
    setIsSending(false);
  };

  const handleTyping = (value: string) => {
    setMessageText(value);
    if (!receiver?._id) return;

    startTyping(receiver._id);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      stopTyping(receiver._id);
    }, 1200);
  };

  const renderMessageStatus = (message: ChatMessage) => {
    if (message.sender._id !== userId) return null;
    if (message.status === "seen") {
      return <CheckCheck className="w-4 h-4 text-emerald-500" />;
    }
    if (message.status === "delivered") {
      return <CheckCheck className="w-4 h-4 text-gray-400" />;
    }
    return <Check className="w-4 h-4 text-gray-400" />;
  };

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:h-[calc(100vh-160px)]">
      <div className="w-full lg:w-80 bg-white border border-gray-100 rounded-2xl shadow-sm flex flex-col">
        <div className="border-b border-gray-100 px-6 py-4">
          <h1 className="text-lg font-semibold text-gray-900">Chats</h1>
        </div>

        <div className="relative px-4 py-3">
          <Search className="absolute left-7 top-1/2 size-4 text-gray-400 -translate-y-1/2" />
          <Input
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 rounded-lg border-gray-200 focus-visible:ring-[#8A5BD5]"
          />
        </div>

        <div className="overflow-y-auto flex-1 min-h-0">
          {loadingChats ? (
            <div className="flex items-center justify-center gap-2 py-6 text-gray-500">
              <Loader2 className="h-4 w-4 animate-spin text-[#8A5BD5]" />
              Loading chats...
            </div>
          ) : filteredChats.length === 0 ? (
            <div className="text-center text-gray-500 py-8 px-4 text-sm">
              No chats found
            </div>
          ) : (
            filteredChats.map((chat: ChatSummary) => {
              const lastMessage = chat.lastMessage;
              const isActive = chat._id === activeChatId;
              return (
                <button
                  key={chat._id}
                  onClick={() => handleSelectChat(chat)}
                  className={`w-full flex items-center justify-between px-6 py-3 text-left transition-colors ${
                    isActive ? "bg-[#8A5BD5]/10" : "hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-[#8A5BD5]/10 flex items-center justify-center text-sm font-semibold text-[#8A5BD5]">
                      {(getChatDisplayName(chat, userId) || "U").charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {getChatDisplayName(chat, userId) || "Chat"}
                      </p>
                      <p className="text-xs text-gray-500 truncate max-w-[180px]">
                        {lastMessage?.content || "No messages yet"}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] text-gray-400">
                      {formatTime(lastMessage?.createdAt || chat.updatedAt)}
                    </p>
                    {chat.unreadMessages ? (
                      <span className="inline-flex items-center justify-center mt-1 rounded-full bg-[#8A5BD5] text-white text-[10px] min-w-[18px] h-[18px] px-1">
                        {chat.unreadMessages}
                      </span>
                    ) : null}
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      <div className="flex-1 bg-white border border-gray-100 rounded-2xl shadow-sm flex flex-col min-h-0">
        {!activeChat ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-10 space-y-3">
            <div className="h-16 w-16 rounded-full bg-[#8A5BD5]/10 flex items-center justify-center text-[#8A5BD5] font-semibold text-xl">
              💬
            </div>
            <h2 className="text-lg font-semibold text-gray-900">
              Select a chat to start messaging
            </h2>
            <p className="text-sm text-gray-500 max-w-sm">
              Pick a conversation from the left to load the message history.
            </p>
          </div>
        ) : (
          <>
            <div className="border-b border-gray-100 px-6 py-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Chatting with</p>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {getChatDisplayName(activeChat, userId)}
                  </h2>
                </div>
              <div className="text-xs text-gray-500">
                {typingUsers[receiver?._id || ""] ? "Typing..." : null}
              </div>
            </div>

            <div
              ref={listRef}
              className="flex-1 overflow-y-auto px-6 py-4 space-y-4 bg-gray-50/60 min-h-0"
            >
              {loadingMessages ? (
                <div className="flex items-center gap-2 text-gray-500">
                  <Loader2 className="h-4 w-4 animate-spin text-[#8A5BD5]" />
                  Loading messages...
                </div>
              ) : activeMessages.length === 0 ? (
                <div className="text-center text-gray-500 text-sm py-10">
                  No messages yet. Say hello!
                </div>
              ) : (
                activeMessages.map((message: ChatMessage) => {
                  const isOwn = message.sender._id === userId;
                  return (
                    <div
                      key={message._id}
                      className={`flex flex-col ${
                        isOwn ? "items-end" : "items-start"
                      }`}
                    >
                      <div
                        className={`max-w-[70%] rounded-2xl px-4 py-2 text-sm ${
                          isOwn
                            ? "bg-[#8A5BD5] text-white rounded-br-md"
                            : "bg-white text-gray-900 border border-gray-100 rounded-bl-md"
                        }`}
                      >
                        <p>{message.content}</p>
                        <div className="mt-1 flex items-center gap-2 text-[11px] text-gray-300">
                          <span className={isOwn ? "text-white/80" : "text-gray-400"}>
                            {formatTime(message.createdAt)}
                          </span>
                          {renderMessageStatus(message)}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              {receiver?._id && typingUsers[receiver._id] ? (
                <div className="text-xs text-gray-500">Typing...</div>
              ) : null}
            </div>

            <form
              onSubmit={handleSendMessage}
              className="border-t border-gray-100 px-4 py-4"
            >
              <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-3 py-2 shadow-sm">
                <Input
                  placeholder="Type a message..."
                  value={messageText}
                  onChange={(e) => handleTyping(e.target.value)}
                  className="border-none focus-visible:ring-0 focus-visible:ring-offset-0"
                />
                <Button
                  type="submit"
                  disabled={!messageText.trim() || isSending}
                  className="bg-[#8A5BD5] hover:bg-[#7A4EC3]"
                >
                  {isSending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default SiteChat;
