export { auth as middleware } from '@/lib/auth';

export const config = {
  // Run middleware on all routes except static files and API routes
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|tools/.*\\.jpg).*)'],
};
