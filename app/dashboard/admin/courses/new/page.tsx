import { auth } from '@/auth'
import { db } from '@/lib/db'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { CreateCourseForm } from './create-course-client'

export default async function NewCoursePage() {
    const session = await auth()
    if ((session?.user as any)?.role !== "ADMIN") return <div>Yetkisiz Erişim</div>

    const categories = await db.category.findMany({
        orderBy: { name: 'asc' }
    })

    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/admin/courses">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <h1 className="text-2xl font-bold tracking-tight">Yeni Kurs Oluştur</h1>
            </div>

            <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
                <CreateCourseForm categories={categories} />
            </div>
        </div>
    )
}
