"use client";

import { Headphones, Phone, Mail, Clock, User, PhoneCall, MessageCircle } from "lucide-react";

export default function SupportPage() {
    const supportPhone = "08128488623";
    const formattedPhone = supportPhone.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3');
    
    const secondSupportPhone = "0915 077 8422";
    const rawSecondPhone = "09150778422";
    const formattedSecondPhone = secondSupportPhone;

    // Format phone number for WhatsApp (remove leading 0 and add country code)
    const whatsappNumber = "2348128488623"; // Nigeria country code +234 without the plus
    
    const handleCall = () => {
        window.location.href = `tel:${supportPhone}`;
    };

    const handleSecondCall = () => {
        window.location.href = `tel:${rawSecondPhone}`;
    };

    const handleWhatsApp = () => {
        // Open WhatsApp chat directly with the number
        window.open(`https://wa.me/${whatsappNumber}`, '_blank');
    };

    return (
        <main className="min-h-screen bg-[var(--txt-clr)] px-4 sm:px-6 py-6 sm:py-10 w-full pry-ff mb-20">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8 sm:mb-10">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[var(--acc-clr)]/15 flex items-center justify-center">
                            <Headphones size={18} className="sm:text-[20px] text-[var(--acc-clr)]" />
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--acc-clr)] pry-ff tracking-tight">
                            Customer Support
                        </h1>
                    </div>
                    <p className="text-sm sm:text-base text-[var(--dark-bg)]/60 sec-ff">
                        We&apos;re here to help you 24/7. Reach out to us anytime.
                    </p>
                </div>

                {/* Support Agent Profile Card */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 sm:p-6 border border-blue-100 mb-6">
                    <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-[var(--acc-clr)] to-green-600 flex items-center justify-center shadow-lg">
                            <User size={24} className="sm:text-[32px] text-[var(--txt-clr)]" />
                        </div>
                        <div>
                            <h3 className="text-lg sm:text-xl font-bold text-gray-800">Swiftly Support Team</h3>
                            <p className="text-xs sm:text-sm text-gray-600">Customer Care Representative</p>
                        </div>
                    </div>

                    <div className="space-y-3 sm:space-y-4">
                        <div className="flex items-center gap-3 p-3 bg-[var(--txt-clr)] rounded-xl">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                                <Phone size={16} className="sm:text-[18px] text-green-600" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-xs text-gray-500">Phone Number (Primary)</p>
                                <a 
                                    href={`tel:${supportPhone}`}
                                    className="text-base sm:text-lg font-semibold text-gray-800 hover:text-[var(--acc-clr)] transition-colors break-words"
                                >
                                    {formattedPhone}
                                </a>
                                <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                                    <MessageCircle size={10} />
                                    Also available on WhatsApp
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-[var(--txt-clr)] rounded-xl">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                                <Phone size={16} className="sm:text-[18px] text-green-600" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-xs text-gray-500">Phone Number (Secondary)</p>
                                <a 
                                    href={`tel:${rawSecondPhone}`}
                                    className="text-base sm:text-lg font-semibold text-gray-800 hover:text-[var(--acc-clr)] transition-colors break-words"
                                >
                                    {formattedSecondPhone}
                                </a>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-[var(--txt-clr)] rounded-xl">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                                <MessageCircle size={16} className="sm:text-[18px] text-green-600" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-xs text-gray-500">WhatsApp</p>
                                <button 
                                    onClick={handleWhatsApp}
                                    className="text-sm sm:text-base font-medium text-gray-800 hover:text-[var(--acc-clr)] transition-colors text-left cursor-pointer"
                                >
                                    Chat with us on WhatsApp
                                </button>
                                <p className="text-xs text-gray-400 mt-1">Click to chat directly on {formattedPhone}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-[var(--txt-clr)] rounded-xl">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                                <Mail size={16} className="sm:text-[18px] text-blue-600" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-xs text-gray-500">Email</p>
                                <a 
                                    href="mailto:hello@orderswiftly.com"
                                    className="text-sm sm:text-base font-medium text-gray-800 hover:text-[var(--acc-clr)] transition-colors break-words"
                                >
                                    hello@orderswiftly.com
                                </a>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-[var(--txt-clr)] rounded-xl">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                                <Clock size={16} className="sm:text-[18px] text-purple-600" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-xs text-gray-500">Response Time</p>
                                <p className="text-sm sm:text-base font-medium text-gray-800">
                                    Within 24 hours
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions - Fully Responsive Grid */}
                    <div className="mt-6 pt-4 border-t border-blue-200">
                        {/* Stack on mobile, grid on tablet and up */}
                        <div className="flex flex-col sm:grid sm:grid-cols-2 gap-3">
                            <button
                                onClick={handleCall}
                                className="py-3 px-4 bg-[var(--acc-clr)] hover:bg-[#7ab825] text-[var(--txt-clr)] rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer w-full"
                            >
                                <Phone size={18} />
                                <span className="text-sm sm:text-base">Call Primary</span>
                            </button>
                            
                            <button
                                onClick={handleSecondCall}
                                className="py-3 px-4 bg-gray-700 hover:bg-gray-800 text-white rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer w-full"
                            >
                                <Phone size={18} />
                                <span className="text-sm sm:text-base">Call Secondary</span>
                            </button>
                            
                            <button
                                onClick={handleWhatsApp}
                                className="py-3 px-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer sm:col-span-2 w-full"
                            >
                                <MessageCircle size={18} />
                                <span className="text-sm sm:text-base">Message us on WhatsApp</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Business Hours */}
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                        <Clock size={16} className="text-[var(--acc-clr)]" />
                        Business Hours
                    </h4>
                    <div className="space-y-1 text-sm text-gray-600">
                        <p className="text-xs sm:text-sm">Monday - Friday: 8:00 AM - 8:00 PM</p>
                        <p className="text-xs sm:text-sm">Saturday: 9:00 AM - 6:00 PM</p>
                        <p className="text-xs sm:text-sm">Sunday: 1:00 PM - 6:00 PM</p>
                        <p className="text-xs text-gray-400 mt-2">24/7 emergency support available via phone</p>
                    </div>
                </div>

                {/* Note */}
                <div className="mt-6 p-3 bg-amber-50 rounded-lg border border-amber-100 flex gap-2 items-start">
                    <PhoneCall size={14} className="sm:text-[16px] text-amber-700 shrink-0 mt-0.5" />
                    <p className="text-xs sm:text-sm text-amber-700">
                        For urgent matters, please call our support line for immediate assistance.
                        Our team is ready to help you resolve issues quickly.
                    </p>
                </div>
            </div>
        </main>
    );
}