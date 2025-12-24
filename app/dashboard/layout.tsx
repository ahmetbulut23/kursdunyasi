import Link from "next/link"
import { BookOpen, Trophy, MessageCircle, User, Settings, Home, Shield } from "lucide-react"
import { auth } from "@/auth"

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await auth()
    const isAdmin = (session?.user as any)?.role === "ADMIN"

    return (
        <div className="flex h-screen w-full flex-col md:flex-row">
            {/* Desktop Sidebar */}
            <aside className="hidden w-64 border-r bg-primary text-primary-foreground md:block">
                <div className="flex h-14 items-center border-b border-primary-foreground/10 px-4">
                    <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
                        <span className="text-xl">Kurs Dunyasi</span>
                    </Link>
                </div>
                <nav className="grid gap-2 px-2 py-4 text-sm font-medium">
                    <Link
                        href="/dashboard/courses"
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-white"
                    >
                        <BookOpen className="h-4 w-4" />
                        Kurslar
                    </Link>
                    <Link
                        href="/dashboard/exams"
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-white"
                    >
                        <Trophy className="h-4 w-4" />
                        Sınavlar
                    </Link>
                    <Link
                        href="/dashboard/chat"
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-white"
                    >
                        <MessageCircle className="h-4 w-4" />
                        Sohbet
                    </Link>
                    <Link
                        href="/dashboard/packages"
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-white"
                    >
                        <Trophy className="h-4 w-4 text-yellow-300" />
                        Paketler
                    </Link>
                    <Link
                        href="/dashboard/profile"
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-white"
                    >
                        <User className="h-4 w-4" />
                        Profil
                    </Link>
                    {isAdmin && (
                        <>
                            <div className="my-2 border-t border-primary-foreground/10" />
                            <div className="px-3 py-2 text-xs font-semibold text-primary-foreground/60 uppercase tracking-wider">
                                Admin
                            </div>
                            <Link
                                href="/dashboard/admin/exams"
                                className="flex items-center gap-3 rounded-lg px-3 py-2 text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-white"
                            >
                                <Trophy className="h-4 w-4" />
                                Sınav Yönetimi
                            </Link>
                            className="flex items-center gap-3 rounded-lg px-3 py-2 text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-white"
                            >
                            <User className="h-4 w-4" />
                            Kullanıcılar
                        </Link>
                    <Link
                        href="/dashboard/admin/courses"
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-white"
                    >
                        <BookOpen className="h-4 w-4" />
                        Kurs Yönetimi
                    </Link>
                    <Link
                        href="/dashboard/admin/packages"
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-white"
                    >
                        <Trophy className="h-4 w-4 text-yellow-300" />
                        Paket Yönetimi
                    </Link>
                </>
                    )}
                <div className="my-2 border-t border-primary-foreground/10" />
                <Link
                    href="/"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-white"
                >
                    <BookOpen className="h-4 w-4" />
                    Anasayfa
                </Link>
                <form action={async () => {
                    'use server'
                    await import('@/app/actions/auth-actions').then(mod => mod.logout())
                }}>
                    <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-red-300 hover:bg-primary-foreground/10 hover:text-red-100">
                        <Settings className="h-4 w-4 rotate-180" />
                        Çıkış Yap
                    </button>
                </form>
            </nav>
        </aside>

            {/* Main Content */ }
    <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="flex h-16 items-center gap-4 bg-primary text-primary-foreground px-6 shadow-md md:hidden rounded-b-3xl">
            <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl">
                <span className="">Kurs Dünyası</span>
            </Link>
        </header>

        <main className="flex-1 overflow-auto p-4 md:p-6 bg-gray-50/50 dark:bg-background">
            {children}
        </main>

        {/* Mobile Bottom Nav */}
        <nav className="border-t-0 bg-primary text-primary-foreground md:hidden rounded-t-3xl shadow-[0_-5px_10px_rgba(0,0,0,0.1)] pb-2 pt-2">
            <div className="flex justify-around p-2 items-center">
                <Link
                    href="/"
                    className="flex flex-col items-center gap-1 rounded-full p-2 text-primary-foreground/70 hover:text-white hover:bg-white/10 transition-all"
                >
                    <Home className="h-6 w-6" />
                </Link>
                <Link
                    href="/dashboard/courses"
                    className="flex flex-col items-center gap-1 rounded-full p-2 text-primary-foreground/70 hover:text-white hover:bg-white/10 transition-all"
                >
                    <BookOpen className="h-6 w-6" />
                </Link>

                {/* Center FAB-like item if wanted, or just consistent sizing */}
                <Link
                    href="/dashboard/exams"
                    className="flex flex-col items-center gap-1 rounded-full p-2 text-primary-foreground/70 hover:text-white hover:bg-white/10 transition-all"
                >
                    <Trophy className="h-6 w-6" />
                </Link>

                <Link
                    href="/dashboard/chat"
                    className="flex flex-col items-center gap-1 rounded-full p-2 text-primary-foreground/70 hover:text-white hover:bg-white/10 transition-all"
                >
                    <MessageCircle className="h-6 w-6" />
                </Link>

                <Link
                    href="/dashboard/profile"
                    className="flex flex-col items-center gap-1 rounded-full p-2 text-primary-foreground/70 hover:text-white hover:bg-white/10 transition-all"
                >
                    <User className="h-6 w-6" />
                </Link>

                {isAdmin && (
                    <Link
                        href="/dashboard/admin/courses"
                        className="flex flex-col items-center gap-1 rounded-full p-2 text-red-300 hover:text-red-100 hover:bg-white/10 transition-all"
                    >
                        <Shield className="h-6 w-6" />
                    </Link>
                )}
            </div>
        </nav>
    </div>
        </div >
    )
}
