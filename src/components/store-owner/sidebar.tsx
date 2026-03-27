'use client';

// import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Store,
  MapPin,
  Package,
  Boxes,
  ArrowLeftRight,
  Users,
  BarChart3,
  FileText,
  ClipboardList,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import Image from 'next/image';
import { useSidebar } from '@/components/sidebar-context';

const navItems = [
  { label: 'Store',            href: '/dashboard',                  icon: Store,          exact: true },
  { label: 'Store and location', href: '/dashboard/store-location', icon: MapPin },
  { label: 'Products',         href: '/dashboard/products',         icon: Package },
  { label: 'Inventory',        href: '/dashboard/inventory',        icon: Boxes },
  { label: 'Stock transfers',  href: '/dashboard/stock-transfers',  icon: ArrowLeftRight },
  { label: 'Manage staff',     href: '/dashboard/staff',            icon: Users },
  { label: 'Transactions',     href: '/dashboard/transactions',     icon: BarChart3 },
  { label: 'Reports',          href: '/dashboard/reports',          icon: FileText },
  { label: 'Audit Log',        href: '/dashboard/audit-log',        icon: ClipboardList },
];

export default function Sidebar() {
  const { collapsed, setCollapsed } = useSidebar();
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex fixed top-0 left-0 h-screen ${
          collapsed ? 'w-20' : 'w-64'
        } bg-(--txt-clr) text-(--pry-clr) flex-col z-40 transition-all duration-300 border-r border-(--sec-clr)`}
      >
        {/* Logo + Toggle */}
        <div
          className={`flex items-center ${
            collapsed ? 'justify-center px-4' : 'justify-between px-5'
          } py-5 border-b border-(--sec-clr)`}
        >
          {!collapsed && (
            <Link href="/dashboard" className="flex items-center gap-2">
              <Image
                src="/brand-logo.png"
                alt="Swiftly Logo"
                width={36}
                height={36}
                className="w-9 h-9 object-cover rounded-lg"
              />
              <span className="text-lg font-bold text-(--pry-clr)" style={{ fontFamily: 'var(--pry-ff)' }}>
                Swiftly
              </span>
            </Link>
          )}
          {collapsed && (
            <Image
              src="/brand-logo.png"
              alt="Swiftly Logo"
              width={36}
              height={36}
              className="w-9 h-9 object-cover rounded-lg mb-2"
            />
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-8 h-8 rounded-lg bg-(--acc-clr)/10 hover:bg-(--acc-clr)/20 flex items-center justify-center transition-colors text-(--pry-clr)"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          {navItems.map(({ label, href, icon: Icon, exact }) => {
            const isActive = exact ? pathname === href : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center ${
                  collapsed ? 'justify-center px-0' : 'gap-3 px-4'
                } py-3 rounded-xl transition-all duration-200 group relative ${
                  isActive
                    ? 'bg-(--prof-clr) text-(--txt-clr)'
                    : 'text-(--pry-clr) hover:bg-(--acc-clr) hover:text-(--pry-clr)'
                }`}
              >
                <Icon className="w-5 h-5 shrink-0" />
                {!collapsed && (
                  <span className="text-sm font-medium" style={{ fontFamily: 'var(--sec-ff)' }}>
                    {label}
                  </span>
                )}
                {collapsed && (
                  <div className="absolute left-full ml-3 px-2 py-1 bg-(--pry-clr) text-(--txt-clr) text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                    {label}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-(--sec-clr)">
          <button
            className={`flex items-center ${
              collapsed ? 'justify-center px-0' : 'gap-3 px-4'
            } w-full py-2.5 rounded-xl text-(--pry-clr) hover:bg-red-100 hover:text-red-600 transition-all duration-200 cursor-pointer group relative`}
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!collapsed && (
              <span className="text-sm font-medium" style={{ fontFamily: 'var(--sec-ff)' }}>
                Logout
              </span>
            )}
            {collapsed && (
              <div className="absolute left-full ml-3 px-2 py-1 bg-(--pry-clr) text-(--txt-clr) text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                Logout
              </div>
            )}
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-(--txt-clr) border-t border-(--sec-clr)">
        <div className="flex justify-around items-center py-2 px-2">
          {navItems.slice(0, 5).map(({ label, href, icon: Icon, exact }) => {
            const isActive = exact ? pathname === href : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex flex-col items-center gap-1 py-2 px-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'text-(--txt-clr) bg-(--prof-clr)'
                    : 'text-(--pry-clr) hover:bg-(--acc-clr)/40'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium" style={{ fontFamily: 'var(--sec-ff)' }}>
                  {label.split(' ')[0]}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Mobile spacer */}
      <div className="md:hidden h-20" />
    </>
  );
}