import { SeedPackagesButton } from "./seed-button"

export default async function AdminPackagesPage() {
    const session = await auth()
    if ((session?.user as any)?.role !== "ADMIN") {
        return <div>Yetkisiz Erişim</div>
    }

    const packages = await getAdminPackages()

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Paket Yönetimi</h1>
                    <p className="text-gray-500 dark:text-gray-400">
                        Paketleri oluşturun, fiyatlarını ve özelliklerini düzenleyin.
                    </p>
                </div>
                <div className="flex gap-2">
                    <SeedPackagesButton />
                    <Link href="/dashboard/admin/packages/new">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Yeni Paket Ekle
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="rounded-xl border bg-card text-card-foreground shadow">
                <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                        <thead className="[&_tr]:border-b">
                            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Paket Adı</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Fiyat</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Dahil Kurslar</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Satış</th>
                                <th className="h-12 px-4 text-center align-middle font-medium text-muted-foreground">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                            {packages.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="p-4 text-center text-muted-foreground">
                                        Henüz paket yok.
                                    </td>
                                </tr>
                            )}
                            {packages.map((pkg: any) => (
                                <tr key={pkg.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                    <td className="p-4 align-middle font-medium">{pkg.name}</td>
                                    <td className="p-4 align-middle">₺{pkg.price}</td>
                                    <td className="p-4 align-middle">{pkg.courses.length} Kurs</td>
                                    <td className="p-4 align-middle">{pkg._count.purchases}</td>
                                    <td className="p-4 align-middle">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link href={`/dashboard/admin/packages/${pkg.id}`}>
                                                <Button variant="outline" size="sm">
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    Düzenle
                                                </Button>
                                            </Link>
                                            <form action={async () => {
                                                'use server'
                                                await deletePackage(pkg.id)
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
