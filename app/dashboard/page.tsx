import { auth } from "@/auth"

export default async function DashboardPage() {
    const session = await auth()

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold tracking-tight">Tekrar hoşgeldiniz, {session?.user?.name || "Öğrenci"}!</h1>
                <p className="text-gray-500 dark:text-gray-400">
                    Kaldığınız yerden devam edin.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {/* Placeholder for Course Cards */}
                <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
                    <h3 className="font-semibold leading-none tracking-tight">Son Aktiviteler</h3>
                    <p className="text-sm text-muted-foreground mt-2">Henüz bir aktivite yok.</p>
                </div>
            </div>
        </div>
    )
}
