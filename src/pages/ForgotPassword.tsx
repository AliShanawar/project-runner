import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AuthLayout from "@/layout/AuthLayout";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  // const sendResetEmail = useAuthStore((state) => state.sendResetEmail); // define this in your store
  const navigate = useNavigate();
  const sendResetEmail = useAuthStore((state) => state.sendResetEmail);
  const isLoading = useAuthStore((state) => state.isLoading);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) return;
    try {
      await sendResetEmail(email);
      navigate("/confirm-email");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <AuthLayout>
      <div>
        {/* Heading */}
        <h1 className="text-3xl font-semibold mb-2 text-[#1F1F24]">
          Forgot Password
        </h1>
        <p className="text-gray-500 mb-8">
          Enter your email address and we’ll send you a link to reset your
          password.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label htmlFor="email" className="text-sm font-medium">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 h-12"
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 bg-primary hover:bg-[hsl(261,54%,54%)] text-white font-semibold"
          >
            {isLoading ? "Sending..." : "Send Reset Link"}
          </Button>
        </form>

        {/* Footer link */}
        <div className="mt-6 text-center">
          <span className="text-gray-500 text-sm">Remember your password?</span>
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

export default ForgotPassword;
