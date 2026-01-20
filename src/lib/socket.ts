import { io, type Socket } from "socket.io-client";

const DEFAULT_SOCKET_URL = "http://localhost:3000";

let socket: Socket | null = null;
let activeUserId: string | null = null;

const resolveSocketUrl = () => {
  const configured =
    import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_BASE_URL;

  if (!configured) return DEFAULT_SOCKET_URL;

  try {
    const url = new URL(configured);
    // Drop any API path segment (e.g., /api)
    url.pathname = "";
    return url.origin;
  } catch (error) {
    console.error("Failed to parse socket URL, using fallback:", error);
    return DEFAULT_SOCKET_URL;
  }
};

export const SOCKET_URL = resolveSocketUrl();

export function initSocket(userId: string) {
  if (socket && activeUserId === userId) {
    return socket;
  }

  if (socket) {
    socket.disconnect();
  }

  socket = io(SOCKET_URL, {
    transports: ["websocket"],
    withCredentials: true,
  });
  activeUserId = userId;

  socket.on("connect", () => {
    socket?.emit("setup", userId);
  });

  return socket;
}

export function getSocket() {
  return socket;
}

export function closeSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
    activeUserId = null;
  }
}
