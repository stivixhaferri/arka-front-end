import { clerkMiddleware } from '@clerk/nextjs/server';

// Define protected route prefixes
const protectedRoutes = ['/dashboard', '/forum'];

export default clerkMiddleware((auth, req) => {
  const url = req.nextUrl.pathname;

  // Check if the route starts with any protected prefix
  const isProtected = protectedRoutes.some((route) => url.startsWith(route));

  if (isProtected) {
    auth.protect(); // ✅ Direct usage
  }
});

export const config = {
  matcher: [
    // Match all relevant routes
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
