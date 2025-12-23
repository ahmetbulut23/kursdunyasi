'use server'

import { db } from "@/lib/db"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"

export async function submitExam(examId: string, answers: Record<string, string>) {
    const session = await auth()

    if (!session?.user?.id) {
        return { error: "Unauthorized" }
    }

    const exam = await db.exam.findUnique({
        where: { id: examId },
        include: { questions: true }
    })

    if (!exam) return { error: "Exam not found" }

    let score = 0
    const totalQuestions = exam.questions.length

    // Calculate score
    exam.questions.forEach(q => {
        if (answers[q.id] === q.correctAnswer) {
            score++
        }
    })

    // Calculate percentage or raw score? 
    // Let's store raw score for now out of total.
    // Ideally store percentage or both. 
    // Schema has Int score. Let's make it simple percentage * 10 or just raw score.
    // Actually, usually users want 100 based score.
    const finalScore = Math.round((score / totalQuestions) * 100)

    // Save result
    await db.result.create({
        data: {
            examId,
            userId: session.user.id,
            score: finalScore
        }
    })

    // Award stars (Gamification stub)
    if (finalScore >= 70) {
        await db.user.update({
            where: { id: session.user.id },
            data: { stars: { increment: 1 } }
        })
    }

    revalidatePath('/dashboard/exams')
    return { success: true, score: finalScore }
}
