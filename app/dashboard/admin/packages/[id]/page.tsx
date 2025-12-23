import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { PackageForm } from '../package-form'
import { auth } from '@/auth'
import { db } from '@/lib/db'

export default async function EditPackagePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const session = await auth()
    if ((session?.user as any)?.role !== "ADMIN") return <div>Yetkisiz Erişim</div>

    const pkg = await db.package.findUnique({ where: { id } })
    if (!pkg) return <div>Paket bulunamadı</div>

    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/admin/packages">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <h1 className="text-2xl font-bold tracking-tight">Paket Düzenle</h1>
            </div>

            <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
                <PackageForm pkg={pkg} />
            </div>
        </div>
    )
}
