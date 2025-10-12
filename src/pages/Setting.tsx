import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  User,
  Bell,
  Lock,
  FileText,
  BookText,
  HelpCircle,
  Globe,
  Trash2,
  Camera,
  Check,
  Mail,
  Phone,
  Globe2,
} from "lucide-react";

const tabs = [
  { key: "profile", label: "Profile", icon: User },
  { key: "notification", label: "Notification Setting", icon: Bell },
  { key: "password", label: "Change Password", icon: Lock },
  { key: "policy", label: "Privacy Policy", icon: FileText },
  { key: "terms", label: "Terms & Condition", icon: BookText },
  { key: "help", label: "Help Center", icon: HelpCircle },
  { key: "language", label: "Language", icon: Globe },
  { key: "delete", label: "Delete Account", icon: Trash2 },
];

export default function Setting() {
  const [activeTab, setActiveTab] = useState("profile");
  const [showSuccess, setShowSuccess] = useState(false);

  return (
    <div className="space-y-6 relative">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Setting</h1>
        <p className="text-muted-foreground text-sm">
          Manage your account preferences and app settings.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="bg-white border border-border rounded-2xl shadow-sm p-4 flex flex-col gap-2">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "bg-[#8A5BD5]/10 text-[#8A5BD5]"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="lg:col-span-3 bg-white border border-border rounded-2xl shadow-sm p-6 space-y-6">
          {activeTab === "profile" && <Profile />}
          {activeTab === "notification" && <Notification />}
          {activeTab === "password" && (
            <ChangePassword onSuccess={() => setShowSuccess(true)} />
          )}
          {activeTab === "policy" && <TextPage title="Privacy Policy" />}
          {activeTab === "terms" && <TextPage title="Terms & Condition" />}
          {activeTab === "help" && <HelpCenter />}
          {activeTab === "language" && <Language />}
          {activeTab === "delete" && <DeleteAccount />}
        </div>
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setShowSuccess(false)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl text-center px-10 py-12 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#8A5BD5]/10 relative">
              <div className="absolute inset-0 animate-pulse rounded-full bg-[#8A5BD5]/10" />
              <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#8A5BD5] text-white">
                <Check size={28} />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-[#8A5BD5]">
              Password Updated
            </h3>
            <p className="text-sm text-gray-500 max-w-xs mx-auto">
              Sed dignissim nisi a vehicula fringilla. Nulla faucibus dui
              tellus, ut dignissim.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------ INDIVIDUAL SECTIONS ------------------------ */

const Profile = () => (
  <>
    <div className="flex items-center justify-between">
      <h2 className="text-lg font-semibold">Profile</h2>
      <Button
        variant="outline"
        className="border-[#8A5BD5] text-[#8A5BD5] hover:bg-[#8A5BD5]/10 rounded-lg"
      >
        Edit Profile
      </Button>
    </div>

    <p className="text-sm text-gray-500">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas bibendum
      laoreet massa quis viverra.
    </p>

    <div className="flex flex-col items-center mt-6 space-y-6">
      <div className="relative">
        <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
          <User size={48} />
        </div>
        <label
          htmlFor="avatar-upload"
          className="absolute bottom-1 right-1 bg-[#8A5BD5] text-white rounded-full p-1.5 cursor-pointer hover:bg-[#7A4EC3] transition"
        >
          <Camera size={14} />
          <input id="avatar-upload" type="file" className="hidden" />
        </label>
      </div>

      <div className="w-full max-w-sm space-y-2">
        <label className="text-sm font-medium text-gray-700">Name</label>
        <Input
          placeholder="Enter your name"
          className="rounded-lg border-gray-200 focus-visible:ring-[#8A5BD5]"
        />
      </div>
    </div>
  </>
);

const Notification = () => (
  <>
    <h2 className="text-lg font-semibold">Notification Setting</h2>
    <p className="text-sm text-gray-500 mb-6">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas bibendum
      laoreet massa quis viverra.
    </p>
    <div className="space-y-4">
      {Array.from({ length: 10 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center justify-between border-b border-gray-100 pb-3"
        >
          <span className="text-sm text-gray-700 font-medium">
            Dummy Notification Type
          </span>
          <Switch defaultChecked />
        </div>
      ))}
    </div>
  </>
);

const ChangePassword = ({ onSuccess }: { onSuccess: () => void }) => (
  <>
    <h2 className="text-lg font-semibold">Change Password</h2>
    <p className="text-sm text-gray-500 mb-6">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas bibendum
      laoreet massa quis viverra.
    </p>
    <div className="space-y-4 max-w-sm">
      <Input
        placeholder="Enter your password"
        type="password"
        className="rounded-lg border-gray-200 focus-visible:ring-[#8A5BD5]"
      />
      <Input
        placeholder="Create password"
        type="password"
        className="rounded-lg border-gray-200 focus-visible:ring-[#8A5BD5]"
      />
      <Input
        placeholder="Confirm password"
        type="password"
        className="rounded-lg border-gray-200 focus-visible:ring-[#8A5BD5]"
      />
    </div>
    <Button
      className="bg-[#8A5BD5] hover:bg-[#7A4EC3] text-white rounded-lg mt-6"
      onClick={onSuccess}
    >
      DELETE ACCOUNT
    </Button>
  </>
);

const TextPage = ({ title }: { title: string }) => (
  <>
    <h2 className="text-lg font-semibold">{title}</h2>
    <p className="text-sm text-gray-500 mb-4">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed a nulla et
      risus vehicula pretium.
    </p>
    <div className="text-sm text-gray-700 leading-relaxed space-y-4 max-h-[500px] overflow-y-auto pr-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <p key={i}>
          Vestibulum non turpis bibendum, ultricies sapien ut, consectetur enim.
          Cras magna velit, vulputate vel posuere sed, maximus vestibulum est.
          Maecenas sodales tincidunt odio a tempor. Pellentesque luctus sapien
          non molestie varius.
        </p>
      ))}
    </div>
  </>
);

const HelpCenter = () => (
  <>
    <h2 className="text-lg font-semibold">Help Center</h2>
    <p className="text-sm text-gray-500 mb-6">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas bibendum
      laoreet massa quis viverra.
    </p>
    <div className="space-y-4 text-sm text-gray-700">
      <div className="flex items-center gap-3">
        <Mail className="text-[#8A5BD5]" size={18} />
        <span>abc@gmail.com</span>
      </div>
      <div className="flex items-center gap-3">
        <Phone className="text-[#8A5BD5]" size={18} />
        <span>+13123232323</span>
      </div>
      <div className="flex items-center gap-3">
        <Globe2 className="text-[#8A5BD5]" size={18} />
        <span>www.ProjectRunner.com</span>
      </div>
    </div>
  </>
);

const Language = () => (
  <>
    <h2 className="text-lg font-semibold">Language</h2>
    <p className="text-sm text-gray-500 mb-6">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas bibendum
      laoreet massa quis viverra.
    </p>
    <RadioGroup defaultValue="english" className="space-y-3">
      <label className="flex items-center gap-2">
        <RadioGroupItem value="english" id="english" />
        <span>English</span>
      </label>
      <label className="flex items-center gap-2">
        <RadioGroupItem value="polish" id="polish" />
        <span>Polish</span>
      </label>
      <label className="flex items-center gap-2">
        <RadioGroupItem value="romanian" id="romanian" />
        <span>Romanian</span>
      </label>
    </RadioGroup>
  </>
);

const DeleteAccount = () => (
  <>
    <h2 className="text-lg font-semibold">Delete Account</h2>
    <p className="text-sm text-gray-500 mb-4">
      We’re sorry to see you go. Please note that this action is permanent and
      cannot be undone. All your data will be deleted.
    </p>
    <div className="max-w-md space-y-4">
      <Input
        placeholder="Enter your password"
        type="password"
        className="rounded-lg border-gray-200 focus-visible:ring-[#8A5BD5]"
      />
      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input type="checkbox" className="accent-[#8A5BD5]" />
        <span>
          I accept{" "}
          <a href="#" className="text-[#8A5BD5] hover:underline">
            Privacy policy
          </a>{" "}
          &{" "}
          <a href="#" className="text-[#8A5BD5] hover:underline">
            Terms of use
          </a>
        </span>
      </label>
    </div>
    <Button className="bg-[#8A5BD5] hover:bg-[#7A4EC3] text-white rounded-lg mt-6">
      DELETE ACCOUNT
    </Button>
  </>
);
