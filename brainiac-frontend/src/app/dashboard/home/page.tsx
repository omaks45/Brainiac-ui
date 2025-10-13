'use client';

import React from 'react';
import Link from 'next/link';
import { Brain, Zap, Users, TrendingUp, Plus, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCurrentUser } from '@/lib/store/auth-store';

/**
 * Quick Stats Component
 */
const QuickStats = () => {
    const stats = [
        { label: 'Quizzes Taken', value: '0', icon: Brain, color: 'text-primary-600', bg: 'bg-primary-50' },
        { label: 'Total Score', value: '0', icon: TrendingUp, color: 'text-success-600', bg: 'bg-success-50' },
        { label: 'Challenges Won', value: '0', icon: Zap, color: 'text-accent-600', bg: 'bg-accent-50' },
        { label: 'Current Rank', value: '-', icon: Users, color: 'text-secondary-600', bg: 'bg-secondary-50' },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
            <Card
                key={stat.label}
                variant="elevated"
                className="glass border-white/40 animate-slide-up hover:shadow-glow transition-all duration-300 hover:-translate-y-1"
                style={{ animationDelay: `${index * 100}ms` }}
            >
                <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div>
                    <p className="text-sm text-gray-600 mb-1 font-medium">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                    <div className={cn('p-3 rounded-xl', stat.bg, stat.color)}>
                    <Icon className="w-6 h-6" />
                    </div>
                </div>
                </CardContent>
            </Card>
            );
        })}
        </div>
    );
};

/**
 * Quiz Categories Component
 */
const QuizCategories = () => {
    const categories = [
        { name: 'Data Science', color: 'from-blue-500 to-cyan-500', count: 0 },
        { name: 'Mathematics', color: 'from-amber-500 to-orange-500', count: 0 },
        { name: 'Product Design', color: 'from-green-500 to-emerald-500', count: 0 },
        { name: 'Software Engineering', color: 'from-purple-500 to-pink-500', count: 0 },
        { name: 'Arts and Humanities', color: 'from-red-500 to-rose-500', count: 0 },
        { name: 'Economics', color: 'from-indigo-500 to-blue-500', count: 0 },
        { name: 'Social Science', color: 'from-teal-500 to-cyan-500', count: 0 },
        { name: 'Data Analytics', color: 'from-violet-500 to-purple-500', count: 0 },
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map((category, index) => (
            <Link
            key={category.name}
            href={`/dashboard/quizzes?category=${category.name.toLowerCase()}`}
            className="group"
            >
            <Card
                variant="bordered"
                className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer animate-scale-in"
                style={{ animationDelay: `${index * 50}ms` }}
            >
                <CardContent className="p-6 text-center">
                <div className={cn(
                    'w-16 h-16 mx-auto mb-3 rounded-xl flex items-center justify-center',
                    'bg-gradient-to-br shadow-lg',
                    'group-hover:scale-110 transition-transform duration-300',
                    category.color
                )}>
                    <Brain className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>
                <p className="text-xs text-gray-500">{category.count} quizzes</p>
                </CardContent>
            </Card>
            </Link>
        ))}
        </div>
    );
};

/**
 * Recent Activity Component (Placeholder)
 */
const RecentActivity = () => {
    return (
        <Card variant="elevated">
        <CardHeader>
            <CardTitle className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-primary-600" />
            <span>Recent Activity</span>
            </CardTitle>
            <CardDescription>Your latest quiz attempts and achievements</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="text-center py-12">
            <Brain className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">No activity yet</p>
            <p className="text-sm text-gray-400">
                Start taking quizzes to see your activity here
            </p>
            </div>
        </CardContent>
        </Card>
    );
};

/**
 * Dashboard Home Page Component
 */
export default function DashboardHomePage() {
    const user = useCurrentUser();

    return (
        <div className="max-w-7xl mx-auto">
        {/* Welcome Header */}
        <div className="mb-8 animate-fade-in">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.displayName?.split(' ')[0] || 'there'}!
            </h1>
            <p className="text-gray-600">
            Ready to challenge your mind? Let&#39;s get started with a quiz.
            </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 animate-slide-up">
            <Button
            size="lg"
            leftIcon={<Plus className="w-5 h-5" />}
            className="shadow-lg hover:shadow-glow"
            >
            Create AI Quiz
            </Button>
            <Button
            variant="outline"
            size="lg"
            leftIcon={<Users className="w-5 h-5" />}
            >
            Challenge Friends
            </Button>
        </div>

        {/* Quick Stats */}
        <QuickStats />

        {/* Quiz Categories */}
        <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Browse by Category</h2>
            <QuizCategories />
        </div>

        {/* Recent Activity */}
        <RecentActivity />
        </div>
    );
}

function cn(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
}