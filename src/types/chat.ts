/* ==================== CHAT TYPES ==================== */

export interface ChatUser {
  _id: string;
  name?: string;
  email?: string;
  image?: string;
  profilePicture?: string | null;
}

export interface ChatMessage {
  _id: string;
  chat: string;
  sender: ChatUser;
  content: string;
  type?: "text" | "image" | "file";
  status?: "sent" | "delivered" | "seen" | "deleted";
  createdAt: string;
  updatedAt?: string;
}

export interface ChatSummary {
  _id: string;
  chatName?: string;
  profilePicture?: string | null;
  isGroupChat?: boolean;
  participants: ChatUser[];
  lastMessage?: ChatMessage | null;
  totalMessages?: number;
  unreadMessages?: number;
  updatedAt?: string;
}

export interface SendMessageRequest {
  receiverId: string;
  content: string;
  type?: ChatMessage["type"];
}
