import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware to protect routes
 * Redirects unauthenticated users trying to access protected routes
 * Allows guest access to quiz browsing and taking
 */
export function middleware(request: NextRequest) {
    const accessToken = request.cookies.get('accessToken');
    const { pathname } = request.nextUrl;

    // Protected routes that REQUIRE authentication
    const protectedRoutes = ['/dashboard', '/quiz-session'];
    const isProtectedRoute = protectedRoutes.some((route) =>
        pathname.startsWith(route)
    );

    // Routes that guests can access (quiz browsing/taking, email verification, password reset)
    const guestAllowedRoutes = [
        '/quiz/browse', 
        '/quiz/take', 
        '/auth/verify-email', 
        '/auth/reset-password',
        '/auth/forgot-password',
        '/auth/callback',
        '/auth/google/callback'
    ];
    const isGuestRoute = guestAllowedRoutes.some((route) =>
        pathname.startsWith(route)
    );

    // Auth routes that authenticated users shouldn't access
    const authRoutes = ['/auth/login', '/auth/signup'];
    const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

    // Redirect authenticated users away from auth pages
    if (isAuthRoute && accessToken) {
        return NextResponse.redirect(new URL('/dashboard/home', request.url));
    }

    // Allow guest access to quiz routes and verification pages
    if (isGuestRoute) {
        return NextResponse.next();
    }

    // Redirect unauthenticated users away from protected pages
    if (isProtectedRoute && !accessToken) {
        const loginUrl = new URL('/auth/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        loginUrl.searchParams.set('message', 'Please login to access this feature');
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
    }

    /**
     * Configure which routes to run middleware on
     */
    export const config = {
    matcher: [
        /*
        * Match all request paths except:
        * - api (API routes)
        * - _next/static (static files)
        * - _next/image (image optimization files)
        * - favicon.ico (favicon file)
        * - public folder
        */
        '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
    ],
};