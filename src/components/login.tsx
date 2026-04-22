// src/components/login.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginOwner } from "@/lib/auth";
import { Eye, EyeOff } from "lucide-react";
import Spinner from "./ui/spinner";
import { toast } from "sonner";

export default function LoginForm() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPw, setShowPw] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = await loginOwner(email, password);
            localStorage.setItem("token", data.token);
            toast.success("Login successful! Redirecting...");
            router.push("/role-gate");
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : "Login failed.";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
                <label htmlFor="login-email" className="text-sm font-medium" style={{ fontFamily: "var(--sec-ff)", color: "var(--pry-clr)" }}>
                    Email
                </label>
                <input
                    id="login-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@company.com"
                    className="rounded-lg px-4 py-2.5 text-sm outline-none transition-colors"
                    style={{ fontFamily: "var(--sec-ff)", backgroundColor: "var(--txt-clr)", color: "var(--pry-clr)", border: "1px solid #d1d5db" }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "var(--acc-clr)")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "#d1d5db")}
                />
            </div>

            <div className="flex flex-col gap-1.5">
                <label htmlFor="login-password" className="text-sm font-medium" style={{ fontFamily: "var(--sec-ff)", color: "var(--pry-clr)" }}>
                    Enter Password
                </label>
                <div className="relative">
                    <input
                        id="login-password"
                        type={showPw ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="At least 6 characters"
                        className="w-full rounded-lg px-4 py-2.5 text-sm outline-none transition-colors pr-10"
                        style={{ fontFamily: "var(--sec-ff)", backgroundColor: "var(--txt-clr)", color: "var(--pry-clr)", border: "1px solid #d1d5db" }}
                        onFocus={(e) => (e.currentTarget.style.borderColor = "var(--acc-clr)")}
                        onBlur={(e) => (e.currentTarget.style.borderColor = "#d1d5db")}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPw(!showPw)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-80 transition-opacity"
                        style={{ color: "var(--pry-clr)" }}
                    >
                        {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>
            </div>

            <button
                type="button"
                className="text-sm text-left w-fit -mt-1 cursor-pointer"
                style={{ fontFamily: "var(--sec-ff)", color: "var(--bg-clr)" }}
                onClick={() => router.push("/auth/forgot-psw")}
            >
                Forgot Password?
            </button>

            <button
                type="submit"
                disabled={loading}
                className="mt-1 rounded-lg py-2.5 text-sm font-semibold transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer"
                style={{ fontFamily: "var(--pry-ff)", backgroundColor: "var(--acc-clr)", color: "var(--pry-clr)" }}
            >
                {loading ? <Spinner /> : "Login"}
            </button>
        </form>
    );
}