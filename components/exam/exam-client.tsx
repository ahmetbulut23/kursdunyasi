'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { submitExam } from '@/app/actions/exam-actions'
import { Button } from '@/components/ui/button'
import { Loader2, CheckCircle, XCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'

interface Question {
    id: string
    text: string
    options: string[] // Parsed from JSON in parent
}

interface ExamProps {
    id: string
    title: string
    questions: Question[]
}

// Client Component for interactivity
export default function ExamClient({ exam }: { exam: ExamProps }) {
    const router = useRouter()
    const [answers, setAnswers] = useState<Record<string, string>>({})
    const [result, setResult] = useState<{ success: boolean, score?: number } | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSelect = (questionId: string, option: string) => {
        if (result) return // Disable after submission
        setAnswers(prev => ({ ...prev, [questionId]: option }))
    }

    const handleSubmit = async () => {
        setIsSubmitting(true)
        const res = await submitExam(exam.id, answers)
        setIsSubmitting(false)

        if (res?.success) {
            setResult(res)
            if (res.score && res.score >= 70) {
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 }
                })
            }
        }
    }

    const allAnswered = exam.questions.every(q => answers[q.id])

    if (result) {
        return (
            <div className="flex flex-col items-center justify-center p-8 space-y-6 bg-card rounded-xl shadow border text-center">
                <h2 className="text-3xl font-bold">Sınav Tamamlandı!</h2>
                <div className="text-6xl font-black text-indigo-600 dark:text-indigo-400">
                    {result.score}%
                </div>
                <p className="text-muted-foreground">
                    {result.score! >= 70 ? "Tebrikler! Geçtiniz." : "Çalışmaya devam edin ve tekrar deneyin."}
                </p>
                <Button onClick={() => router.push('/dashboard/exams')}>
                    Sınavlara Dön
                </Button>
            </div>
        )
    }

    return (
        <div className="space-y-8 max-w-3xl mx-auto">
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold">{exam.title}</h1>
                <p className="text-muted-foreground">{exam.questions.length} Soru</p>
            </div>

            <div className="space-y-6">
                {exam.questions.map((q, idx) => (
                    <motion.div
                        key={q.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="p-6 rounded-xl border bg-card"
                    >
                        <h3 className="font-semibold text-lg mb-4">{idx + 1}. {q.text}</h3>
                        <div className="grid gap-3">
                            {q.options.map((option) => (
                                <div
                                    key={option}
                                    onClick={() => handleSelect(q.id, option)}
                                    className={`p-4 rounded-lg border cursor-pointer transition-all flex items-center justify-between
                                ${answers[q.id] === option
                                            ? 'bg-indigo-50 border-indigo-500 ring-1 ring-indigo-500 dark:bg-indigo-900/30'
                                            : 'hover:bg-slate-50 dark:hover:bg-slate-800'
                                        }
                            `}
                                >
                                    <span>{option}</span>
                                    {answers[q.id] === option && <CheckCircle className="h-5 w-5 text-indigo-600" />}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="flex justify-end pt-6">
                <Button
                    size="lg"
                    onClick={handleSubmit}
                    disabled={!allAnswered || isSubmitting}
                    className="w-full md:w-auto"
                >
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Sınavı Gönder
                </Button>
            </div>
        </div>
    )
}
