import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { PackageForm } from '../package-form'
import { auth } from '@/auth'

export default async function NewPackagePage() {
    const session = await auth()
    if ((session?.user as any)?.role !== "ADMIN") return <div>Yetkisiz Erişim</div>

    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/admin/packages">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <h1 className="text-2xl font-bold tracking-tight">Yeni Paket Oluştur</h1>
            </div>

            <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
                <PackageForm />
            </div>
        </div>
    )
}
