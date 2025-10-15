import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search, Send, Paperclip } from "lucide-react";

const workPacks = [
  {
    id: 1,
    name: "Work Pack Name",
    admin: "Admin:Nunc mauris arcu, auctor sit amet ante porta",
    time: "8:25 PM",
    unread: true,
    messages: [
      {
        id: 1,
        sender: "Name",
        text: "Nunc mauris arcu, auctor sit amet ante a, cursus lobortis tellus. Donec ullamcorper, lacus pretium facilisis elementum, ligula ex tristique ipsum, in hendrerit justo ipsum non ipsum.",
        time: "June 30 at 2:40pm",
      },
      {
        id: 2,
        sender: "Name",
        text: "Nunc mauris arcu, auctor sit amet ante a, cursus lobortis tellus. Donec ullamcorper, lacus pretium facilisis elementum, ligula ex tristique ipsum, in hendrerit justo ipsum non ipsum.",
        time: "June 30 at 2:40pm",
      },
    ],
  },
  {
    id: 2,
    name: "Work Pack Name",
    admin: "Admin:Nunc mauris arcu, auctor sit amet ante porta",
    time: "8:25 PM",
    unread: true,
    messages: [],
  },
  {
    id: 3,
    name: "Work Pack Name",
    admin: "Admin:Nunc mauris arcu, auctor sit amet ante porta",
    time: "8:25 PM",
    unread: false,
    messages: [],
  },
];

const SiteWorkPack = () => {
  const [selectedPack, setSelectedPack] = useState<number | null>(null);
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (!message.trim() || selectedPack === null) return;
    // Append message locally (simulated)
    const packIndex = workPacks.findIndex((p) => p.id === selectedPack);
    workPacks[packIndex].messages.push({
      id: Date.now(),
      sender: "You",
      text: message,
      time: "Just now",
    });
    setMessage("");
  };

  const activePack = workPacks.find((p) => p.id === selectedPack);

  return (
    <div className="flex gap-6 h-[calc(100vh-160px)]">
      {/* Sidebar */}
      <div className="w-80 bg-white border border-gray-100 rounded-2xl shadow-sm flex flex-col">
        <div className="border-b border-gray-100 px-6 py-4">
          <h1 className="text-lg font-semibold text-gray-900">Work Pack</h1>
        </div>

        {/* Search */}
        <div className="relative px-4 py-3">
          <Search className="absolute left-7 top-1/2 size-4 text-gray-400 -translate-y-1/2" />
          <Input
            placeholder="Search"
            className="pl-9 rounded-lg border-gray-200 focus-visible:ring-[#8A5BD5]"
          />
        </div>

        {/* Work Pack List */}
        <div className="overflow-y-auto flex-1">
          {workPacks.map((pack) => (
            <div
              key={pack.id}
              onClick={() => setSelectedPack(pack.id)}
              className={`px-6 py-3 cursor-pointer hover:bg-gray-50 transition-colors ${
                selectedPack === pack.id ? "bg-[#8A5BD5]/5" : ""
              }`}
            >
              <div className="flex justify-between items-center">
                <p className="font-medium text-sm text-gray-900">{pack.name}</p>
                <span className="text-xs text-gray-400">{pack.time}</span>
              </div>
              <p className="text-xs text-gray-500 truncate">{pack.admin}</p>
              {pack.unread && (
                <span className="w-2 h-2 bg-[#8A5BD5] rounded-full inline-block mt-1"></span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Right Content */}
      <div className="flex-1 bg-white border border-gray-100 rounded-2xl shadow-sm flex flex-col">
        {!activePack ? (
          // Empty State
          <div className="flex-1 flex flex-col items-center justify-center text-center p-10">
            <img
              src="/assets/illustrations/chat-placeholder.png"
              alt="Placeholder"
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
        ) : (
          // Active Conversation
          <>
            <div className="border-b border-gray-100 px-6 py-4 flex justify-between items-center">
              <h2 className="text-gray-900 font-semibold text-base">
                {activePack.name}
              </h2>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {activePack.messages.map((msg) => (
                <div key={msg.id}>
                  <p className="text-sm font-medium text-[#8A5BD5]">
                    {msg.sender}
                  </p>
                  <p className="text-xs text-gray-400 mb-1">{msg.time}</p>
                  <div className="bg-gray-100 rounded-lg p-3 text-sm text-gray-700 max-w-xl">
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="border-t border-gray-100 p-4 flex items-center gap-3">
              <Paperclip className="text-gray-400 size-5 cursor-pointer" />
              <Input
                placeholder="Type a message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className="flex-1 rounded-lg border-gray-200 focus-visible:ring-[#8A5BD5]"
              />
              <button
                onClick={handleSend}
                className="bg-[#8A5BD5] text-white p-2 rounded-lg hover:bg-[#7A4EC3]"
              >
                <Send className="size-4" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SiteWorkPack;
