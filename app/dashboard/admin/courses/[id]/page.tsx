import { auth } from "@/auth"
import { db } from "@/lib/db"
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { CourseEditForm, LessonManager, LearningOutcomeManager, EnrollmentManager, MaterialManager } from './edit-course-client'
import { getCourseEnrollments } from "@/app/actions/admin-actions"

async function getCourseData(id: string) {
    const session = await auth()
    if ((session?.user as any)?.role !== "ADMIN") return null
    return await db.course.findUnique({
        where: { id },
        include: {
            lessons: { orderBy: { order: 'asc' } },
            learningOutcomes: true,
            materials: true
        }
    })
}

export default async function EditCoursePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const course = await getCourseData(id)
    const categories = await db.category.findMany({ orderBy: { name: 'asc' } })
    const enrollments = await getCourseEnrollments(id)

    if (!course) return <div>Kurs bulunamadı veya yetkiniz yok.</div>

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/admin/courses">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <h1 className="text-2xl font-bold tracking-tight">Kurs Düzenle</h1>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Left Column: Course Details */}
                <div className="space-y-6">
                    <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
                        <h3 className="font-semibold mb-4">Kurs Bilgileri</h3>
                        <CourseEditForm course={course} categories={categories} />
                    </div>
                    <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
                        <h3 className="font-semibold mb-4">Kayıtlı Öğrenciler</h3>
                        <EnrollmentManager courseId={course.id} enrollments={enrollments} />
                    </div>
                </div>

                {/* Right Column: Lessons & Outcomes */}
                <div className="space-y-6">
                    <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
                        <h3 className="font-semibold mb-4">Öğrenim Çıktıları (Kazanımlar)</h3>
                        <LearningOutcomeManager courseId={course.id} outcomes={course.learningOutcomes} />
                    </div>

                    <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
                        <h3 className="font-semibold mb-4">Dersler</h3>
                        <LessonManager courseId={course.id} lessons={course.lessons} />
                    </div>

                    <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
                        <h3 className="font-semibold mb-4">Kurs Materyalleri</h3>
                        <MaterialManager courseId={course.id} materials={course.materials} />
                    </div>
                </div>
            </div>
        </div>
    )
}

