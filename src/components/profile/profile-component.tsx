// src/app/dashboard/profile/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Loader2, Mail, User, Shield, BadgeCheck, Building2, CalendarDays } from "lucide-react";
import { toast } from "sonner";
import { getProfile, type Profile } from "@/lib/profile";
import Link from "next/link";

export default function ProfileComponent() {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getProfile()
            .then(setProfile)
            .catch((err) => toast.error(err instanceof Error ? err.message : "Failed to load profile."))
            .finally(() => setLoading(false));
    }, []);

    const userInitial =
        profile?.name?.charAt(0)?.toUpperCase() ||
        profile?.email?.charAt(0)?.toUpperCase() ||
        "U";

    if (loading) {
        return (
            <main className="flex items-center justify-center min-h-[60vh]">
                <Loader2 size={24} className="animate-spin text-(--pry-clr)" />
            </main>
        );
    }

    if (!profile) {
        return (
            <main className="flex items-center justify-center min-h-[60vh]">
                <p className="text-sm text-(--pry-clr)/50 sec-ff">Could not load profile.</p>
            </main>
        );
    }

    return (
        <main className="w-full px-6 py-8 md:px-10 lg:px-12 mb-20">
            <div className="max-w-7xl mx-auto flex flex-col gap-8">
                {/* Header with gradient accent */}
                <div className="relative">
                    <div className="absolute -top-6 left-0 w-24 h-1 bg-linear-to-r from-(--pry-clr) to-(--acc-clr) rounded-full" />
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-(--pry-clr) sec-ff tracking-tight">Profile</h1>
                        <p className="text-sm text-(--pry-clr)/50 sec-ff mt-1">Manage your account information and preferences</p>
                    </div>
                </div>

                {/* Two-column layout for better space usage */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Avatar & Basic Info */}
                    <div className="lg:col-span-1">
                        <div className="rounded-2xl border border-gray-200 bg-white p-6 sticky top-8">
                            <div className="flex flex-col items-center text-center">
                                <div className="w-28 h-28 rounded-full bg-linear-to-br from-(--acc-clr) to-(--acc-clr)/60 flex items-center justify-center shadow-lg mb-4">
                                    <span className="text-4xl font-bold text-(--pry-clr) sec-ff">{userInitial}</span>
                                </div>
                                <h2 className="text-xl font-bold text-(--pry-clr) sec-ff">{profile.name}</h2>
                                <p className="text-sm text-(--pry-clr)/50 sec-ff mt-1">{profile.email}</p>
                                {profile.is_owner && (
                                    <span className="inline-flex items-center gap-1.5 mt-3 text-xs px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-600 sec-ff font-medium">
                                        <BadgeCheck size={12} />
                                        Owner
                                    </span>
                                )}
                                <div className="w-full mt-6 pt-6 border-t border-gray-100">
                                    <div className="flex items-center justify-center gap-2 text-xs text-(--pry-clr)/40 sec-ff">
                                        <CalendarDays size={12} />
                                        <span>Member since {new Date().getFullYear()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Details */}
                    <div className="lg:col-span-2">
                        <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
                            <div className="px-6 py-4 bg-linear-to-r from-gray-50/50 to-white border-b border-gray-100">
                                <h3 className="text-sm font-semibold text-(--pry-clr)/70 sec-ff uppercase tracking-wider">
                                    Account Details
                                </h3>
                            </div>
                            <div className="divide-y divide-gray-100">
                                <ProfileRow
                                    icon={<User size={16} className="text-(--pry-clr)/40" />}
                                    label="First Name"
                                    value={profile.first_name}
                                />
                                <ProfileRow
                                    icon={<User size={16} className="text-(--pry-clr)/40" />}
                                    label="Last Name"
                                    value={profile.last_name}
                                />
                                <ProfileRow
                                    icon={<Mail size={16} className="text-(--pry-clr)/40" />}
                                    label="Email Address"
                                    value={profile.email}
                                />
                                <ProfileRow
                                    icon={<Shield size={16} className="text-(--pry-clr)/40" />}
                                    label="Account Type"
                                    value={profile.is_owner ? "Owner" : "Staff"}
                                />
                                <ProfileRow
                                    icon={<BadgeCheck size={16} className="text-(--pry-clr)/40" />}
                                    label="Permissions"
                                    value={profile.permissions.length > 0 ? profile.permissions.join(", ") : "No special permissions"}
                                />
                            </div>
                        </div>

                        {/* Optional: Add an action card */}
                        <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6">
                            <div className="flex items-center justify-between flex-wrap gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-xl bg-gray-50">
                                        <Building2 size={18} className="text-(--pry-clr)/60" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-(--pry-clr) sec-ff">Need help?</p>
                                        <p className="text-xs text-(--pry-clr)/40 sec-ff">Contact support for account assistance</p>
                                    </div>
                                </div>
                                <Link href="/dashboard/profile/support" className="px-4 py-2 text-sm font-medium text-(--pry-clr) border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors sec-ff">
                                    Contact Support
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

function ProfileRow({
    icon,
    label,
    value,
}: Readonly<{
    icon: React.ReactNode;
    label: string;
    value: string;
}>) {
    return (
        <div className="flex items-center justify-between gap-4 px-6 py-4 hover:bg-gray-50/50 transition-colors">
            <div className="flex items-center gap-3 shrink-0">
                {icon}
                <span className="text-sm text-(--pry-clr)/60 sec-ff font-medium">{label}</span>
            </div>
            <span className="text-sm font-medium text-(--pry-clr) sec-ff text-right break-all">{value}</span>
        </div>
    );
}