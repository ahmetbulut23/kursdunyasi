import { db } from "@/lib/db"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PlayCircle, Lock, LayoutList, Check, Globe, AlertCircle, Share2, Award, FileText, Smartphone, Infinity as InfinityIcon } from "lucide-react"
import { auth } from "@/auth"
import { EnrollmentButton } from "@/components/course/enrollment-button"

import { PaymentSuccessHandler } from "@/components/course/payment-success-handler"

export default async function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    const courseId = resolvedParams.id;
    const session = await auth();

    const course = await db.course.findUnique({
        where: { id: courseId },
        include: {
            lessons: {
                orderBy: { order: 'asc' }
            },
            package: true, // Include package info for price
            learningOutcomes: true // [NEW] Fetch dynamic learning outcomes
        }
    })

    if (!course) {
        return <div>Kurs bulunamadı</div>
    }

    // Attempt to check if purchased
    let hasPurchased = false;
    if (session?.user?.id && course.packageId) {
        const purchase = await db.purchase.findFirst({
            where: {
                userId: session.user.id,
                packageId: course.packageId
            }
        })
        if (purchase) hasPurchased = true;
    }

    // Check for direct enrollment (via package credits)
    let isEnrolled = false;
    if (session?.user?.id) {
        const enrollment = await db.enrollment.findUnique({
            where: {
                userId_courseId: {
                    userId: session.user.id,
                    courseId: courseId
                }
            }
        })
        if (enrollment) isEnrolled = true;
    }

    const isAdmin = (session?.user as any)?.role === "ADMIN";
    const canAccess = hasPurchased || isAdmin || isEnrolled;

    // Use dynamic data (fallback to array if empty for some reason, though db push should handle it)
    const learningPoints = course.learningOutcomes.length > 0
        ? course.learningOutcomes.map(lo => lo.text)
        : [
            "Bu kurs için henüz öğrenim çıktıları eklenmemiş.",
            "Eğitmen tarafından güncellenmesi bekleniyor."
        ];

    // Mock Data for Course Includes
    const courseIncludes = [
        { icon: PlayCircle, text: `${course.lessons.length * 2} saat uzunluğunda video içeriği` },
        { icon: FileText, text: "5 makale" },
        { icon: Award, text: "Bitirme sertifikası" },
        { icon: Smartphone, text: "Mobil ve TV'den erişim" },
        { icon: InfinityIcon, text: "Ömür boyu tam erişim" },
    ]

    return (
        <div className="max-w-7xl mx-auto pb-10">
            <PaymentSuccessHandler />
            {/* Header Section */}
            <div className="bg-primary text-primary-foreground -mx-6 -mt-6 px-6 py-10 mb-8 md:px-12">
                <div className="max-w-4xl">
                    <h1 className="text-3xl md:text-4xl font-bold mb-4">{course.title}</h1>
                    <p className="text-lg text-primary-foreground/90 mb-4">{course.description}</p>
                    <div className="flex flex-wrap items-center gap-4 text-sm opacity-90">
                        <span className="flex items-center gap-1 bg-yellow-400/20 px-2 py-1 rounded text-yellow-200">
                            <span className="font-bold">4.8</span> ★★★★★ (120 puan)
                        </span>
                        <span>1,250 öğrenci</span>
                        <span className="flex items-center gap-1"><Globe className="h-3 w-3" /> Türkçe</span>
                        <span className="flex items-center gap-1"><AlertCircle className="h-3 w-3" /> Son güncelleme: 12/2024</span>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 px-4 md:px-0">
                {/* Left Column: Content */}
                <div className="lg:col-span-2 space-y-8">

                    {/* What you'll learn */}
                    <div className="border rounded-2xl p-6 bg-card shadow-sm">
                        <h2 className="text-xl font-bold mb-6">Öğrenecekleriniz</h2>
                        <div className="grid md:grid-cols-2 gap-4">
                            {learningPoints.map((point, index) => (
                                <div key={index} className="flex gap-3 text-sm text-muted-foreground">
                                    <Check className="h-5 w-5 text-green-500 shrink-0" />
                                    <span>{point}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Course Content List */}
                    <div className="border rounded-2xl p-6 bg-card shadow-sm">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <LayoutList className="h-5 w-5" /> Kurs İçeriği
                        </h2>
                        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                            <span>{course.lessons.length} ders</span>
                            <span>Toplam süre: {course.lessons.length * 45} dk (tahmini)</span>
                        </div>
                        <div className="space-y-2">
                            {course.lessons.map((lesson: any) => (
                                <Link
                                    key={lesson.id}
                                    href={`/dashboard/courses/${course.id}/lessons/${lesson.id}`}
                                    className="flex items-center justify-between p-4 rounded-xl border bg-gray-50/50 dark:bg-gray-900/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group"
                                >
                                    <div className="flex items-center gap-4">
                                        <span className="flex items-center justify-center h-8 w-8 rounded-full bg-white dark:bg-black border text-sm font-medium text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                            {lesson.order}
                                        </span>
                                        <div className="flex flex-col">
                                            <span className="font-medium">{lesson.title}</span>
                                            {/* <span className="text-xs text-muted-foreground">Video • 12dk</span> */}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {lesson.order <= 3 || canAccess ? (
                                            <PlayCircle className="h-5 w-5 text-primary" />
                                        ) : (
                                            <Lock className="h-5 w-5 text-muted-foreground" />
                                        )}
                                        {/* <span className="text-xs text-muted-foreground hidden sm:block">Önizle</span> */}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Sticky Sidebar */}
                <div className="lg:col-span-1">
                    <div className="sticky top-4 space-y-6">
                        {/* Pricing/Action Card */}
                        <div className="border rounded-2xl p-6 bg-card shadow-lg overflow-hidden relative">
                            {/* Decoration */}
                            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl"></div>

                            <div className="mb-6">
                                <span className="text-3xl font-bold">
                                    {course.price > 0 ? `₺${course.price}` : 'Ücretsiz'}
                                </span>
                            </div>

                            <div className="space-y-3 mb-6">
                                <EnrollmentButton courseId={course.id} price={course.price} />
                                <p className="text-xs text-center text-muted-foreground mt-2">30 Gün İçinde Para İade Garantisi</p>
                            </div>

                            <div className="space-y-4">
                                <p className="font-bold text-sm">Bu kursun içeriği:</p>
                                <ul className="space-y-3">
                                    {courseIncludes.map((item, i) => (
                                        <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                                            <item.icon className="h-5 w-5 shrink-0 opacity-70" />
                                            <span>{item.text}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="border-t mt-6 pt-4 flex justify-between items-center">
                                <Button variant="ghost" size="sm" className="text-xs font-semibold">
                                    Paylaş
                                </Button>
                                <Button variant="ghost" size="sm" className="text-xs font-semibold">
                                    Hediye Et
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
