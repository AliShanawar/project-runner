import React from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const chats = [
  {
    id: 1,
    name: "Site Name",
    message: "Thanks everyone",
    time: "8:25 PM",
    unread: false,
    avatar: "/assets/chat/site.png",
  },
  {
    id: 2,
    name: "Sofia",
    message: "Thanks everyone",
    time: "8:25 PM",
    unread: false,
    avatar: "/assets/chat/sofia.png",
  },
  {
    id: 3,
    name: "Taylor",
    message: "Thanks everyone",
    time: "8:25 PM",
    unread: true,
    avatar: "/assets/chat/taylor.png",
  },
  {
    id: 4,
    name: "Sofia",
    message: "Thanks everyone",
    time: "8:25 PM",
    unread: false,
    avatar: "/assets/chat/sofia.png",
  },
];

const SiteChat = () => {
  return (
    <div className="flex gap-6 h-[calc(100vh-160px)]">
      {/* Left Sidebar (Chat List) */}
      <div className="w-80 bg-white border border-gray-100 rounded-2xl shadow-sm flex flex-col">
        <div className="border-b border-gray-100 px-6 py-4">
          <h1 className="text-lg font-semibold text-gray-900">Chats</h1>
        </div>

        {/* Search Bar */}
        <div className="relative px-4 py-3">
          <Search className="absolute left-7 top-1/2 size-4 text-gray-400 -translate-y-1/2" />
          <Input
            placeholder="Search"
            className="pl-9 rounded-lg border-gray-200 focus-visible:ring-[#8A5BD5]"
          />
        </div>

        {/* Chat List */}
        <div className="overflow-y-auto flex-1">
          {chats.map((chat) => (
            <div
              key={chat.id}
              className={`flex items-center justify-between px-6 py-3 cursor-pointer hover:bg-gray-50 transition-colors ${
                chat.unread ? "bg-[#8A5BD5]/5" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <img
                  src={chat.avatar}
                  alt={chat.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {chat.name}
                  </p>
                  <p className="text-xs text-gray-500 truncate w-40">
                    {chat.message}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400">{chat.time}</p>
                {chat.unread && (
                  <span className="block w-2 h-2 bg-[#8A5BD5] rounded-full mt-1 ml-auto"></span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel (Empty State / Chat Content) */}
      <div className="flex-1 bg-white border border-gray-100 rounded-2xl shadow-sm flex flex-col items-center justify-center text-center p-10">
        <img
          src="/assets/illustrations/chat-placeholder.png"
          alt="Chat illustration"
          className="w-60 mb-6"
        />
        <h2 className="text-lg font-semibold text-gray-900">
          Lorem Ipsum Dolor Sit Amet
        </h2>
        <p className="text-sm text-gray-500 max-w-sm mx-auto">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
          bibendum laoreet massa quis viverra.
        </p>
      </div>
    </div>
  );
};

export default SiteChat;
