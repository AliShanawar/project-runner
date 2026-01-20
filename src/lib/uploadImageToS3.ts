import { userService } from "@/api/services/user.service";

/**
 * Uploads a file through the backend upload endpoint and returns the published URL.
 */
export const uploadImageToS3 = async (
  file: File
): Promise<{ fileUrl: string; key: string }> => {
  try {
    const response = await userService.uploadFile(file);

    if (!response.url) {
      throw new Error("Upload response missing url");
    }

    if (response.success === false) {
      throw new Error("Upload failed");
    }

    const url = response.url;
    return {
      fileUrl: url,
      key: response.key || url,
    };
  } catch (error) {
    console.error("File upload failed:", error);
    throw error;
  }
};
