'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function SidebarNav() {
    return (
        <header className="flex items-center justify-between bg-[var(--txt-clr)] px-4 md:px-12 pt-4">

            {/* LEFT — Institution logo */}
            <div className="flex items-center gap-2 cursor-pointer" title="Change campus">
                <div className="w-8 h-8 rounded-full overflow-hidden">
                    <Image
                        src="/brand-logo.png"
                        alt="Institution logo"
                        width={32}
                        height={32}
                        className="w-full h-full object-cover"
                        priority
                    />
                </div>
            </div>

            {/* RIGHT — User avatar */}
            <div className="flex items-center gap-3">
                <Link href="/dashboard/profile">
                    <div className="w-8 h-8 rounded-full overflow-hidden">
                        <Image
                            src="https://i.pravatar.cc/150?img=12"
                            alt="User avatar"
                            width={32}
                            height={32}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </Link>
            </div>

        </header>
    );
}