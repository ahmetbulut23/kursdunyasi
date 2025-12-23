import { auth } from "@/auth"
import { db } from "@/lib/db"
import { Star, Calendar, User as UserIcon, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { signOut } from "@/auth"
// Note: signOut is server-side action? No, typically client or via form action. 
// We'll Create a SignOutButton component or inline form.

export default async function ProfilePage() {
    const session = await auth()

    if (!session?.user?.id) return <div>Unauthorized</div>

    const user = await db.user.findUnique({
        where: { id: session.user.id },
        include: {
            results: {
                orderBy: { createdAt: 'desc' },
                take: 5,
                include: { exam: true }
            }
        }
    })

    if (!user) return <div>User not found</div>

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold tracking-tight">Profilim</h1>
                <p className="text-gray-500 dark:text-gray-400">
                    İlerlemenizi ve başarılarınızı takip edin.
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                {/* Main User Card */}
                <div className="md:col-span-1 space-y-6">
                    <div className="p-6 rounded-xl border bg-card flex flex-col items-center text-center">
                        <div className="h-24 w-24 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center mb-4">
                            <span className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                                {user.name?.[0]?.toUpperCase() || "U"}
                            </span>
                        </div>
                        <h2 className="text-xl font-bold">{user.name}</h2>
                        <p className="text-sm text-muted-foreground">{user.email}</p>

                        <div className="mt-4 flex items-center gap-2 bg-yellow-50 dark:bg-yellow-900/20 px-4 py-2 rounded-full border border-yellow-200 dark:border-yellow-800">
                            <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                            <span className="font-bold text-yellow-700 dark:text-yellow-400">{user.stars} Yıldız</span>
                        </div>

                        <div className="mt-6 w-full pt-6 border-t flex flex-col gap-2">
                            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                Katılma Tarihi: {new Date(user.createdAt).toLocaleDateString()}
                            </div>
                            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                                {user.role}
                            </div>

                            <form action={async () => {
                                'use server'
                                await import('@/app/actions/auth-actions').then(mod => mod.logout())
                            }} className="w-full mt-4">
                                <Button variant="destructive" className="w-full flex items-center gap-2">
                                    <LogOut className="h-4 w-4" />
                                    Çıkış Yap
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Activity / Stats */}
                <div className="md:col-span-2 space-y-6">
                    <div className="p-6 rounded-xl border bg-card">
                        <h3 className="font-semibold mb-4">Son Sınav Sonuçları</h3>
                        {user.results.length === 0 ? (
                            <p className="text-sm text-muted-foreground">Henüz sınava girilmedi.</p>
                        ) : (
                            <div className="space-y-4">
                                {user.results.map((res: any) => (
                                    <div key={res.id} className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                                        <div>
                                            <p className="font-medium">{res.exam.title}</p>
                                            <p className="text-xs text-muted-foreground">{new Date(res.createdAt).toLocaleDateString()}</p>
                                        </div>
                                        <div className={`font-bold ${res.score >= 70 ? 'text-green-600' : 'text-red-500'}`}>
                                            {res.score}%
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
