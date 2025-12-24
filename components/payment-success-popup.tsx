'use client'

import { useEffect, useState } from "react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import confetti from "canvas-confetti"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CheckCircle, Trophy } from "lucide-react"

export function PaymentSuccessPopup() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()
    const [open, setOpen] = useState(false)

    useEffect(() => {
        if (searchParams.get("payment") === "success") {
            setOpen(true)

            // Fire Confetti
            const duration = 3000;
            const animationEnd = Date.now() + duration;
            const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

            const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

            const interval: any = setInterval(function () {
                const timeLeft = animationEnd - Date.now();

                if (timeLeft <= 0) {
                    return clearInterval(interval);
                }

                const particleCount = 50 * (timeLeft / duration);

                confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
                confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
            }, 250);
        }
    }, [searchParams])

    const handleClose = () => {
        setOpen(false)
        // Remove the query param properly without refresh
        const params = new URLSearchParams(searchParams.toString())
        params.delete("payment")
        router.replace(`${pathname}?${params.toString()}`)
    }

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mb-4">
                        <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <DialogTitle className="text-center text-xl">Ödeme Başarılı! 🎉</DialogTitle>
                    <DialogDescription className="text-center text-base">
                        Paketiniz hesabınıza başarıyla tanımlandı. Hemen öğrenmeye başlayabilirsiniz.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col items-center justify-center space-y-2 py-4">
                    <div className="flex items-center gap-2 p-3 bg-secondary/50 rounded-lg w-full justify-center">
                        <Trophy className="h-5 w-5 text-yellow-500" />
                        <span className="font-medium">Pro Özellikler Açıldı</span>
                    </div>
                </div>
                <DialogFooter className="sm:justify-center">
                    <Button onClick={handleClose} className="w-full sm:w-auto bg-green-600 hover:bg-green-700">
                        Harika! Başlayalım
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
