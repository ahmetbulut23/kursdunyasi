import { db } from "@/lib/db"
import ExamClient from "@/components/exam/exam-client"
import { notFound } from "next/navigation"

export default async function ExamPage({ params }: { params: Promise<{ examId: string }> }) {
    const resolvedParams = await params;
    const examId = resolvedParams.examId;

    const exam = await db.exam.findUnique({
        where: { id: examId },
        include: { questions: true }
    })

    if (!exam) return notFound()

    // Parse options from JSON string
    const validQuestions = exam.questions.map(q => {
        let parsedOptions: string[] = []
        try {
            parsedOptions = JSON.parse(q.options)
        } catch (e) {
            parsedOptions = []
        }
        return {
            id: q.id,
            text: q.text,
            options: parsedOptions
        }
    })

    return <ExamClient exam={{ ...exam, questions: validQuestions }} />
}
