// src/app/auth/auth.tsx  ← move all the client logic here
"use client";

import LoginForm from "@/components/login";
import Image from "next/image";

export default function AuthComp() {
    return (
        <section
            className="min-h-screen flex flex-col items-center justify-center px-4 py-10"
            style={{ backgroundColor: "var(--txt-clr)" }}
        >
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

                <LoginForm />
            </div>
        </section>
    );
}