"use client";

import { Headphones, MessageSquareWarning } from "lucide-react";
import ComplaintForm from "@/components/complaint-modal";


export default function SupportPage() {
    return (
        <main className="min-h-screen bg-(--txt-clr) px-4 py-10 shadow-md rounded-2xl w-full">
            <div className="max-w-2xl mx-auto mb-10">

                {/* Header */}
                <div className="mb-10">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-(--acc-clr)/15 flex items-center justify-center">
                            <Headphones size={20} className="text-(--acc-clr)" />
                        </div>
                        <h1 className="text-3xl font-bold text-(--acc-clr) pry-ff tracking-tight">
                            Support
                        </h1>
                    </div>
                    <p className="text-(--dark-bg)/60 sec-ff">
                        Having trouble? We&apos;re here to help. File a complaint and we&apos;ll get back to you fast.
                    </p>
                </div>

                {/* Divider with label */}
                <div className="flex items-center gap-3 mb-6">
                    <MessageSquareWarning size={16} className="text-(--acc-clr) shrink-0" />
                    <h2 className="text-base font-semibold text-(--dark-bg) pry-ff">File a Complaint</h2>
                    <div className="flex-1 h-px bg-(--txt-clr)/10" />
                </div>

                {/* Form */}
                <div id="complaint-form">
                    <ComplaintForm />
                </div>
            </div>
        </main>
    );
}