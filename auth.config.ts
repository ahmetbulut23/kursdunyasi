import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { z } from "zod"
// Note: We cannot import db here for Edge compatibility in Middleware

const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1, "Password is required"),
})

export const authConfig = {
    pages: {
        signIn: "/login",
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user
            const isOnDashboard = nextUrl.pathname.startsWith("/dashboard")
            const isOnLogin = nextUrl.pathname.startsWith("/login")

            if (isOnDashboard) {
                if (isLoggedIn) return true
                return false // Redirect to login
            }

            if (isOnLogin) {
                if (isLoggedIn) return Response.redirect(new URL("/dashboard", nextUrl))
                return true
            }
            return true
        },
        async session({ session, token }) {
            if (token.sub && session.user) {
                session.user.id = token.sub
            }
            if (token.role && session.user) {
                (session.user as any).role = token.role
            }
            return session
        },
        async jwt({ token }) {
            // Note: We cannot query DB here if running in Middleware
            // But this callback runs on server too.
            // For now, simpler logic or rely on what's passed in 'user' argument on first signin
            return token
        }
    },
    providers: [
        Credentials({
            async authorize(credentials) {
                // This will run on Node runtime (via Server Action), so technically we COULD import DB here?
                // But if this file is imported in middleware, it might break.
                // WE WILL OVERRIDE 'providers' in auth.ts to include the DB call.
                return null // Placeholder, overridden in auth.ts
            }
        })
    ],
} satisfies NextAuthConfig
