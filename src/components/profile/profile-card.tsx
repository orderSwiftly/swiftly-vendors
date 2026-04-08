// src/components/profile/profile-card.tsx

import ProfileAction from "./profile-actions";
import ProfileInsights from "./profile-insights";
import ProfileManagement from "./profile-mgt";

export default function ProfileCard() {
    return (
        <main className="flex items-center justify-center flex-col gap-2 mb-20">
            <ProfileAction />
            <ProfileManagement />
            <ProfileInsights />
        </main>
    )
}