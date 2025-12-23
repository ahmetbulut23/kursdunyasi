'use server'

import { signIn, signOut } from "@/auth"
import { db } from "@/lib/db"
import { AuthError } from "next-auth"

export async function authenticate(prevState: string | undefined, formData: FormData) {
    try {
        await signIn('credentials', Object.fromEntries(formData))
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Invalid credentials.'
                default:
                    return 'Something went wrong.'
            }
        }
        throw error
    }
}

export async function register(formData: FormData) {
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const name = formData.get("name") as string

    if (!email || !password || !name) {
        return { error: "Missing fields" }
    }

    try {
        const existingUser = await db.user.findUnique({
            where: { email },
        })

        if (existingUser) {
            return { error: "User already exists" }
        }

        await db.user.create({
            data: {
                email,
                password, // Note: In a real app, hash this!
                name,
            },
        })

        return { success: "User created" }
    } catch (error) {
        return { error: "Failed to register" }
    }
}

export async function logout() {
    await signOut({ redirectTo: "/" })
}
