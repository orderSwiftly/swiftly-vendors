"use client";
import { useState, useRef, useEffect } from "react";
import { verifyOtp } from "@/lib/auth";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

export default function VerifyOtpClient() {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  useEffect(() => {
    if (timer === 0) {
      setCanResend(true);
      return;
    }
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const updated = [...code];
    updated[index] = value.slice(-1);
    setCode(updated);
    if (value && index < 5) inputs.current[index + 1]?.focus();
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    setTimer(30);
    setCanResend(false);
    setError(null);
    try {
      const { requestOtp } = await import("@/lib/auth");
      await requestOtp(email);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to resend code.");
    }
  };

  const handleSubmit = async () => {
    const fullCode = code.join("");
    if (fullCode.length < 6) {
      setError("Please enter the full 6-digit code.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await verifyOtp(email, fullCode);
      router.push("/auth/reset-psw");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Invalid code.");
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (s: number) => `0:${s.toString().padStart(2, "0")}`;

  return (
    <>
      {/* Outside card heading */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Enter Verification Code
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Enter the 4-digit code that we have sent via the email{" "}
          <span className="font-semibold text-gray-800">{email}</span>
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 w-full max-w-sm px-8 py-10 flex flex-col items-center gap-6">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Image src="/brand-logo.png" alt="Swiftly" width={32} height={32} />
          <span className="text-base font-semibold text-gray-700">swiftly</span>
        </div>
        <p className="text-sm font-medium text-gray-600 -mt-4">Swiftly IIMS</p>

        {/* OTP inputs */}
        <div className="flex gap-3 justify-center">
          {code.map((digit, i) => (
            <input
              key={i}
              ref={(el) => {
                inputs.current[i] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className="w-12 h-12 text-center text-lg font-semibold border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--prof-clr)"
            />
          ))}
        </div>

        {/* Resend */}
        <p className="text-xs text-gray-400 -mt-2">
          {canResend ? (
            <button
              onClick={handleResend}
              className="text-(--prof-clr) font-medium hover:underline"
            >
              Resend code
            </button>
          ) : (
            <>
              Resend code in{" "}
              <span className="font-medium text-gray-600">
                {formatTime(timer)}
              </span>
            </>
          )}
        </p>

        {error && <p className="text-red-500 text-xs text-center">{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-(--prof-clr) text-(--txt-clr) text-sm font-medium py-2.5 rounded-md hover:bg-(--acc-clr)/80 transition-colors disabled:opacity-60 cursor-pointer"
        >
          {loading ? "Verifying..." : "Verify"}
        </button>
      </div>
    </>
  );
}
