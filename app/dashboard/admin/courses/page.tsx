import { auth } from "@/auth"
import { getAdminCourses, deleteCourse } from "@/app/actions/admin-actions"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus, Edit, Trash2, Video } from "lucide-react"

export default async function AdminCoursesPage() {
    const session = await auth()
    if ((session?.user as any)?.role !== "ADMIN") {
        return <div>Yetkisiz Erişim</div>
    }

    const courses = await getAdminCourses()

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Kurs Yönetimi</h1>
                    <p className="text-gray-500 dark:text-gray-400">
                        Kursları oluşturun, düzenleyin ve yönetin.
                    </p>
                </div>
                <Link href="/dashboard/admin/courses/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Yeni Kurs Ekle
                    </Button>
                </Link>
            </div>

            <div className="rounded-xl border bg-card text-card-foreground shadow">
                <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                        <thead className="[&_tr]:border-b">
                            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Kurs Başlığı</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Fiyat</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Ders Sayısı</th>
                                <th className="h-12 px-4 text-center align-middle font-medium text-muted-foreground">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                            {courses.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="p-4 text-center text-muted-foreground">
                                        Henüz kurs yok.
                                    </td>
                                </tr>
                            )}
                            {courses.map((course) => (
                                <tr key={course.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                    <td className="p-4 align-middle font-medium">{course.title}</td>
                                    <td className="p-4 align-middle">
                                        {course.price === 0 ? "Ücretsiz" : `₺${course.price}`}
                                    </td>
                                    <td className="p-4 align-middle">
                                        {course._count.lessons} Ders
                                    </td>
                                    <td className="p-4 align-middle">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link href={`/dashboard/admin/courses/${course.id}`}>
                                                <Button variant="outline" size="sm">
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    Düzenle
                                                </Button>
                                            </Link>
                                            <form action={async () => {
                                                'use server'
                                                await deleteCourse(course.id)
                                            }}>
                                                <Button variant="destructive" size="sm" type="submit">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </form>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
