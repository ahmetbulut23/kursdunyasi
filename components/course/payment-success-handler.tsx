'use client'

import { useEffect, useState } from "react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { Check, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import confetti from "canvas-confetti"

export function PaymentSuccessHandler() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        if (searchParams.get("payment") === "success") {
            setIsOpen(true)
            // Fire confetti
            const duration = 3 * 1000;
            const animationEnd = Date.now() + duration;
            const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

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
        setIsOpen(false)
        const params = new URLSearchParams(searchParams.toString())
        params.delete("payment")
        router.replace(`${pathname}?${params.toString()}`, { scroll: false })
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={handleClose}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white p-6 shadow-2xl dark:bg-zinc-900 border text-center"
                    >
                        <div className="absolute right-4 top-4">
                            <button onClick={handleClose} className="rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                <X className="h-4 w-4 text-gray-500" />
                            </button>
                        </div>

                        <div className="flex flex-col items-center gap-4 py-4">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                                className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30 ring-8 ring-green-50 dark:ring-green-900/10"
                            >
                                <Check className="h-10 w-10 text-green-600 dark:text-green-400" strokeWidth={3} />
                            </motion.div>

                            <div className="space-y-2">
                                <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                    Ödeme Başarılı!
                                </h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Kurs paketiniz hesabınıza başarıyla tanımlanmıştır. Öğrenme yolculuğunuzda başarılar dileriz!
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-center">
                            <Button onClick={handleClose} className="w-full sm:w-auto min-w-[150px] bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/20">
                                Harika, Başlayalım
                            </Button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}
