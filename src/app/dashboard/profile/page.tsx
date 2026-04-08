// app/dashboard/profile/page.tsx
import type { Metadata } from "next";
import ProfileCard from "@/components/profile/profile-card";

export const metadata: Metadata = {
    title: "Profile",
};

export default function ProfilePage() {
    return <ProfileCard />;
}