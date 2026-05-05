/* ==================== CHAT TYPES ==================== */

export interface ChatUser {
  _id: string;
  name?: string;
  email?: string;
  image?: string;
  profilePicture?: string | null;
  siteId?: string | null;
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
  siteId?: string | null;
  isGroupChat?: boolean;
  participants: ChatUser[];
  lastMessage?: ChatMessage | null;
  totalMessages?: number;
  unreadMessages?: number;
  updatedAt?: string;
}

export interface SiteChatMemberItem {
  member: ChatUser & {
    role?: string;
    siteId?:
      | string
      | {
          _id: string;
          name?: string;
          location?: Record<string, unknown>;
        }
      | null;
    createdAt?: string;
  };
  chat:
    | {
        _id: string;
        isGroupChat?: boolean;
        participants?: Array<string | ChatUser>;
        updatedAt?: string;
      }
    | null;
  latestMessage?: ChatMessage | null;
  unreadMessages?: number;
}

export interface SiteMembersPagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export interface SendMessageRequest {
  receiverId: string;
  content: string;
  type?: ChatMessage["type"];
}
