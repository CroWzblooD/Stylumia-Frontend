import { withClerkMiddleware, getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// First, create a helper function to check if the route needs authentication
function isProtectedRoute(pathname) {
  // List of routes that require authentication
  const protectedRoutes = [
    '/profile',  // Add profile to protected routes
    '/tryOn',
    '/FashionTrend',
    '/sustainable',
    '/aiStylist',
    '/fashionAnalytics'
  ];

  return protectedRoutes.some(route => pathname.startsWith(route));
}

export default withClerkMiddleware((req) => {
  const { userId } = getAuth(req);
  const pathname = req.nextUrl.pathname;

  // Allow public routes
  if (
    pathname === "/" || 
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/explore') ||
    pathname.startsWith('/trending') ||
    pathname.startsWith('/collections') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api')
  ) {
    return NextResponse.next();
  }

  // Check if it's a protected route
  if (isProtectedRoute(pathname)) {
    // If user is not signed in, redirect to sign-in page
    if (!userId) {
      const signInUrl = new URL('/sign-in', req.url);
      signInUrl.searchParams.set('redirect_url', pathname);
      return NextResponse.redirect(signInUrl);
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
    "/"
  ],
};