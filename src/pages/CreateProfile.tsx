import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AuthLayout from "@/layout/AuthLayout";
import { Camera, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { uploadImageToS3 } from "@/lib/uploadImageToS3";

const CreateProfile = () => {
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement | null>(null);

  const handleAvatarChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const { fileUrl } = await uploadImageToS3(file);
      setAvatar(fileUrl);
    } catch (error) {
      console.error("Failed to upload avatar:", error);
      toast.error("Failed to upload avatar. Please try again.");
    } finally {
      setIsUploading(false);
      if (fileRef.current) {
        fileRef.current.value = "";
      }
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name) {
      toast.error("Please enter your name");
      return;
    }
    if (isUploading) {
      toast.error("Please wait for the avatar upload to finish");
      return;
    }
    // Save profile info (e.g. API call)
    navigate("/dashboard");
  };

  return (
    <AuthLayout>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center justify-center text-center"
      >
        {/* Heading */}
        <h1 className="text-3xl font-semibold mb-2 text-[#1F1F24]">
          Create your Profile
        </h1>
        <p className="text-gray-500 mb-8 max-w-sm">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </p>

        {/* Avatar Upload */}
        <div className="relative mb-8">
          <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200">
            {avatar ? (
              <img
                src={avatar}
                alt="Profile"
                className="object-cover w-full h-full"
              />
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-12 h-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a8.25 8.25 0 0115 0"
                />
              </svg>
            )}
          </div>

          {/* Upload Button (Camera Icon) */}
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className={`absolute bottom-1 right-1 bg-primary text-white rounded-full p-1.5 hover:bg-[hsl(261,54%,54%)] ${
              isUploading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isUploading}
          >
            {isUploading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Camera size={16} />
            )}
          </button>

          {/* Hidden file input */}
          <input
            type="file"
            accept="image/*"
            ref={fileRef}
            onChange={handleAvatarChange}
            className="hidden"
            disabled={isUploading}
          />
        </div>

        {/* Name Input */}
        <div className="w-full max-w-sm mb-8 text-left">
          <Label htmlFor="name" className="text-sm font-medium">
            Name
          </Label>
          <Input
            id="name"
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1 h-12"
          />
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full h-12 max-w-sm bg-primary hover:bg-[hsl(261,54%,54%)] text-white font-semibold"
        >
          NEXT
        </Button>
      </form>
    </AuthLayout>
  );
};

export default CreateProfile;
