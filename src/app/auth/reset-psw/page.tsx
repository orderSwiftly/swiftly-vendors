// Server component wrapper — client interactive logic lives in ResetPasswordClient
import React, { Suspense } from "react";
import ResetPasswordClient from "@/components/auth/ResetPasswordClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password",
};

export default function ResetPasswordPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 sec-ff">
      <Suspense fallback={<div className="p-6">Loading...</div>}>
        <ResetPasswordClient />
      </Suspense>
    </main>
  );
}
