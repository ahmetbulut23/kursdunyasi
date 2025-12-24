'use client'

import { deletePackage } from "@/app/actions/admin-actions"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { toast } from "sonner"

export function DeletePackageButton({ packageId }: { packageId: string }) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()

    const handleDelete = () => {
        if (!confirm("Bu paketi silmek istediğinize emin misiniz?")) return

        startTransition(async () => {
            try {
                const res = await deletePackage(packageId)
                if (res.success) {
                    toast.success("Paket silindi")
                    router.refresh()
                } else {
                    toast.error(res.error || "Silme işlemi başarısız")
                }
            } catch (err) {
                toast.error("Bir hata oluştu")
            }
        })
    }

    return (
        <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            disabled={isPending}
        >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Sil</span>
        </Button>
    )
}
