import { db } from "@/lib/db"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle, Clock, Trophy } from "lucide-react"
import { auth } from "@/auth"

export default async function ExamsPage() {
    const session = await auth()
    const userId = session?.user?.id

    const exams = await db.exam.findMany({
        include: {
            course: true,
            _count: {
                select: { questions: true }
            },
            results: {
                where: { userId: userId },
                orderBy: { createdAt: 'desc' },
                take: 1
            }
        }
    })

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold tracking-tight">Sınavlar ve Testler</h1>
                <p className="text-gray-500 dark:text-gray-400">
                    Bilginizi test edin ve yıldız kazanın.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {exams.map((exam: any) => {
                    const lastResult = exam.results[0]
                    const isPassed = lastResult?.score >= 70

                    return (
                        <div key={exam.id} className="rounded-xl border bg-card text-card-foreground shadow p-6 flex flex-col justify-between">
                            <div>
                                <h3 className="text-lg font-semibold flex items-center gap-2">
                                    <Trophy className="h-5 w-5 text-yellow-500" />
                                    {exam.title}
                                </h3>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Kurs: {exam.course.title}
                                </p>
                                <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
                                    <div className="flex items-center gap-1">
                                        <Clock className="h-4 w-4" />
                                        <span>{exam._count.questions} Soru</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6">
                                {lastResult ? (
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-sm font-medium">Son Puan:</span>
                                        <span className={`text-lg font-bold ${isPassed ? 'text-green-600' : 'text-red-500'}`}>
                                            {lastResult.score}%
                                        </span>
                                    </div>
                                ) : null}

                                <Link href={`/dashboard/exams/${exam.id}`}>
                                    <Button className="w-full" variant={lastResult ? "outline" : "default"}>
                                        {lastResult ? "Tekrar Çöz" : "Sınava Başla"}
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
