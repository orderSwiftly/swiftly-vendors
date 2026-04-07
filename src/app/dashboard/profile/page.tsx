// app/dashboard/profile/page.tsx
import type { Metadata } from "next";
import ProfileComp from "@/components/profile/profile-component";

export const metadata: Metadata = {
    title: "Profile",
};

export default function ProfilePage() {
    return <ProfileComp />;
}