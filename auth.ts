import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { db } from "@/lib/db"
import { authConfig } from "@/auth.config"
import Credentials from "next-auth/providers/credentials"
import { z } from "zod"

const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1, "Password is required"),
})

export const { handlers, auth, signIn, signOut } = NextAuth({
    ...authConfig,
    adapter: PrismaAdapter(db),
    session: { strategy: "jwt" },
    callbacks: {
        ...authConfig.callbacks,
        async jwt({ token }) {
            if (!token.sub) return token

            const existingUser = await db.user.findUnique({
                where: { id: token.sub }
            })

            if (!existingUser) return token

            token.role = existingUser.role
            return token
        }
    },
    providers: [
        Credentials({
            async authorize(credentials) {
                const validatedFields = LoginSchema.safeParse(credentials)

                if (validatedFields.success) {
                    const { email, password } = validatedFields.data

                    const user = await db.user.findUnique({
                        where: { email }
                    })

                    if (!user || !user.password) return null

                    if (password === user.password) {
                        return user
                    }
                }
                return null
            }
        })
    ],
})
