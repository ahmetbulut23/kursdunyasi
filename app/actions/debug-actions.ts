'use server'

import { auth } from "@/auth"

export async function debugAuth() {
    try {
        console.log("Debug Auth: Starting");
        console.log("NEXTAUTH_URL env:", process.env.NEXTAUTH_URL);
        const session = await auth();
        console.log("Debug Auth: Session retrieved", session?.user?.email);
        return { success: true, email: session?.user?.email };
    } catch (error: any) {
        console.error("Debug Auth Error:", error);
        return { success: false, error: error.message };
    }
}
