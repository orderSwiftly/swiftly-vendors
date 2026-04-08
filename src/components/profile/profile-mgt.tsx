// src/components/profile/profile-management.tsx

import Link from 'next/link';
import { MapPin, Users, Shield } from 'lucide-react';

const managementItems = [
    { label: 'Store & Location', href: '/dashboard/store-location', icon: MapPin },
    { label: 'Manage Staff',     href: '/dashboard/staff',          icon: Users      },
    { label: 'Roles & Permissions', href: '/dashboard/roles',          icon: Shield     },
];

export default function ProfileManagement() {
    return (
        <section className="w-full px-4 py-4">
            <p className="text-sm font-semibold text-(--pry-clr) capitalize mb-3 px-1 pry-ff">
                Management
            </p>
            <div className="rounded-2xl border border-gray-200 bg-(--txt-clr) overflow-hidden sec-ff">
                {managementItems.map(({ label, href, icon: Icon }, index) => (
                    <Link
                        key={href}
                        href={href}
                        className={`flex items-center gap-4 px-4 py-4 hover:bg-gray-50 transition-colors ${
                            index !== managementItems.length - 1 ? 'border-b border-gray-100' : ''
                        }`}
                    >
                        <div className="w-10 h-10 rounded-xl bg-(--tet-clr) flex items-center justify-center shrink-0">
                            <Icon size={18} className="text-(--txt-clr)" />
                        </div>
                        <span className="flex-1 text-sm font-medium text-gray-800">{label}</span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                            <path d="M9 18l6-6-6-6" />
                        </svg>
                    </Link>
                ))}
            </div>
        </section>
    );
}