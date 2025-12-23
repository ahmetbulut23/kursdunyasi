import { auth } from "@/auth"
import { getPackages, getUserPurchases } from "@/app/actions/purchase-actions"
import { PackageCard } from "@/components/package/package-card"

export default async function PackagesPage() {
    const session = await auth()
    const packages = await getPackages()

    let purchasedPackageIds: string[] = []
    if (session?.user?.id) {
        purchasedPackageIds = await getUserPurchases(session.user.id)
    }

    return (
        <div className="space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-4">
                <h1 className="text-3xl font-bold tracking-tight">Premium Paketler</h1>
                <p className="text-muted-foreground">
                    Eğitim yolculuğunuzda size en uygun paketi seçin ve tüm içeriklere sınırsız erişim sağlayın.
                </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
                {packages.map((pkg) => (
                    <PackageCard
                        key={pkg.id}
                        pkg={pkg}
                        isPurchased={purchasedPackageIds.includes(pkg.id)}
                    />
                ))}
            </div>
        </div>
    )
}
