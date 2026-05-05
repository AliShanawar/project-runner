import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Send, Loader2, CheckCheck, Check } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useChatStore } from "@/store/chat.store";
import type { ChatMessage, SiteChatMemberItem } from "@/types";

const getContactName = (
  member?: Pick<SiteChatMemberItem["member"], "name" | "email">,
) =>
  member?.name || member?.email || "Team member";

const formatTime = (value?: string) => {
  if (!value) return "";
  const date = new Date(value);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const SiteChat = () => {
  const { siteId } = useParams<{ siteId: string }>();
  const { user } = useAuthStore();
  const siteMembers = useChatStore((state) => state.siteMembers);
  const messages = useChatStore((state) => state.messages);
  const activeChatId = useChatStore((state) => state.activeChatId);
  const typingUsers = useChatStore((state) => state.typingUsers);
  const loadingSiteMembers = useChatStore((state) => state.loadingSiteMembers);
  const loadingMessages = useChatStore((state) => state.loadingMessages);
  const loadingMoreMessages = useChatStore((state) => state.loadingMoreMessages);
  const hasMoreMessages = useChatStore((state) => state.hasMoreMessages);
  const connect = useChatStore((state) => state.connect);
  const fetchSiteMembers = useChatStore((state) => state.fetchSiteMembers);
  const fetchChatHistory = useChatStore((state) => state.fetchChatHistory);
  const setActiveChatId = useChatStore((state) => state.setActiveChatId);
  const sendMessage = useChatStore((state) => state.sendMessage);
  const startTyping = useChatStore((state) => state.startTyping);
  const stopTyping = useChatStore((state) => state.stopTyping);
  const markSeen = useChatStore((state) => state.markSeen);
  const loadMoreMessages = useChatStore((state) => state.loadMoreMessages);

  const [search, setSearch] = useState("");
  const [messageText, setMessageText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [optimisticMessages, setOptimisticMessages] = useState<ChatMessage[]>(
    [],
  );
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const previousScrollHeightRef = useRef<number>(0);
  const userId = user?._id;

  useEffect(() => {
    if (userId) {
      connect(userId);
      if (siteId) {
        fetchSiteMembers({ siteId, page: 1, limit: 50 });
      }
    }
  }, [userId, siteId, connect, fetchSiteMembers]);

  useEffect(() => {
    if (!selectedMemberId || activeChatId) return;
    const contact = siteMembers.find(
      (item) => item.member._id === selectedMemberId,
    );

    if (contact?.chat) {
      setActiveChatId(contact.chat._id);
      fetchChatHistory({ receiverId: contact.member._id });
    }
  }, [
    activeChatId,
    fetchChatHistory,
    selectedMemberId,
    siteMembers,
    setActiveChatId,
  ]);

  const filteredContacts = useMemo(() => {
    if (!search.trim()) return siteMembers;
    const query = search.toLowerCase();
    return siteMembers.filter(({ member, chat, latestMessage }) => {
      return (
        latestMessage?.content?.toLowerCase().includes(query) ||
        chat?._id?.toLowerCase().includes(query) ||
        member.name?.toLowerCase().includes(query) ||
        member.email?.toLowerCase().includes(query)
      );
    });
  }, [siteMembers, search]);

  const activeContact = siteMembers.find(
    (item) => item.member._id === selectedMemberId,
  );
  const receiver = activeContact?.member;
  const activeMessages: ChatMessage[] = useMemo(() => {
    if (!activeChatId) return [];
    return messages[activeChatId] || [];
  }, [activeChatId, messages]);
  const displayMessages = useMemo(
    () => [...activeMessages, ...optimisticMessages],
    [activeMessages, optimisticMessages],
  );
  const lastSeenMessageIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (activeMessages.length === 0 || optimisticMessages.length === 0) return;

    setOptimisticMessages((pending) =>
      pending.filter(
        (optimistic) =>
          !activeMessages.some(
            (message) =>
              message.sender._id === optimistic.sender._id &&
              message.content === optimistic.content,
          ),
      ),
    );
  }, [activeMessages, optimisticMessages.length]);

  // Scroll to bottom on new messages or initial load, but maintain position when loading more
  useEffect(() => {
    if (!listRef.current) return;

    if (loadingMoreMessages) {
      // Store scroll height before loading more messages
      previousScrollHeightRef.current = listRef.current.scrollHeight;
    } else if (previousScrollHeightRef.current > 0) {
      // Restore scroll position after loading older messages
      const newScrollHeight = listRef.current.scrollHeight;
      const scrollDiff = newScrollHeight - previousScrollHeightRef.current;
      listRef.current.scrollTop = scrollDiff;
      previousScrollHeightRef.current = 0;
    } else {
      // Scroll to bottom for new messages
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [displayMessages, loadingMessages, loadingMoreMessages]);

  // Handle scroll to load more messages
  const handleScroll = () => {
    if (!listRef.current || !receiver?._id || !activeChatId) return;

    const { scrollTop } = listRef.current;
    const hasMore = hasMoreMessages[activeChatId] !== false;

    // Load more when scrolled near top (within 100px)
    if (scrollTop < 100 && hasMore && !loadingMoreMessages && !loadingMessages) {
      previousScrollHeightRef.current = listRef.current.scrollHeight;
      loadMoreMessages(receiver._id);
    }
  };

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

  const handleSelectContact = ({ member, chat }: SiteChatMemberItem) => {
    setSelectedMemberId(member._id);
    setMessageText("");
    setOptimisticMessages([]);

    if (chat) {
      setActiveChatId(chat._id);
      fetchChatHistory({ receiverId: member._id });
    } else {
      setActiveChatId(null);
    }
  };

  const handleSendMessage = (event: React.FormEvent) => {
    event.preventDefault();
    const content = messageText.trim();
    if (!content || !receiver?._id || !userId) return;

    setIsSending(true);
    setOptimisticMessages((pending) => [
      ...pending,
      {
        _id: `optimistic-${Date.now()}`,
        chat: activeChatId || `pending-${receiver._id}`,
        sender: {
          _id: userId,
          name: user?.name,
          email: user?.email,
          image: user?.image,
          profilePicture: user?.profilePicture,
        },
        content,
        type: "text",
        status: "sent",
        createdAt: new Date().toISOString(),
      },
    ]);

    sendMessage({
      receiverId: receiver._id,
      content,
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
          {loadingSiteMembers ? (
            <div className="flex items-center justify-center gap-2 py-6 text-gray-500">
              <Loader2 className="h-4 w-4 animate-spin text-[#8A5BD5]" />
              Loading members...
            </div>
          ) : filteredContacts.length === 0 ? (
            <div className="text-center text-gray-500 py-8 px-4 text-sm">
              {search.trim()
                ? "No members match your search"
                : "No site members are assigned yet"}
            </div>
          ) : (
            filteredContacts.map((contact) => {
              const { member, chat, latestMessage } = contact;
              const lastMessage = latestMessage;
              const isActive = member._id === selectedMemberId;
              const memberImage =
                member.image || member.profilePicture;
              return (
                <button
                  key={member._id}
                  onClick={() => handleSelectContact(contact)}
                  className={`w-full flex items-center justify-between px-6 py-3 text-left transition-colors ${
                    isActive ? "bg-[#8A5BD5]/10" : "hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {memberImage ? (
                      <img
                        src={memberImage}
                        alt={getContactName(member)}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-[#8A5BD5]/10 flex items-center justify-center text-sm font-semibold text-[#8A5BD5]">
                        {getContactName(member).charAt(0)}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {getContactName(member)}
                      </p>
                      <p className="text-xs text-gray-500 truncate max-w-[180px]">
                        {lastMessage?.content || "No conversation yet"}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] text-gray-400">
                      {formatTime(lastMessage?.createdAt || chat?.updatedAt)}
                    </p>
                    {contact.unreadMessages ? (
                      <span className="inline-flex items-center justify-center mt-1 rounded-full bg-[#8A5BD5] text-white text-[10px] min-w-[18px] h-[18px] px-1">
                        {contact.unreadMessages}
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
        {!activeContact ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-10 space-y-3">
            <div className="h-16 w-16 rounded-full bg-[#8A5BD5]/10 flex items-center justify-center text-[#8A5BD5] font-semibold text-xl">
              💬
            </div>
            <h2 className="text-lg font-semibold text-gray-900">
              Select a chat to start messaging
            </h2>
            <p className="text-sm text-gray-500 max-w-sm">
              Pick a site member from the left to load the conversation or start a new one.
            </p>
          </div>
        ) : (
          <>
            <div className="border-b border-gray-100 px-6 py-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Chatting with</p>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {getContactName(activeContact.member)}
                  </h2>
                </div>
              <div className="text-xs text-gray-500">
                {typingUsers[receiver?._id || ""] ? "Typing..." : null}
              </div>
            </div>

            <div
              ref={listRef}
              onScroll={handleScroll}
              className="flex-1 overflow-y-auto px-6 py-4 space-y-4 bg-gray-50/60 min-h-0"
            >
              {loadingMoreMessages && (
                <div className="flex items-center justify-center gap-2 text-gray-500 py-2">
                  <Loader2 className="h-4 w-4 animate-spin text-[#8A5BD5]" />
                  <span className="text-xs">Loading older messages...</span>
                </div>
              )}
              {loadingMessages ? (
                <div className="flex min-h-full items-center justify-center gap-2 text-gray-500">
                  <Loader2 className="h-4 w-4 animate-spin text-[#8A5BD5]" />
                  Loading messages...
                </div>
              ) : displayMessages.length === 0 ? (
                <div className="mx-auto flex max-w-sm flex-col items-center justify-center py-16 text-center">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#8A5BD5]/10 text-xl">
                    💬
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900">
                    No conversation yet
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Send the first message to start a chat with{" "}
                    {getContactName(activeContact.member)}.
                  </p>
                </div>
              ) : (
                displayMessages.map((message: ChatMessage) => {
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
