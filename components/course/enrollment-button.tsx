'use client'

import { checkEnrollmentStatus, enrollInCourse } from "@/app/actions/enrollment-actions"
import { buyCourse } from "@/app/actions/purchase-actions"
import { Button } from "@/components/ui/button"
import { Loader2, Lock, PlayCircle, Plus, ShoppingCart } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState, useTransition } from "react"

export function EnrollmentButton({ courseId, price }: { courseId: string, price: number }) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [status, setStatus] = useState<{ isEnrolled: boolean, canEnroll: boolean, error?: string } | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        checkEnrollmentStatus(courseId).then(res => {
            setStatus(res)
            setLoading(false)
        })
    }, [courseId])

    const handleEnroll = () => {
        startTransition(async () => {
            const res = await enrollInCourse(courseId)
            if (res.success) {
                setStatus(prev => ({ ...prev!, isEnrolled: true }))
                router.refresh()
            } else if (res.error) {
                alert(res.error) // Simple alert for MVP
            }
        })
    }

    if (loading) return <Button disabled variant="outline" size="lg" className="w-full">Yükleniyor...</Button>

    if (status?.isEnrolled) {
        return (
            <div className="w-full">
                <Button variant="secondary" size="lg" className="w-full bg-green-100 text-green-800 hover:bg-green-200 border-green-200">
                    <PlayCircle className="mr-2 h-5 w-5" />
                    Kursa Devam Et
                </Button>
                <p className="text-xs text-center mt-2 text-green-700">Kayıtlısınız</p>
            </div>
        )
    }

    if (!status?.canEnroll && !status?.isEnrolled && (status?.error === "Limit reached" || status?.error === "No package")) {
        return (
            <div className="w-full space-y-3">
                <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg text-amber-800 text-xs text-center">
                    <p className="font-semibold mb-1">Paket Limiti Doldu / Paket Yok</p>
                    <p>Paketinizden düşmeden bu kursu tek başına satın alabilirsiniz.</p>
                </div>
                <BuyCourseButton courseId={courseId} price={price} />
            </div>
        )
    }


    return (
        <div className="w-full">
            <Button onClick={handleEnroll} disabled={isPending} size="lg" className="w-full">
                {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                Kursa Kayıt Ol (Kredi Kullan)
            </Button>
            <p className="text-xs text-center mt-2 text-muted-foreground">Kayıt limitinizden 1 kredi düşer.</p>
        </div>
    )
}

function BuyCourseButton({ courseId, price }: { courseId: string, price: number }) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()

    const handleBuy = () => {
        startTransition(async () => {
            const res = await buyCourse(courseId)
            if (res.success) {
                router.refresh()
            } else if (res.redirectUrl) {
                window.location.href = res.redirectUrl
            } else {
                alert(res.error)
            }
        })
    }

    return (
        <Button onClick={handleBuy} disabled={isPending} variant="outline" size="lg" className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground">
            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ShoppingCart className="mr-2 h-4 w-4" />}
            Tek Seferlik Satın Al (₺{price})
        </Button>
    )
}
