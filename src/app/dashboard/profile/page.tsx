// src/app/dashboard/profile/page.tsx

"use client";

import { useEffect, useState } from "react";
import { Loader2, Mail, User, Shield, BadgeCheck } from "lucide-react";
import { toast } from "sonner";
import { getProfile, type Profile } from "@/lib/profile";

export default function ProfilePage() {
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
        <main className="p-6 max-w-2xl mx-auto flex flex-col gap-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-(--pry-clr) sec-ff">Profile</h1>
                <p className="text-sm text-(--pry-clr)/50 sec-ff mt-0.5">Your account information.</p>
            </div>

            {/* Avatar + Name Card */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 flex items-center gap-5">
                <div className="w-16 h-16 rounded-full bg-(--acc-clr) flex items-center justify-center shrink-0">
                    <span className="text-2xl font-bold text-(--pry-clr) sec-ff">{userInitial}</span>
                </div>
                <div>
                    <p className="text-lg font-bold text-(--pry-clr) sec-ff">{profile.name}</p>
                    <p className="text-sm text-(--pry-clr)/50 sec-ff mt-0.5">{profile.email}</p>
                    {profile.is_owner && (
                        <span className="inline-flex items-center gap-1 mt-2 text-xs px-2 py-1 rounded-md bg-blue-500/10 text-blue-600 sec-ff font-medium">
                            <BadgeCheck size={11} />
                            Owner
                        </span>
                    )}
                </div>
            </div>

            {/* Details Card */}
            <div className="rounded-2xl border border-gray-200 bg-white divide-y divide-gray-100">
                <ProfileRow
                    icon={<User size={14} className="text-(--pry-clr)/50" />}
                    label="First Name"
                    value={profile.first_name}
                />
                <ProfileRow
                    icon={<User size={14} className="text-(--pry-clr)/50" />}
                    label="Last Name"
                    value={profile.last_name}
                />
                <ProfileRow
                    icon={<Mail size={14} className="text-(--pry-clr)/50" />}
                    label="Email"
                    value={profile.email}
                />
                <ProfileRow
                    icon={<Shield size={14} className="text-(--pry-clr)/50" />}
                    label="Account Type"
                    value={profile.is_owner ? "Owner" : "Staff"}
                />
                <ProfileRow
                    icon={<BadgeCheck size={14} className="text-(--pry-clr)/50" />}
                    label="Permissions"
                    value={profile.permissions.length > 0 ? profile.permissions.join(", ") : "No special permissions"}
                />
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
        <div className="flex items-center justify-between gap-4 px-6 py-4">
            <div className="flex items-center gap-2 shrink-0">
                {icon}
                <span className="text-sm text-(--pry-clr)/60 sec-ff">{label}</span>
            </div>
            <span className="text-sm font-medium text-(--pry-clr) sec-ff text-right">{value}</span>
        </div>
    );
}