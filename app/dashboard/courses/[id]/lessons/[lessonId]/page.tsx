import { db } from "@/lib/db"
import { auth } from "@/auth"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Lock, ArrowLeft } from "lucide-react"

export default async function LessonPage({ params }: { params: Promise<{ id: string, lessonId: string }> }) {
    const resolvedParams = await params;
    const { id: courseId, lessonId } = resolvedParams;
    const session = await auth()

    const lesson = await db.lesson.findUnique({
        where: { id: lessonId },
        include: {
            course: true
        }
    })

    if (!lesson) return <div>Lesson not found</div>

    // Access Logic
    const isFree = lesson.order <= 3;

    let hasPurchased = false;
    if (session?.user?.id && lesson.course.packageId) {
        const purchase = await db.purchase.findUnique({
            where: {
                userId_packageId: {
                    userId: session.user.id,
                    packageId: lesson.course.packageId
                }
            }
        })
        if (purchase) hasPurchased = true;
    }

    const hasAccess = isFree || hasPurchased || (session?.user as any)?.role === "ADMIN";

    // Helper to standardise video URLs
    const getEmbedUrl = (url: string) => {
        if (!url) return '';
        let videoId = '';

        if (url.includes('youtube.com/watch?v=')) {
            videoId = url.split('v=')[1]?.split('&')[0];
        } else if (url.includes('youtu.be/')) {
            videoId = url.split('youtu.be/')[1]?.split('?')[0];
        } else if (url.includes('youtube.com/embed/')) {
            videoId = url.split('embed/')[1]?.split('?')[0];
        }

        if (videoId) {
            return `https://www.youtube.com/embed/${videoId}?playsinline=1&rel=0&modestbranding=1`;
        }

        return url;
    };

    const allLessons = await db.lesson.findMany({
        where: { courseId: courseId },
        orderBy: { order: 'asc' }
    })

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
                <Link href={`/dashboard/courses/${courseId}`}>
                    <Button variant="ghost" size="sm" className="gap-2">
                        <ArrowLeft className="h-4 w-4" /> Kursa Dön
                    </Button>
                </Link>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                    <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-lg border relative z-10">
                        {hasAccess && lesson.videoUrl ? (
                            <iframe
                                src={getEmbedUrl(lesson.videoUrl)}
                                className="w-full h-full"
                                allowFullScreen
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            />
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full gap-4 bg-gray-900 text-white">
                                <Lock className="h-12 w-12 text-gray-500" />
                                <h3 className="text-xl font-bold">Bu içerik kilitli</h3>
                                <p className="text-gray-400 text-center max-w-md">Bu dersi ve diğer tüm ileri seviye dersleri görüntülemek için Premium Pakete geçin.</p>
                                <Link href="/dashboard/packages">
                                    <Button className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white border-0">
                                        Paketleri İncele & Kilidi Aç
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">{lesson.title}</h1>
                        <p className="text-muted-foreground mt-2">{lesson.course.title}</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="rounded-xl border bg-card p-4 h-fit max-h-[600px] overflow-y-auto">
                        <h3 className="font-semibold mb-4">Kurs İçeriği</h3>
                        <div className="space-y-2">
                            {allLessons.map((l: { id: string; title: string; order: number }) => (
                                <Link
                                    key={l.id}
                                    href={`/dashboard/courses/${courseId}/lessons/${l.id}`}
                                    className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${l.id === lesson.id ? 'bg-indigo-50 border-indigo-200 dark:bg-indigo-900/20' : 'hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                                >
                                    <span className={`text-sm ${l.id === lesson.id ? 'font-semibold text-indigo-600' : ''}`}>
                                        {l.order}. {l.title}
                                    </span>
                                    {l.order <= 3 ? null : <Lock className="h-3 w-3 text-gray-400" />}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
