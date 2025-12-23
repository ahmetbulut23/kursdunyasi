import { db } from "@/lib/db"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PlayCircle, Star, TrendingUp, Clock, ChevronRight } from "lucide-react"
import Image from "next/image"

export default async function CoursesPage(props: { searchParams?: Promise<{ category?: string }> }) {
    const searchParams = await props.searchParams;
    const categorySlug = searchParams?.category;

    const categories = await db.category.findMany({
        orderBy: { name: 'asc' }
    });

    const where: any = {}
    if (categorySlug) {
        where.category = { slug: categorySlug }
    }

    const courses = await db.course.findMany({
        where,
        include: {
            category: true,
            _count: {
                select: { lessons: true }
            }
        },
        orderBy: { createdAt: 'desc' }
    })

    console.log(`CoursesPage: Found ${courses.length} courses for category ${categorySlug || 'ALL'}`)

    return (
        <div className="space-y-8 pb-10">
            {/* Header / Search Area (Could be expanded later) */}
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Kursları Keşfet</h1>
                <p className="text-muted-foreground">
                    Geleceğinizi şekillendirecek yetenekleri bugün öğrenmeye başlayın.
                </p>
            </div>

            {/* Category Nav - Scrollable */}
            <div className="border-b">
                <div className="flex items-center gap-6 overflow-x-auto pb-4 no-scrollbar">
                    <Link href="/dashboard/courses" className="text-sm font-bold border-b-2 border-primary pb-1 shrink-0">
                        Tüm Kurslar
                    </Link>
                    {categories.map((cat: any) => (
                        <Link
                            key={cat.id}
                            href={`/dashboard/courses?category=${cat.slug}`}
                            className="text-sm font-medium text-muted-foreground hover:text-foreground shrink-0 transition-colors"
                        >
                            {cat.name}
                        </Link>
                    ))}
                </div>
            </div>

            {/* Featured Section (Tabs Mockup) */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Başlangıç için önerilen kurslar</h2>
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-4 border-b w-fit">
                    <button className="px-4 py-2 text-sm font-bold border-b-2 border-foreground">
                        En Popüler
                    </button>
                    <button className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground">
                        Yeni
                    </button>
                    <button className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground">
                        Trendler
                    </button>
                </div>

                {/* Course Grid */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {courses.length === 0 && (
                        <div className="col-span-full py-12 text-center">
                            <h3 className="text-xl font-bold text-muted-foreground">Aradığınız kriterlere uygun kurs bulunamadı.</h3>
                            <Button variant="link" asChild className="mt-2">
                                <Link href="/dashboard/courses">Tüm kursları göster</Link>
                            </Button>
                        </div>
                    )}
                    {courses.map((course: any) => (
                        <Link href={`/dashboard/courses/${course.id}`} key={course.id} className="group flex flex-col h-full bg-card border rounded-xl overflow-hidden hover:shadow-lg transition-all hover:scale-[1.01]">
                            {/* Image Container */}
                            <div className="relative aspect-video w-full bg-gray-200 dark:bg-gray-800">
                                {course.imageUrl ? (
                                    <img
                                        src={course.imageUrl}
                                        alt={course.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center w-full h-full text-gray-400">
                                        <PlayCircle className="h-12 w-12" />
                                    </div>
                                )}
                                {/* Overlay Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                                    <span className="text-white text-sm font-medium flex items-center gap-1">
                                        <PlayCircle className="h-4 w-4" /> Kursu İncele
                                    </span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex flex-col flex-1 p-4 gap-2">
                                <h3 className="font-bold line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                                    {course.title}
                                </h3>
                                <p className="text-xs text-muted-foreground line-clamp-1">
                                    {course.instructor || "Kurs Dünyası Eğitmeni"}
                                </p>

                                {/* Rating */}
                                <div className="flex items-center gap-1 text-xs font-bold text-yellow-600 dark:text-yellow-500">
                                    <span className="text-sm">{course.rating.toFixed(1)}</span>
                                    <div className="flex">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className={`h-3 w-3 ${i < Math.floor(course.rating) ? "fill-current" : "text-gray-300"}`} />
                                        ))}
                                    </div>
                                    <span className="text-muted-foreground font-normal">(1,250)</span>
                                </div>

                                {/* Meta Info (Lessons/Level) */}
                                <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                                    <span className="flex items-center gap-1">
                                        <PlayCircle className="h-3 w-3" /> {course._count.lessons} Ders
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Clock className="h-3 w-3" /> 12s 30dk
                                    </span>
                                </div>

                                <div className="mt-auto pt-4 flex items-center justify-between">
                                    <span className="text-lg font-bold">
                                        {course.price > 0 ? `₺${course.price}` : 'Ücretsiz'}
                                    </span>
                                    {course._count.lessons > 0 && course.category && (
                                        <span className="text-[10px] uppercase tracking-wider font-semibold bg-secondary px-2 py-1 rounded text-secondary-foreground">
                                            {course.category.name}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Categories Grid (Visible Categories) */}
            <div className="mt-12">
                <h2 className="text-2xl font-bold mb-6">En Çok Aranan Kategoriler</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {categories.map((cat: any) => (
                        <div key={cat.id} className="border rounded-lg p-4 bg-card hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer flex items-center justify-between group">
                            <span className="font-medium">{cat.name}</span>
                            <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
