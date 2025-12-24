'use server'

import { db } from "@/lib/db"
import { auth } from "@/auth"

// Exam Management
export async function getAdminExams() {
    const session = await auth()
    if ((session?.user as any)?.role !== "ADMIN") return []

    return await db.exam.findMany({
        orderBy: { title: 'asc' },
        include: {
            course: true,
            _count: {
                select: { questions: true }
            }
        }
    })
}

export async function createExam(title: string, courseId: string) {
    const session = await auth()
    if ((session?.user as any)?.role !== "ADMIN") return { error: "Unauthorized" }

    if (!title || !courseId) return { error: "Başlık ve Kurs seçimi zorunludur." }

    try {
        const exam = await db.exam.create({
            data: {
                title,
                courseId
            }
        })
        return { success: "Sınav oluşturuldu", examId: exam.id }
    } catch (err) {
        return { error: "Sınav oluşturulamadı" }
    }
}

export async function deleteExam(examId: string) {
    const session = await auth()
    if ((session?.user as any)?.role !== "ADMIN") return { error: "Unauthorized" }

    try {
        await db.exam.delete({ where: { id: examId } })
        return { success: "Sınav silindi" }
    } catch (err) {
        return { error: "Sınav silinemedi" }
    }
}

export async function getExamDetails(examId: string) {
    const session = await auth()
    if ((session?.user as any)?.role !== "ADMIN") return null

    return await db.exam.findUnique({
        where: { id: examId },
        include: {
            questions: true,
            course: true
        }
    })
}

// Question Management

interface QuestionInput {
    text: string
    options: string[]
    correctAnswer: string
}

export async function addQuestion(examId: string, data: QuestionInput) {
    const session = await auth()
    if ((session?.user as any)?.role !== "ADMIN") return { error: "Unauthorized" }

    try {
        await db.question.create({
            data: {
                examId,
                text: data.text,
                options: JSON.stringify(data.options),
                correctAnswer: data.correctAnswer
            }
        })
        return { success: "Soru eklendi" }
    } catch (err) {
        return { error: "Soru eklenemedi" }
    }
}

export async function deleteQuestion(questionId: string) {
    const session = await auth()
    if ((session?.user as any)?.role !== "ADMIN") return { error: "Unauthorized" }

    try {
        await db.question.delete({ where: { id: questionId } })
        return { success: "Soru silindi" }
    } catch (err) {
        return { error: "Soru silinemedi" }
    }
}

export async function bulkAddQuestions(examId: string, questions: QuestionInput[]) {
    const session = await auth()
    if ((session?.user as any)?.role !== "ADMIN") return { error: "Unauthorized" }

    let count = 0
    try {
        for (const q of questions) {
            await db.question.create({
                data: {
                    examId,
                    text: q.text,
                    options: JSON.stringify(q.options),
                    correctAnswer: q.correctAnswer
                }
            })
            count++
        }
        return { success: `${count} soru başarıyla eklendi.` }
    } catch (err) {
        return { error: "Bazı sorular eklenirken hata oluştu." }
    }
}
