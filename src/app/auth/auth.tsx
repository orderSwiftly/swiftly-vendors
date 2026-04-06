// src/app/auth/auth.tsx  ← move all the client logic here
"use client";

import LoginForm from "@/components/login";
import SignupForm from "@/components/signup";
import { useState } from "react";
import Image from "next/image";

type AuthMode = "login" | "signup";

export default function AuthComp() {
    const [mode, setMode] = useState<AuthMode>("login");

    return (
        <section
            className="min-h-screen flex flex-col items-center justify-center px-4 py-10"
            style={{ backgroundColor: "var(--txt-clr)" }}
        >
            {/* Toggle pill */}
            <div
                className="flex items-center rounded-full p-1 mb-8 shadow-md"
                style={{ backgroundColor: "var(--txt-clr)", border: "1px solid #e0e0e0" }}
            >
                {(["login", "signup"] as AuthMode[]).map((m) => (
                    <button
                        key={m}
                        onClick={() => setMode(m)}
                        className="px-6 py-2 rounded-full text-sm font-semibold transition-all duration-200 capitalize"
                        style={{
                            fontFamily: "var(--pry-ff)",
                            backgroundColor: mode === m ? "var(--acc-clr)" : "transparent",
                            color: "var(--pry-clr)",
                        }}
                    >
                        {m === "login" ? "Login" : "Sign Up"}
                    </button>
                ))}
            </div>

            {/* Card */}
            <div
                className="w-full max-w-md rounded-2xl p-8 shadow-lg"
                style={{ backgroundColor: "var(--txt-clr)", border: "1px solid #e0e0e0" }}
            >
                <div className="flex flex-col items-center mb-6">
                    <Image
                        src="/brand-logo.png"
                        alt="Swiftly IMS"
                        width={54}
                        height={54}
                        loading="eager"
                        className="object-contain"
                        style={{ width: 'auto' }}
                    />
                    <p className="text-base font-semibold mt-1" style={{ fontFamily: "var(--pry-ff)", color: "var(--pry-clr)" }}>
                        Swiftly IMS
                    </p>
                </div>

                {mode === "login"
                    ? <LoginForm onSwitchToSignup={() => setMode("signup")} />
                    : <SignupForm onSwitchToLogin={() => setMode("login")} />
                }
            </div>
        </section>
    );
}