// app/auth/forgot-psw/page.tsx — NO "use client" here
import type { Metadata } from "next";
import ForgotPassword from "@/components/auth/forgot-psw"; // your client component

export const metadata: Metadata = {
    title: "Forgot Password",
};

export default function ForgotPasswordPage() {
    return <ForgotPassword />;
}