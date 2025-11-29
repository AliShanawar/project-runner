/* ==================== DEVICE ID MANAGEMENT ==================== */

const DEVICE_ID_KEY = "device_id";
const DEVICE_TOKEN_KEY = "device_token";

/**
 * Generates a random device ID
 */
function generateDeviceId(): string {
  return `device_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
}

/**
 * Generates a random device token
 */
function generateDeviceToken(): string {
  return `token_${Date.now()}_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
}

/**
 * Gets or creates device ID from localStorage
 */
export function getDeviceId(): string {
  let deviceId = localStorage.getItem(DEVICE_ID_KEY);

  if (!deviceId) {
    deviceId = generateDeviceId();
    localStorage.setItem(DEVICE_ID_KEY, deviceId);
  }

  return deviceId;
}

/**
 * Gets or creates device token from localStorage
 */
export function getDeviceToken(): string {
  let deviceToken = localStorage.getItem(DEVICE_TOKEN_KEY);

  if (!deviceToken) {
    deviceToken = generateDeviceToken();
    localStorage.setItem(DEVICE_TOKEN_KEY, deviceToken);
  }

  return deviceToken;
}

/**
 * Gets device info for API requests
 */
export function getDeviceInfo() {
  return {
    id: getDeviceId(),
    deviceToken: getDeviceToken(),
  };
}

/**
 * Clears device info (useful for logout)
 */
export function clearDeviceInfo() {
  localStorage.removeItem(DEVICE_ID_KEY);
  localStorage.removeItem(DEVICE_TOKEN_KEY);
}
