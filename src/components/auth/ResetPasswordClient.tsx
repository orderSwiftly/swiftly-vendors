"use client";
import { useState } from "react";
import { resetPassword } from "@/lib/auth";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";

export default function ResetPasswordClient() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [show, setShow] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const otpToken = searchParams?.get("token") || "";

  const handleSubmit = async () => {
    if (!password) {
      setError("Password is required.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (!confirmPassword) {
      setError("Please confirm your password.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!otpToken) {
      setError("Reset token is missing. Please request a new reset link.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await resetPassword(password, confirmPassword, otpToken);
      const jwt = data?.token || data?.data?.token;
      if (jwt) localStorage.setItem("token", jwt);
      router.push("/auth");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Confirm New Password
        </h1>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 w-full max-w-sm px-8 py-10 flex flex-col items-center gap-6">
        <div className="flex items-center gap-2">
          <Image src="/brand-logo.png" alt="Swiftly" width={32} height={32} />
          <span className="text-base font-semibold text-gray-700">swiftly</span>
        </div>
        <p className="text-sm font-medium text-gray-600 -mt-4">Swiftly IMS</p>

        {/* New Password */}
        <div className="w-full flex flex-col gap-1">
          <label className="text-xs text-gray-500 font-medium">
            New Password
          </label>
          <div className="relative">
            <input
              type={show ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              className="border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-(--prof-clr) w-full pr-10"
            />
            <button
              type="button"
              onClick={() => setShow((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {show ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div className="w-full flex flex-col gap-1">
          <label className="text-xs text-gray-500 font-medium">
            Confirm Password
          </label>
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter your password"
              className="border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-(--prof-clr) w-full pr-10"
            />
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>

        {error && <p className="text-red-500 text-xs w-full">{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-(--prof-clr) text-(--txt-clr) text-sm font-medium py-2.5 rounded-md hover:bg-(--acc-clr)/80 transition-colors disabled:opacity-60 cursor-pointer"
        >
          {loading ? "Saving..." : "Reset Password"}
        </button>
        <Link
                        href="/auth"
                        className="text-xs text-center text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        Back to login
                    </Link>
      </div>
    </>
  );
}