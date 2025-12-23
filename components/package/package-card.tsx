'use client'

import { purchasePackage } from "@/app/actions/purchase-actions"
import { Button } from "@/components/ui/button"
import { Check, Loader2 } from "lucide-react"
import { useActionState } from "react"
import { useRouter } from "next/navigation"

export function PackageCard({ pkg, isPurchased }: { pkg: any, isPurchased: boolean }) {
    const router = useRouter()
    const [state, action, isPending] = useActionState(async () => {
        const res = await purchasePackage(pkg.id)
        if (res.redirectUrl) {
            window.location.href = res.redirectUrl
        } else if (res.success) {
            // Backward compatibility if any action returns success without redirect (e.g. mock free package)
            router.refresh()
        }
        return res
    }, undefined)

    return (
        <div className="border rounded-2xl p-6 shadow-sm bg-card hover:shadow-md transition-shadow relative overflow-hidden">
            {isPurchased && (
                <div className="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-bl-xl">
                    SATIN ALINDI
                </div>
            )}
            <h3 className="text-xl font-bold">{pkg.name}</h3>
            <p className="text-muted-foreground mt-2 text-sm min-h-[40px]">{pkg.description}</p>

            <div className="my-6">
                <span className="text-3xl font-bold">₺{pkg.price}</span>
            </div>

            <div className="space-y-3 mb-6">
                {pkg.features ? (
                    pkg.features.split('\n').map((feature: string, idx: number) => (
                        <div key={idx} className="flex gap-2 text-sm">
                            <Check className="h-5 w-5 text-green-500 shrink-0" />
                            <span>{feature}</span>
                        </div>
                    ))
                ) : (
                    <div className="flex gap-2 text-sm">
                        <Check className="h-5 w-5 text-green-500 shrink-0" />
                        <span>Tüm içeriklere erişim</span>
                    </div>
                )}
            </div>

            <form action={action}>
                <Button className="w-full" disabled={isPurchased || isPending} variant={isPurchased ? "outline" : "default"}>
                    {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : isPurchased ? "Kullanımda" : "Satın Al & Kilidi Aç"}
                </Button>
            </form>
            {state?.error && <p className="text-red-500 text-sm mt-2 text-center">{state.error}</p>}
            {state?.success && <p className="text-green-500 text-sm mt-2 text-center">İşlem başarılı</p>}
        </div>
    )
}
