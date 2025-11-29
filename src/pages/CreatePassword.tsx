import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import AuthLayout from "@/layout/AuthLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";

const CreatePassword = () => {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const resetPassword = useAuthStore((state) => state.resetPassword);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirm) {
      toast.error("Passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      await resetPassword(password);
      toast.success("Password updated successfully!");
      navigate("/");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div>
        {/* Header */}
        <h1 className="text-3xl font-semibold mb-2 text-[#1F1F24]">
          Create New Password
        </h1>
        <p className="text-gray-500 mb-8">
          Your new password must be different from previously used passwords.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* New Password */}
          <div>
            <Label htmlFor="password" className="text-sm font-medium">
              New Password
            </Label>
            <div className="relative mt-1">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <Label htmlFor="confirm" className="text-sm font-medium">
              Confirm Password
            </Label>
            <div className="relative mt-1">
              <Input
                id="confirm"
                type={showConfirm ? "text" : "password"}
                placeholder="Re-enter new password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                className="h-12 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-primary hover:bg-[hsl(261,54%,54%)] text-white font-semibold"
          >
            {loading ? "Updating..." : "Reset Password"}
          </Button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center">
          <span className="text-gray-500 text-sm">Back to </span>
          <Link
            to="/"
            className="text-sm font-medium text-primary hover:text-[hsl(261,54%,54%)]"
          >
            Sign In
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
};

export default CreatePassword;
