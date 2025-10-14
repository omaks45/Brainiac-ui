'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Brain, ArrowLeft, Lock, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useIsAuthenticated } from '@/lib/store/auth-store';

/**
 * Quiz Categories for Guest Users
 */
const categories = [
    { name: 'Data Science', gradient: 'from-blue-500 via-blue-600 to-cyan-600', difficulty: 'Medium' },
    { name: 'Mathematics', gradient: 'from-amber-500 via-orange-500 to-red-500', difficulty: 'Hard' },
    { name: 'Product Design', gradient: 'from-green-500 via-emerald-500 to-teal-500', difficulty: 'Easy' },
    { name: 'Software Engineering', gradient: 'from-purple-500 via-violet-500 to-indigo-500', difficulty: 'Medium' },
    { name: 'Arts and Humanities', gradient: 'from-pink-500 via-rose-500 to-red-500', difficulty: 'Easy' },
    { name: 'Economics', gradient: 'from-indigo-500 via-blue-500 to-cyan-500', difficulty: 'Medium' },
    { name: 'Social Science', gradient: 'from-teal-500 via-cyan-500 to-blue-500', difficulty: 'Easy' },
    { name: 'Data Analytics', gradient: 'from-violet-500 via-purple-500 to-pink-500', difficulty: 'Medium' },
];

/**
 * Quiz Browse Page Component
 * Allows guests to take quizzes without signing in
 */
export default function QuizBrowsePage() {
    const router = useRouter();
    const isAuthenticated = useIsAuthenticated();

    const handleCategoryClick = (categoryName: string) => {
        // For now, redirect to quiz creation
        // In Phase 2, this will load actual quizzes
        router.push(`/quiz/take?category=${categoryName.toLowerCase()}`);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
        {/* Header */}
        <nav className="glass border-b border-white/40 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
                <Link href="/" className="flex items-center space-x-3">
                <Button variant="ghost" leftIcon={<ArrowLeft className="w-5 h-5" />}>
                    Back
                </Button>
                </Link>
                <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-600 flex items-center justify-center shadow-glow">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                    Brainiac
                </span>
                </div>
                {!isAuthenticated && (
                <Link href="/auth/signup">
                    <Button variant="primary" size="sm">Sign Up</Button>
                </Link>
                )}
            </div>
            </div>
        </nav>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Hero Section */}
            <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 bg-clip-text text-transparent">
                Choose Your Category
                </span>
            </h1>
            <p className="text-xl text-gray-600 mb-6">
                Select a topic and test your knowledge
            </p>
            
            {!isAuthenticated && (
                <div className="inline-flex items-center space-x-2 glass border border-white/40 rounded-xl px-6 py-3">
                <Sparkles className="w-5 h-5 text-primary-600" />
                <p className="text-sm text-gray-700">
                    <strong>Guest Mode:</strong> Your progress won&apos;t be saved.{' '}
                    <Link href="/auth/signup" className="text-primary-600 hover:text-primary-700 font-semibold underline">
                    Sign up
                    </Link>{' '}
                    to track your scores!
                </p>
                </div>
            )}
            </div>

            {/* Categories Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
                <Card
                key={category.name}
                variant="glass"
                className="border-white/40 hover:shadow-glow-lg transition-all duration-300 hover:-translate-y-2 cursor-pointer animate-scale-in group"
                style={{ animationDelay: `${index * 50}ms` }}
                onClick={() => handleCategoryClick(category.name)}
                >
                <CardContent className="p-6 text-center">
                    <div className={`w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center bg-gradient-to-br ${category.gradient} shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{category.name}</h3>
                    <div className="flex items-center justify-center space-x-2">
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                        category.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                        category.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                    }`}>
                        {category.difficulty}
                    </span>
                    </div>
                </CardContent>
                </Card>
            ))}
            </div>

            {/* Features Notice */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card variant="glass" className="border-white/40">
                <CardContent className="p-6 text-center">
                <Brain className="w-12 h-12 text-primary-600 mx-auto mb-3" />
                <h3 className="font-bold text-gray-900 mb-2">Instant Start</h3>
                <p className="text-sm text-gray-600">
                    No account needed to take quizzes
                </p>
                </CardContent>
            </Card>

            <Card variant="glass" className="border-white/40">
                <CardContent className="p-6 text-center">
                <Lock className="w-12 h-12 text-secondary-600 mx-auto mb-3" />
                <h3 className="font-bold text-gray-900 mb-2">Sign Up to Save</h3>
                <p className="text-sm text-gray-600">
                    Create an account to track your progress
                </p>
                </CardContent>
            </Card>

            <Card variant="glass" className="border-white/40">
                <CardContent className="p-6 text-center">
                <Sparkles className="w-12 h-12 text-accent-600 mx-auto mb-3" />
                <h3 className="font-bold text-gray-900 mb-2">Challenge Friends</h3>
                <p className="text-sm text-gray-600">
                    Account required for competitive features
                </p>
                </CardContent>
            </Card>
            </div>
        </div>
        </div>
    );
}