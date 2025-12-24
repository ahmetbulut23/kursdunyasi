import { getAdminExams, deleteExam } from "@/app/actions/exam-admin-actions"
import { getAdminCourses } from "@/app/actions/admin-actions"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Trophy, Edit, Trash2, Plus, FileText } from "lucide-react"
import { CreateExamDialog } from "./create-exam-dialog"

export const dynamic = 'force-dynamic'

export default async function AdminExamsPage() {
    const exams = await getAdminExams()
    const courses = await getAdminCourses()

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Sınav Yönetimi</h1>
                    <p className="text-muted-foreground">
                        Kurslar için sınavlar oluşturun ve soru bankasını yönetin.
                    </p>
                </div>
                <CreateExamDialog courses={courses} />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {exams.length === 0 && (
                    <div className="col-span-full text-center py-12 border rounded-xl bg-card">
                        <Trophy className="mx-auto h-12 w-12 text-muted-foreground/50" />
                        <h3 className="mt-4 text-lg font-semibold">Henüz Sınav Yok</h3>
                        <p className="text-muted-foreground">İlk sınavınızı oluşturarak başlayın.</p>
                    </div>
                )}

                {exams.map((exam: any) => (
                    <div key={exam.id} className="group relative flex flex-col justify-between overflow-hidden rounded-xl border bg-card p-6 shadow-sm hover:shadow-md transition-all">
                        <div className="space-y-2">
                            <div className="flex items-start justify-between">
                                <h3 className="font-bold text-lg line-clamp-1">{exam.title}</h3>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Link href={`/dashboard/admin/exams/${exam.id}`}>
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                    </Link>
                                    <form action={async () => {
                                        'use server'
                                        await deleteExam(exam.id)
                                    }}>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </form>
                                </div>
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-1">
                                {exam.course?.title}
                            </p>
                            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground bg-secondary/50 p-2 rounded w-fit">
                                <FileText className="h-3 w-3" />
                                {exam._count.questions} Soru
                            </div>
                        </div>

                        <div className="mt-6 pt-4 border-t">
                            <Link href={`/dashboard/admin/exams/${exam.id}`}>
                                <Button className="w-full" variant="outline">
                                    Soruları Yönet
                                </Button>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
