import React, { Suspense } from "react";
import VerifyOtpClient from "@/components/auth/VerifyOtpClient";

export default function VerifyOtpPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 sec-ff">
      <Suspense fallback={<div className="p-6">Loading...</div>}>
        <VerifyOtpClient />
      </Suspense>
    </main>
  );
}
