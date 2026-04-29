import type { NextAuthConfig } from 'next-auth';
import Google from 'next-auth/providers/google';

/**
 * Auth configuration for ToolDrop.
 *
 * In production this would use the Prisma adapter and bcrypt password verification.
 * For development, we use a mock credentials provider that accepts any valid email/password.
 */
export const authConfig: NextAuthConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
      profile(profile) {
        return {
          id: profile.sub,
          email: profile.email,
          avatarUrl: profile.picture,
          firstName: profile.given_name,
          lastName: profile.family_name,
        } as any;
      },
    }),
  ],

  pages: {
    signIn: '/login',
    newUser: '/signup',
    error: '/login',
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.firstName = (user as any).firstName;
        token.lastName = (user as any).lastName;
        token.avatarUrl = (user as any).avatarUrl;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
        (session.user as any).firstName = token.firstName;
        (session.user as any).lastName = token.lastName;
        session.user.image = token.avatarUrl as string;
        (session.user as any).role = token.role;
        
        // Populate name for compatibility with standard components
        if (!session.user.name && (token.firstName || token.lastName)) {
          session.user.name = `${token.firstName || ''} ${token.lastName || ''}`.trim();
        }
      }
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const protectedPaths = ['/dashboard', '/lender', '/checkout', '/messages', '/notifications', '/admin'];
      const authPaths = ['/login', '/signup'];
      
      const isProtected = protectedPaths.some((p) => nextUrl.pathname.startsWith(p));
      const isAuthPath = authPaths.some((p) => nextUrl.pathname.startsWith(p));

      if (isProtected && !isLoggedIn) {
        return Response.redirect(new URL('/login', nextUrl));
      }
      
      if (isAuthPath && isLoggedIn) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }
      
      return true;
    },
  },

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  secret: process.env.NEXTAUTH_SECRET ?? 'dev-secret-change-in-production',
};
