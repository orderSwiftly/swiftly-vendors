// src/components/signup.tsx - Simple regex solution

"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Spinner from "./ui/spinner";
import { signupOwner } from "@/lib/auth";
import { toast } from "sonner";

interface SignupFormProps {
    onSwitchToLogin: () => void;
}

interface FormData {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    password: string;
    confirm_password: string;
}

export default function SignupForm({ onSwitchToLogin }: Readonly<SignupFormProps>) {
    const [formData, setFormData] = useState<FormData>({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        password: "",
        confirm_password: "",
    });
    const [showPw, setShowPw] = useState(false);
    const [showConfirmPw, setShowConfirmPw] = useState(false);
    const [loading, setLoading] = useState(false);

    const inputStyle = {
        fontFamily: "var(--sec-ff)",
        backgroundColor: "var(--txt-clr)",
        color: "var(--pry-clr)",
        border: "1px solid #d1d5db",
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Simple phone formatter for Nigerian numbers
    const formatPhoneNumber = (phone: string): string => {
        // Remove all non-digit characters
        const cleaned = phone.replace(/\D/g, '');
        
        // If it starts with 234, remove it and add 0
        if (cleaned.startsWith('234')) {
            return '0' + cleaned.slice(3);
        }
        
        // If it already starts with 0, keep as is
        if (cleaned.startsWith('0')) {
            return cleaned;
        }
        
        // If it's 10 digits without 0, add 0 at the beginning
        if (cleaned.length === 10) {
            return '0' + cleaned;
        }
        
        // Return as is if no match
        return cleaned;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (formData.password !== formData.confirm_password) {
            toast.error("Passwords do not match.");
            return;
        }
        
        if (formData.password.length < 6) {
            toast.error("Password must be at least 6 characters.");
            return;
        }
        
        // Format the phone number
        const formattedPhone = formatPhoneNumber(formData.phone);
        
        // Validate Nigerian phone number (11 digits including 0 or 10 digits without 0)
        const phoneRegex = /^(0[789][01]\d{8}|[789][01]\d{8})$/;
        if (!phoneRegex.test(formattedPhone)) {
            toast.error("Please enter a valid Nigerian phone number (e.g., 08031234567 or 8031234567)");
            return;
        }
        
        setLoading(true);
        
        try {
            const signupData = {
                first_name: formData.first_name,
                last_name: formData.last_name,
                email: formData.email,
                phone: formattedPhone, // Will be like "07080973923" or "08031234567"
                password: formData.password,
                confirm_password: formData.confirm_password,
            };
            
            // console.log('Sending signup data:', signupData);
            
            await signupOwner(signupData);
            
            toast.success("Account created successfully! Please login.");
            
            // Reset form
            setFormData({
                first_name: "",
                last_name: "",
                email: "",
                phone: "",
                password: "",
                confirm_password: "",
            });
            
            // Switch to login mode
            onSwitchToLogin();
            
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : "Sign up failed.";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* First + Last name fields */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex flex-col gap-1.5 flex-1">
                    <label htmlFor="first_name" className="text-sm font-medium" style={{ fontFamily: "var(--sec-ff)", color: "var(--pry-clr)" }}>
                        First Name
                    </label>
                    <input
                        id="first_name"
                        name="first_name"
                        type="text"
                        value={formData.first_name}
                        onChange={handleChange}
                        required
                        placeholder="John"
                        className="rounded-lg px-4 py-2.5 text-sm outline-none transition-colors w-full"
                        style={inputStyle}
                        onFocus={(e) => (e.currentTarget.style.borderColor = "var(--acc-clr)")}
                        onBlur={(e) => (e.currentTarget.style.borderColor = "#d1d5db")}
                    />
                </div>
                <div className="flex flex-col gap-1.5 flex-1">
                    <label htmlFor="last_name" className="text-sm font-medium" style={{ fontFamily: "var(--sec-ff)", color: "var(--pry-clr)" }}>
                        Last Name
                    </label>
                    <input
                        id="last_name"
                        name="last_name"
                        type="text"
                        value={formData.last_name}
                        onChange={handleChange}
                        required
                        placeholder="Doe"
                        className="rounded-lg px-4 py-2.5 text-sm outline-none transition-colors w-full"
                        style={inputStyle}
                        onFocus={(e) => (e.currentTarget.style.borderColor = "var(--acc-clr)")}
                        onBlur={(e) => (e.currentTarget.style.borderColor = "#d1d5db")}
                    />
                </div>
            </div>

            {/* Email field */}
            <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="text-sm font-medium" style={{ fontFamily: "var(--sec-ff)", color: "var(--pry-clr)" }}>
                    Email
                </label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="you@company.com"
                    className="rounded-lg px-4 py-2.5 text-sm outline-none transition-colors w-full"
                    style={inputStyle}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "var(--acc-clr)")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "#d1d5db")}
                />
            </div>

            {/* Phone Number field */}
            <div className="flex flex-col gap-1.5">
                <label htmlFor="phone" className="text-sm font-medium" style={{ fontFamily: "var(--sec-ff)", color: "var(--pry-clr)" }}>
                    Phone Number
                </label>
                <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="08031234567 or 8031234567"
                    className="rounded-lg px-4 py-2.5 text-sm outline-none transition-colors w-full"
                    style={inputStyle}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "var(--acc-clr)")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "#d1d5db")}
                />
            </div>

            {/* Password fields */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex flex-col gap-1.5 flex-1">
                    <label htmlFor="password" className="text-sm font-medium" style={{ fontFamily: "var(--sec-ff)", color: "var(--pry-clr)" }}>
                        Enter Password
                    </label>
                    <div className="relative">
                        <input
                            id="password"
                            name="password"
                            type={showPw ? "text" : "password"}
                            value={formData.password}
                            onChange={handleChange}
                            required
                            placeholder="At least 6 characters"
                            className="w-full rounded-lg px-4 py-2.5 text-sm outline-none transition-colors pr-10"
                            style={inputStyle}
                            onFocus={(e) => (e.currentTarget.style.borderColor = "var(--acc-clr)")}
                            onBlur={(e) => (e.currentTarget.style.borderColor = "#d1d5db")}
                        />
                        <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-80 transition-opacity" style={{ color: "var(--pry-clr)" }}>
                            {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                </div>
                <div className="flex flex-col gap-1.5 flex-1">
                    <label htmlFor="confirm_password" className="text-sm font-medium" style={{ fontFamily: "var(--sec-ff)", color: "var(--pry-clr)" }}>
                        Confirm Password
                    </label>
                    <div className="relative">
                        <input
                            id="confirm_password"
                            name="confirm_password"
                            type={showConfirmPw ? "text" : "password"}
                            value={formData.confirm_password}
                            onChange={handleChange}
                            required
                            placeholder="At least 6 characters"
                            className="w-full rounded-lg px-4 py-2.5 text-sm outline-none transition-colors pr-10"
                            style={inputStyle}
                            onFocus={(e) => (e.currentTarget.style.borderColor = "var(--acc-clr)")}
                            onBlur={(e) => (e.currentTarget.style.borderColor = "#d1d5db")}
                        />
                        <button type="button" onClick={() => setShowConfirmPw(!showConfirmPw)} className="absolute right-3 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-80 transition-opacity" style={{ color: "var(--pry-clr)" }}>
                            {showConfirmPw ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="mt-1 rounded-lg py-2.5 text-sm font-semibold transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer w-full"
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