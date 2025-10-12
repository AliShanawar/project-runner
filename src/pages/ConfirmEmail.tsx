import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "@/layout/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/authStore";

const ConfirmEmail = () => {
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(60);
  const navigate = useNavigate();

  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const verifyOtp = useAuthStore((state) => state.verifyOtp); // add in store
  const resendOtp = useAuthStore((state) => state.resendOtp); // add in store

  // Countdown timer
  useEffect(() => {
    if (timer === 0) return;
    const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  // Handle OTP input
  const handleChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return; // only digits
    const updated = [...otp];
    updated[index] = value;
    setOtp(updated);

    if (value && index < otp.length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
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
      alert("Please enter a valid 6-digit code");
      return;
    }

    try {
      await verifyOtp(code);
      navigate("/create-password");
    } catch (err) {
      alert("Invalid or expired code. Please try again.");
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
              type="button"
              onClick={handleResend}
              className="text-sm text-primary hover:text-[hsl(261,54%,54%)]"
            >
              Send again
            </button>
          )}
        </div>

        {/* Submit button */}
        <Button
          type="submit"
          className="w-full h-12 bg-primary hover:bg-[hsl(261,54%,54%)] text-white font-semibold"
        >
          NEXT
        </Button>
      </form>
    </AuthLayout>
  );
};

export default ConfirmEmail;
