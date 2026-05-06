import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "@/layout/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";

const ConfirmEmail = () => {
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(60);
  const navigate = useNavigate();

  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const verifyResetOtp = useAuthStore((state) => state.verifyResetOtp);
  const resendOtp = useAuthStore((state) => state.resendOtp);
  const isLoading = useAuthStore((state) => state.isLoading);

  // Countdown timer
  useEffect(() => {
    if (timer === 0) return;
    const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const applyOtpDigits = (digits: string[], startIndex: number) => {
    if (digits.length === 0) return;

    const updated = [...otp];
    digits.slice(0, otp.length - startIndex).forEach((digit, offset) => {
      updated[startIndex + offset] = digit;
    });

    setOtp(updated);

    const nextIndex = Math.min(startIndex + digits.length, otp.length - 1);
    inputsRef.current[nextIndex]?.focus();
  };

  // Handle OTP input
  const handleChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return; // only digits

    if (value.length > 1) {
      applyOtpDigits(value.split(""), index);
      return;
    }

    const updated = [...otp];
    updated[index] = value;
    setOtp(updated);

    if (value && index < otp.length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handlePaste = (
    e: React.ClipboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    const pastedDigits = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .split("");

    if (pastedDigits.length === 0) return;

    e.preventDefault();
    applyOtpDigits(pastedDigits, index);
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  // Submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length !== 6) {
      toast.error("Please enter a valid 6-digit code");
      return;
    }

    try {
      await verifyResetOtp(code);
      navigate("/create-password");
    } catch (error) {
      toast.error("Invalid or expired code. Please try again.");
    }
  };

  // Resend OTP
  const handleResend = async () => {
    await resendOtp();
    setOtp(["", "", "", "", "", ""]);
    setTimer(60);
  };

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit} className="flex flex-col  ">
        {/* Logo area handled by AuthLayout */}
        <div>
          <h1 className="text-3xl font-semibold mb-2 text-[#1F1F24]">
            Confirm Email
          </h1>
          <p className="text-gray-500 mb-8 max-w-sm">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </p>
        </div>

        {/* OTP Boxes */}
        <div className="flex gap-5 justify-center mb-8">
          {otp.map((digit, index) => (
            <Input
              key={index}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              onPaste={(e) => handlePaste(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              ref={(el) => {
                inputsRef.current[index] = el;
              }}
              className="w-12 h-12 text-center text-lg font-semibold border-gray-300 focus:ring-2 focus:ring-primary"
            />
          ))}
        </div>

        {/* Timer + resend */}
        <div className="text-center mb-6">
          {timer > 0 ? (
            <p className="text-green-600 font-semibold">
              {String(Math.floor(timer / 60)).padStart(2, "0")}:
              {String(timer % 60).padStart(2, "0")}
            </p>
          ) : (
            <button
              disabled={isLoading}
              type="button"
              onClick={handleResend}
              className="text-sm cursor-pointer text-primary hover:text-[hsl(261,54%,54%)]"
            >
              Resend Code
            </button>
          )}
        </div>

        {/* Submit button */}
        <Button
          disabled={isLoading}
          type="submit"
          className="w-full h-12 bg-primary hover:bg-[hsl(261,54%,54%)] text-white font-semibold"
        >
          {isLoading ? "Verifying..." : "Verify"}
        </Button>
      </form>
    </AuthLayout>
  );
};

export default ConfirmEmail;
