'use server'

import { db } from "@/lib/db"
import { auth } from "@/auth"

async function checkChatPermissions(userId: string) {
    const user = await db.user.findUnique({
        where: { id: userId },
        include: {
            purchases: {
                include: { package: true },
                orderBy: { createdAt: 'desc' },
                take: 1
            }
        }
    })

    if (!user) return { canUserChat: false, canInstructorChat: false }

    // Admin always has access
    if (user.role === 'ADMIN') return { canUserChat: true, canInstructorChat: true }

    const activePurchase = user.purchases[0]
    if (!activePurchase) return { canUserChat: false, canInstructorChat: false }

    return {
        canUserChat: activePurchase.package.enableUserChat,
        canInstructorChat: activePurchase.package.enableInstructorChat
    }
}

export async function getMessages(type: 'COMMUNITY' | 'INSTRUCTOR' = 'COMMUNITY') {
    try {
        const messages = await db.message.findMany({
            where: { type },
            take: 50,
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: { name: true, role: true }
                }
            }
        })
        return messages.reverse()
    } catch (error) {
        console.error("getMessages error:", error)
        return []
    }
}

export async function sendMessage(content: string, type: 'COMMUNITY' | 'INSTRUCTOR' = 'COMMUNITY') {
    const session = await auth()
    if (!session?.user?.id) return { error: "Unauthorized" }

    if (!content.trim()) return { error: "Empty message" }

    // Check permissions
    const perms = await checkChatPermissions(session.user.id)
    if (type === 'COMMUNITY' && !perms.canUserChat) {
        return { error: "Bu sohbet kanalına erişiminiz yok (Paketinizi yükseltin)" }
    }
    if (type === 'INSTRUCTOR' && !perms.canInstructorChat) {
        return { error: "Eğitmen sohbetine erişiminiz yok (Premium özellik)" }
    }

    try {
        const message = await db.message.create({
            data: {
                content,
                type,
                userId: session.user.id
            },
            include: {
                user: {
                    select: { name: true, role: true }
                }
            }
        })
        return { success: true, message }
    } catch (err) {
        return { error: "Failed to send" }
    }
}

export async function getChatPermissions() {
    const session = await auth()
    if (!session?.user?.id) return { canUserChat: false, canInstructorChat: false }
    return await checkChatPermissions(session.user.id)
}
