import { auth } from "@/auth"
import { getAdminPackages } from "@/app/data/admin-data"
import { Button } from "@/components/ui/button"
import { Plus, Edit } from "lucide-react"
import Link from "next/link"
import { SeedPackagesButton } from "./seed-button"
import { DeletePackageButton } from "./delete-button"
const session = await auth()
if ((session?.user as any)?.role !== "ADMIN") {
    return <div>Yetkisiz Erişim</div>
}

let packages: any[] = []
let error = null

try {
    packages = await getAdminPackages()
    // Ensure serialization safety - though Float works, explicit JSON parse/stringify can cure hidden non-serializable objects
    packages = JSON.parse(JSON.stringify(packages))

    if (!Array.isArray(packages)) {
        console.error("Packages is not an array:", packages)
        packages = []
    }
} catch (err) {
    console.error("Failed to fetch packages:", err)
    error = "Paketler yüklenirken bir hata oluştu."
}

if (error) {
    return <div className="p-4 text-red-500 bg-red-50 rounded-lg">{error}</div>
}

try {
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
                            {packages.map((pkg: any) => {
                                if (!pkg || !pkg.id) return null;
                                return (
                                    <tr key={pkg.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                        <td className="p-4 align-middle font-medium">{pkg.name || "İsimsiz"}</td>
                                        <td className="p-4 align-middle">₺{pkg.price || 0}</td>
                                        <td className="p-4 align-middle">{pkg.courses?.length || 0} Kurs</td>
                                        <td className="p-4 align-middle">{pkg._count?.purchases || 0}</td>
                                        <td className="p-4 align-middle">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link href={`/dashboard/admin/packages/${pkg.id}`}>
                                                    <Button variant="outline" size="sm">
                                                        <Edit className="mr-2 h-4 w-4" />
                                                        Düzenle
                                                    </Button>
                                                </Link>
                                                <DeletePackageButton packageId={pkg.id} />
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
} catch (renderError) {
    console.error("Render Error:", renderError);
    return <div className="p-4 text-red-500">Render sırasında bir hata oluştu.</div>
}
}

