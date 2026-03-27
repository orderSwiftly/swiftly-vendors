// src/components/signup.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import Spinner from "./ui/spinner";

interface SignupFormProps {
    onSwitchToLogin: () => void;
}

export default function SignupForm({ onSwitchToLogin }: Readonly<SignupFormProps>) {
    const router = useRouter();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPw, setShowPw] = useState(false);
    const [showConfirmPw, setShowConfirmPw] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const inputStyle = {
        fontFamily: "var(--sec-ff)",
        backgroundColor: "var(--txt-clr)",
        color: "var(--pry-clr)",
        border: "1px solid #d1d5db",
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        setLoading(true);
        try {
            router.push("/dashboard");
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Sign up failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex gap-3">
                <div className="flex flex-col gap-1.5 flex-1">
                    <label htmlFor="first-name" className="text-sm font-medium" style={{ fontFamily: "var(--sec-ff)", color: "var(--pry-clr)" }}>
                        First Name
                    </label>
                    <input
                        id="first-name"
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                        placeholder="John"
                        className="rounded-lg px-4 py-2.5 text-sm outline-none transition-colors"
                        style={inputStyle}
                        onFocus={(e) => (e.currentTarget.style.borderColor = "var(--acc-clr)")}
                        onBlur={(e) => (e.currentTarget.style.borderColor = "#d1d5db")}
                    />
                </div>
                <div className="flex flex-col gap-1.5 flex-1">
                    <label htmlFor="last-name" className="text-sm font-medium" style={{ fontFamily: "var(--sec-ff)", color: "var(--pry-clr)" }}>
                        Last Name
                    </label>
                    <input
                        id="last-name"
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                        placeholder="Doe"
                        className="rounded-lg px-4 py-2.5 text-sm outline-none transition-colors"
                        style={inputStyle}
                        onFocus={(e) => (e.currentTarget.style.borderColor = "var(--acc-clr)")}
                        onBlur={(e) => (e.currentTarget.style.borderColor = "#d1d5db")}
                    />
                </div>
            </div>

            <div className="flex flex-col gap-1.5">
                <label htmlFor="signup-email" className="text-sm font-medium" style={{ fontFamily: "var(--sec-ff)", color: "var(--pry-clr)" }}>
                    Email
                </label>
                <input
                    id="signup-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@company.com"
                    className="rounded-lg px-4 py-2.5 text-sm outline-none transition-colors"
                    style={inputStyle}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "var(--acc-clr)")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "#d1d5db")}
                />
            </div>

            <div className="flex gap-3">
                <div className="flex flex-col gap-1.5 flex-1">
                    <label htmlFor="signup-password" className="text-sm font-medium" style={{ fontFamily: "var(--sec-ff)", color: "var(--pry-clr)" }}>
                        Enter Password
                    </label>
                    <div className="relative">
                        <input
                            id="signup-password"
                            type={showPw ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="At least 8 characters"
                            className="w-full rounded-lg px-4 py-2.5 text-sm outline-none transition-colors pr-10"
                            style={{ ...inputStyle, color: "var(--prof-clr)" }}
                            onFocus={(e) => (e.currentTarget.style.borderColor = "var(--acc-clr)")}
                            onBlur={(e) => (e.currentTarget.style.borderColor = "#d1d5db")}
                        />
                        <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-80 transition-opacity" style={{ color: "var(--pry-clr)" }}>
                            {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                </div>
                <div className="flex flex-col gap-1.5 flex-1">
                    <label htmlFor="confirm-password" className="text-sm font-medium" style={{ fontFamily: "var(--sec-ff)", color: "var(--pry-clr)" }}>
                        Confirm Password
                    </label>
                    <div className="relative">
                        <input
                            id="confirm-password"
                            type={showConfirmPw ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            placeholder="At least 8 characters"
                            className="w-full rounded-lg px-4 py-2.5 text-sm outline-none transition-colors pr-10"
                            style={{ ...inputStyle, color: "var(--prof-clr)" }}
                            onFocus={(e) => (e.currentTarget.style.borderColor = "var(--acc-clr)")}
                            onBlur={(e) => (e.currentTarget.style.borderColor = "#d1d5db")}
                        />
                        <button type="button" onClick={() => setShowConfirmPw(!showConfirmPw)} className="absolute right-3 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-80 transition-opacity" style={{ color: "var(--pry-clr)" }}>
                            {showConfirmPw ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                </div>
            </div>

            {error && <p className="text-sm text-red-500" style={{ fontFamily: "var(--sec-ff)" }}>{error}</p>}

            <button
                type="submit"
                disabled={loading}
                className="mt-1 rounded-lg py-2.5 text-sm font-semibold transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer"
                style={{ fontFamily: "var(--pry-ff)", backgroundColor: "var(--acc-clr)", color: "var(--pry-clr)" }}
            >
                {loading ? <Spinner /> : "Sign Up"}
            </button>

            <p className="text-center text-sm mt-1" style={{ fontFamily: "var(--sec-ff)", color: "var(--sec-clr)" }}>
                Already have an account?{" "}
                <button type="button" onClick={onSwitchToLogin} className="font-semibold cursor-pointer" style={{ color: "var(--bg-clr)" }}>
                    Login here
                </button>
            </p>
        </form>
    );
}