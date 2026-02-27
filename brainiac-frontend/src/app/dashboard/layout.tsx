'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, Trophy, User, LogOut, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/hooks/use-auth';
import { useCurrentUser } from '@/lib/store/auth-store';
import { cn } from '@/lib/utils/cn';

/**
 * Navigation items for the dashboard
 */
const navItems = [
    { href: '/dashboard/home', icon: Home, label: 'Home' },
    { href: '/dashboard/quizzes', icon: BookOpen, label: 'Quizzes' },
    { href: '/dashboard/leaderboard', icon: Trophy, label: 'Leaderboard' },
    { href: '/dashboard/profile', icon: User, label: 'Profile' },
];

/**
 * Dashboard Layout Component
 * Provides sidebar navigation and user menu for all dashboard pages
 */
export default function DashboardLayout({
    children,
    }: {
    children: React.ReactNode;
    }) {
    const pathname = usePathname();
    const { logout, isLoggingOut } = useAuth();
    const user = useCurrentUser();
    const [sidebarOpen, setSidebarOpen] = React.useState(false);

    return (
        <div className="min-h-screen bg-gray-50">
        {/* Mobile Header */}
        <div className="lg:hidden fixed top-0 left-0 right-0 z-50 glass border-b border-white/40 px-4 py-3">
            <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-600 flex items-center justify-center shadow-glow">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">Brainiac</span>
            </div>
            <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
                {sidebarOpen ? (
                <X className="w-6 h-6 text-gray-600" />
                ) : (
                <Menu className="w-6 h-6 text-gray-600" />
                )}
            </button>
            </div>
        </div>

        {/* Sidebar */}
        <aside
            className={cn(
            'fixed top-0 left-0 z-40 h-screen w-64 glass border-r border-white/40 transition-transform duration-300',
            'lg:translate-x-0',
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            )}
        >
            <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="hidden lg:flex items-center space-x-3 p-6 border-b border-white/20">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-600 flex items-center justify-center shadow-glow">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">Brainiac</span>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 mt-16 lg:mt-0">
                <ul className="space-y-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                    <li key={item.href}>
                        <Link
                        href={item.href}
                        onClick={() => setSidebarOpen(false)}
                        className={cn(
                            'flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200',
                            isActive
                            ? 'glass-primary text-primary-700 font-semibold shadow-glow'
                            : 'text-gray-700 hover:bg-white/50 hover:backdrop-blur-xl'
                        )}
                        >
                        <Icon className="w-5 h-5" />
                        <span>{item.label}</span>
                        </Link>
                    </li>
                    );
                })}
                </ul>
            </nav>

            {/* User Profile Section */}
            <div className="p-4 border-t border-gray-200">
                <Image
                    src={user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'}
                    alt={user?.displayName || 'User'}
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full border-2 border-primary-200"
                    unoptimized
                />
            
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                    {user?.displayName || 'User'}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                    @{user?.username || 'username'}
                    </p>
                </div>
                </div>
                <Button
                variant="ghost"
                fullWidth
                onClick={logout}
                isLoading={isLoggingOut}
                leftIcon={<LogOut className="w-4 h-4" />}
                className="justify-start text-red-600 hover:bg-red-50 hover:text-red-700"
                >
                Logout
                </Button>
            </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
            <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
            />
        )}

        {/* Main Content */}
        <main className="lg:pl-64 pt-16 lg:pt-0">
            <div className="p-4 lg:p-8">{children}</div>
        </main>
        </div>
    );
}