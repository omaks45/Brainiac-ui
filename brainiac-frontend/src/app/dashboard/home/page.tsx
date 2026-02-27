'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Brain, Zap, Users, TrendingUp, Plus, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCurrentUser } from '@/lib/store/auth-store';
import { useMyAttempts } from '@/lib/hooks/use-quiz';
import GenerateQuizModal from '@/components/quiz/GenerateQuizModal';
import RecentActivity from '@/components/quiz/RecentActivity';
import { CATEGORY_META, QuizAttempt } from '@/lib/types/quiz.types';
import { cn } from '@/lib/utils/cn';
//import { QuizAttempt } from '@/lib/types/quiz.types';


// Quick Stats

interface QuickStatsProps {
    quizzesTaken: number;
    totalScore: number;
    challengesWon: number;
    currentRank: string | number;
}

interface UserWithStats {
    displayName?: string;
    stats?: {
        rank?: string | number;
    };
}


function QuickStats({ quizzesTaken, totalScore, challengesWon, currentRank }: QuickStatsProps) {
    const stats = [
        { label: 'Quizzes Taken',  value: quizzesTaken,   icon: Brain,      color: 'text-primary-600',   bg: 'bg-primary-50'   },
        { label: 'Total Score',    value: totalScore,     icon: TrendingUp, color: 'text-emerald-600',   bg: 'bg-emerald-50'   },
        { label: 'Challenges Won', value: challengesWon,  icon: Zap,        color: 'text-amber-600',     bg: 'bg-amber-50'     },
        { label: 'Current Rank',   value: currentRank,    icon: Users,      color: 'text-secondary-600', bg: 'bg-secondary-50' },
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
}

// Category Grid 

function QuizCategories() {
    const router = useRouter();

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {CATEGORY_META.map((cat, index) => (
            <button
            key={cat.id}
            onClick={() => router.push(`/dashboard/quizzes?category=${cat.id}`)}
            className="group text-left w-full"
            >
            <Card
                variant="bordered"
                className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer animate-scale-in"
                style={{ animationDelay: `${index * 50}ms` }}
            >
                <CardContent className="p-6 text-center">
                <div
                    className={cn(
                    'w-16 h-16 mx-auto mb-3 rounded-xl flex items-center justify-center',
                    'bg-gradient-to-br shadow-lg',
                    'group-hover:scale-110 transition-transform duration-300',
                    cat.gradient
                    )}
                >
                    <Brain className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1 text-sm leading-tight">
                    {cat.label}
                </h3>
                <p className="text-xs text-gray-500">0 quizzes</p>
                </CardContent>
            </Card>
            </button>
        ))}
        </div>
    );
}

// Quick Generate Panel 

function QuickGeneratePanel({ onGenerate }: { onGenerate: () => void }) {
    return (
        <Card variant="elevated" className="h-full">
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary-600" />
            Quick Generate
            </CardTitle>
            <CardDescription>Create a quiz in seconds with AI</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
            <div className="flex flex-wrap gap-1.5 mb-5">
            {['Easy', 'Medium', 'Hard'].map(d => (
                <span
                key={d}
                className="px-2.5 py-1 rounded-full bg-gray-100 text-xs font-semibold text-gray-600"
                >
                {d}
                </span>
            ))}
            </div>
            <Button
            fullWidth
            onClick={onGenerate}
            leftIcon={<Sparkles className="w-4 h-4" />}
            className="shadow-md hover:shadow-glow"
            >
            Generate Now
            </Button>
        </CardContent>
        </Card>
    );
}

//  Main Home Page 

export default function DashboardHomePage() {
    const [showModal, setShowModal] = useState(false);
    const user = useCurrentUser();

    // Live stats derived from real attempt history
    const { data: attemptsData } = useMyAttempts(20);
    const attempts   = (attemptsData?.attempts ?? []) as QuizAttempt[];
    const totalScore = attempts.reduce((s: number, a: QuizAttempt) => s + (a.score ?? 0), 0);
    const challengesWon = 0; // Phase 3 — wire to challenges API
    const currentRank = (user as UserWithStats)?.stats?.rank ?? '-';

    return (
        <div className="max-w-7xl mx-auto">

        {/* ── Welcome Header ── */}
        <div className="mb-8 animate-fade-in">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.displayName?.split(' ')[0] ?? 'there'}!
            </h1>
            <p className="text-gray-600">
            Ready to challenge your mind? Let&#39;s get started with a quiz.
            </p>
        </div>

        {/* ── CTA Buttons ── */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 animate-slide-up">
            <Button
            size="lg"
            leftIcon={<Plus className="w-5 h-5" />}
            className="shadow-lg hover:shadow-glow"
            onClick={() => setShowModal(true)}
            >
            Create AI Quiz
            </Button>
            <Link href="/dashboard/challenges">
            <Button
                variant="outline"
                size="lg"
                leftIcon={<Users className="w-5 h-5" />}
            >
                Challenge Friends
            </Button>
            </Link>
        </div>

        {/* ── Quick Stats — live data from attempts ── */}
        <QuickStats
            quizzesTaken={attempts.length}
            totalScore={totalScore}
            challengesWon={challengesWon}
            currentRank={currentRank}
        />

        {/* ── Recent Activity + Quick Generate ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2">
            <RecentActivity />
            </div>
            <div>
            <QuickGeneratePanel onGenerate={() => setShowModal(true)} />
            </div>
        </div>

        {/* ── Browse by Category ── */}
        <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Browse by Category</h2>
            <Link
                href="/dashboard/quizzes"
                className="text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors"
            >
                See all →
            </Link>
            </div>
            <QuizCategories />
        </div>

        {/* ── Generate Quiz Modal ── */}
        <GenerateQuizModal isOpen={showModal} onClose={() => setShowModal(false)} />
        </div>
    );
}
