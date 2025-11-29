/* ==================== CHAT TYPES ==================== */

export interface ChatMessage {
  id: string;
  siteId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  message: string;
  timestamp: string;
  type?: "text" | "image" | "file";
  fileUrl?: string;
}

export interface ChatRoom {
  id: string;
  siteId: string;
  siteName: string;
  lastMessage?: ChatMessage;
  unreadCount: number;
}

export interface SendMessageRequest {
  siteId: string;
  message: string;
  type?: ChatMessage["type"];
  fileUrl?: string;
}
