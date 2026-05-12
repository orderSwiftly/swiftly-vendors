"use client";

import { Headphones, Phone, Mail, Clock, User, PhoneCall, MessageCircle } from "lucide-react";

export default function SupportPage() {
    const supportPhone = "08128488623";
    const formattedPhone = supportPhone.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3');
    
    const secondSupportPhone = "0915 077 8422";
    const rawSecondPhone = "09150778422";
    const formattedSecondPhone = secondSupportPhone;

    const handleCall = () => {
        window.location.href = `tel:${supportPhone}`;
    };

    const handleSecondCall = () => {
        window.location.href = `tel:${rawSecondPhone}`;
    };

    const handleWhatsApp = () => {
        window.open('https://api.whatsapp.com/qr/3DABWGFZZTCMF1?autoload=1&app_absent=0', '_blank');
    };

    return (
        <main className="min-h-screen bg-[var(--txt-clr)] px-4 py-10 w-full pry-ff mb-20">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-10">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-[var(--acc-clr)]/15 flex items-center justify-center">
                            <Headphones size={20} className="text-[var(--acc-clr)]" />
                        </div>
                        <h1 className="text-3xl font-bold text-[var(--acc-clr)] pry-ff tracking-tight">
                            Customer Support
                        </h1>
                    </div>
                    <p className="text-[var(--dark-bg)]/60 sec-ff">
                        We&apos;re here to help you 24/7. Reach out to us anytime.
                    </p>
                </div>

                {/* Support Agent Profile Card */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100 mb-6">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--acc-clr)] to-green-600 flex items-center justify-center shadow-lg">
                            <User size={32} className="text-[var(--txt-clr)]" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-800">Swiftly Support Team</h3>
                            <p className="text-sm text-gray-600">Customer Care Representative</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-3 p-3 bg-[var(--txt-clr)] rounded-xl">
                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                                <Phone size={18} className="text-green-600" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Phone Number (Primary)</p>
                                <a 
                                    href={`tel:${supportPhone}`}
                                    className="text-lg font-semibold text-gray-800 hover:text-[var(--acc-clr)] transition-colors"
                                >
                                    {formattedPhone}
                                </a>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-[var(--txt-clr)] rounded-xl">
                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                                <Phone size={18} className="text-green-600" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Phone Number (Secondary)</p>
                                <a 
                                    href={`tel:${rawSecondPhone}`}
                                    className="text-lg font-semibold text-gray-800 hover:text-[var(--acc-clr)] transition-colors"
                                >
                                    {formattedSecondPhone}
                                </a>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-[var(--txt-clr)] rounded-xl">
                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                                <MessageCircle size={18} className="text-green-600" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">WhatsApp</p>
                                <button 
                                    onClick={handleWhatsApp}
                                    className="text-sm font-medium text-gray-800 hover:text-[var(--acc-clr)] transition-colors text-left cursor-pointer"
                                >
                                    Chat with us on WhatsApp
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-[var(--txt-clr)] rounded-xl">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                <Mail size={18} className="text-blue-600" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Email</p>
                                <a 
                                    href="mailto:hello@orderswiftly.com"
                                    className="text-sm font-medium text-gray-800 hover:text-[var(--acc-clr)] transition-colors"
                                >
                                    hello@orderswiftly.com
                                </a>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-[var(--txt-clr)] rounded-xl">
                            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                                <Clock size={18} className="text-purple-600" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Response Time</p>
                                <p className="text-sm font-medium text-gray-800">
                                    Within 24 hours
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="mt-6 pt-4 border-t border-blue-200 grid grid-cols-2 gap-3">
                        <button
                            onClick={handleCall}
                            className="py-3 bg-[var(--acc-clr)] hover:bg-[#7ab825] text-[var(--txt-clr)] rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
                        >
                            <Phone size={18} />
                            Call Primary
                        </button>
                        <button
                            onClick={handleSecondCall}
                            className="py-3 bg-gray-700 hover:bg-gray-800 text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
                        >
                            <Phone size={18} />
                            Call Secondary
                        </button>
                        <button
                            onClick={handleWhatsApp}
                            className="py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer col-span-2"
                        >
                            <MessageCircle size={18} />
                            Message us on WhatsApp
                        </button>
                    </div>
                </div>

                {/* Business Hours */}
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                        <Clock size={16} className="text-[var(--acc-clr)]" />
                        Business Hours
                    </h4>
                    <div className="space-y-1 text-sm text-gray-600">
                        <p>Monday - Friday: 8:00 AM - 8:00 PM</p>
                        <p>Saturday: 9:00 AM - 6:00 PM</p>
                        <p>Sunday: 10:00 AM - 4:00 PM</p>
                        <p className="text-xs text-gray-400 mt-2">24/7 emergency support available via phone</p>
                    </div>
                </div>

                {/* Note */}
                <div className="mt-6 p-3 bg-amber-50 rounded-lg border border-amber-100 flex gap-2 items-start">
                    <PhoneCall size={16} className="text-amber-700 shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-700">
                        For urgent matters, please call our support line for immediate assistance.
                        Our team is ready to help you resolve issues quickly.
                    </p>
                </div>
            </div>
        </main>
    );
}