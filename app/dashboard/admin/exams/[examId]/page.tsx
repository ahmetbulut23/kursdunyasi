import { getExamDetails } from "@/app/actions/exam-admin-actions"
import { notFound } from "next/navigation"
import { ExamEditor } from "./exam-editor"

export default async function AdminExamEditorPage({ params }: { params: Promise<{ examId: string }> }) {
    const resolvedParams = await params;

    // Validate exam exists
    const exam = await getExamDetails(resolvedParams.examId)
    if (!exam) return notFound()

    return (
        <div className="space-y-6">
            <div className="border-b pb-4">
                <h1 className="text-2xl font-bold">{exam.title}</h1>
                <p className="text-muted-foreground text-sm">
                    {exam.course.title} • {exam.questions.length} Soru
                </p>
            </div>

            <ExamEditor exam={exam} />
        </div>
    )
}
