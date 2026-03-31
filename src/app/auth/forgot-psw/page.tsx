// src/app/auth/forgot-psw/page.tsx

"use client";
import { useState } from "react";
import { requestOtp } from "@/lib/auth";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleSubmit = async () => {
        if (!email.trim()) {
            setError("Email is required.");
            return;
        }
        setLoading(true);
        setError(null);
        try {
            await requestOtp(email);
            // pass email to verify page via query param
            router.push(`/auth/verify-otp?email=${encodeURIComponent(email)}`);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sec-ff">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 w-full max-w-sm px-8 py-10 flex flex-col items-center gap-6">
                <div className="flex flex-col items-center gap-1">
                    <Image src="/brand-logo.png" alt="Swiftly" width={36} height={36} />
                    <span className="text-sm font-semibold text-gray-700">Swiftly IMS</span>
                </div>

                <div className="text-center">
                    <h1 className="text-xl font-bold text-gray-800">Reset your password</h1>
                    <p className="text-xs text-gray-400 mt-1">
                        Enter your email and we`ll send you a verification code.
                    </p>
                </div>

                <div className="w-full flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                        <label className="text-xs text-gray-500 font-medium">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="example@swiftly.com"
                            className="border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-(--prof-clr) w-full"
                        />
                    </div>

                    {error && <p className="text-red-500 text-xs">{error}</p>}

                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="w-full bg-(--prof-clr) text-(--txt-clr) text-sm font-medium py-2.5 rounded-md hover:bg-(--acc-clr)/80 transition-colors disabled:opacity-60 cursor-pointer"
                    >
                        {loading ? "Sending..." : "Send Reset Code"}
                    </button>

                    <Link
                        href="/auth/login"
                        className="text-xs text-center text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        Back to login
                    </Link>
                </div>
            </div>
        </main>
    );
}