'use client'

import { addQuestion, bulkAddQuestions, deleteQuestion } from "@/app/actions/exam-admin-actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Trash2, Plus, FileText, CheckCircle, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { toast } from "sonner"

export function ExamEditor({ exam }: { exam: any }) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()

    // Single Question State
    const [qText, setQText] = useState("")
    const [options, setOptions] = useState(["", "", "", ""])
    const [correct, setCorrect] = useState("")

    // Bulk Upload State
    const [bulkText, setBulkText] = useState("")
    const [parsedQuestions, setParsedQuestions] = useState<any[]>([])

    const handleSingleAdd = async () => {
        if (!qText || options.some(o => !o) || !correct) {
            toast.error("Lütfen tüm alanları doldurun")
            return
        }

        startTransition(async () => {
            const res = await addQuestion(exam.id, {
                text: qText,
                options: options,
                correctAnswer: correct
            })
            if (res.success) {
                toast.success("Soru eklendi")
                setQText("")
                setOptions(["", "", "", ""])
                setCorrect("")
                router.refresh()
            } else {
                toast.error(res.error)
            }
        })
    }

    const handleDelete = (id: string) => {
        if (!confirm("Bu soruyu silmek istediğinize emin misiniz?")) return
        startTransition(async () => {
            const res = await deleteQuestion(id)
            if (res.success) {
                toast.success("Soru silindi")
                router.refresh()
            }
        })
    }

    // --- BULK PARSER LOGIC ---
    const parseBulkText = () => {
        const lines = bulkText.split('\n').filter(line => line.trim() !== '')
        const questions: any[] = []
        let currentQ: any = null

        // Regex helpers
        // Detect "1. Question", "Question 1:", "1- Question" etc.
        const qRegex = /^(\d+)[\.\-\)]\s+(.+)/
        // Detect "A) Option", "A. Option", "a) Option"
        const optRegex = /^([a-dA-D])[\.\)]\s+(.+)/
        // Detect "Answer: A", "Cevap: A", "Doğru Cevap: A"
        const ansRegex = /^(?:Cevap|Answer|Doğru Cevap|Yanıt)[\s\:]+([a-dA-D])/i

        for (const line of lines) {
            const cleanLine = line.trim()

            // 1. Check if it's a new question
            const qMatch = cleanLine.match(qRegex)
            if (qMatch) {
                // Save previous question
                if (currentQ) questions.push(currentQ)

                currentQ = {
                    text: qMatch[2],
                    options: [], // raw options
                    tempOptions: {}, // map A->text
                    correctAnswer: ''
                }
                continue
            }

            // 2. Check if it's an option (only if inside a question)
            const optMatch = cleanLine.match(optRegex)
            if (currentQ && optMatch) {
                const letter = optMatch[1].toUpperCase()
                const text = optMatch[2]

                // We'll store it in a standard array later
                currentQ.tempOptions[letter] = text
                continue
            }

            // 3. Check if it's an answer
            const ansMatch = cleanLine.match(ansRegex)
            if (currentQ && ansMatch) {
                const letter = ansMatch[1].toUpperCase()
                // Convert letter to actual text if possible, or just store letter?
                // Our schema stores options as array ["Option1", "Option2"]
                // And correct answer as the text "Option1" or index?
                // Schema: correctAnswer: String.
                // Looking at seed.ts/page.tsx, it seems we store the *Answer Text* as the correct answer?
                // Let's verify existing exam behavior. 
                // Ah, looking at `exam-client.tsx`:
                // answers[q.id] === option. So we invoke `handleSelect(q.id, option)` where option is the string text.
                // So correctAnswer MUST match the option text exactly.

                currentQ.correctAnswerLetter = letter
                continue
            }

            // If just text and we are in a question, maybe append to question text? (Multiline question)
            // For MVP simplicity, assume single line question or manual fix
        }
        // Push last one
        if (currentQ) questions.push(currentQ)

        // Validate and Format
        const validQs = questions.map(q => {
            // Convert map A..D to array
            // We assume standard A,B,C,D order usually
            const opts = [
                q.tempOptions['A'],
                q.tempOptions['B'],
                q.tempOptions['C'],
                q.tempOptions['D']
            ].filter(Boolean) // Remove undefined

            // Find correct text
            let correctText = ""
            if (q.correctAnswerLetter) {
                correctText = q.tempOptions[q.correctAnswerLetter] || ""
            }

            return {
                text: q.text,
                options: opts,
                correctAnswer: correctText,
                isValid: q.text && opts.length >= 2 && correctText
            }
        })

        setParsedQuestions(validQs)
    }

    const saveBulk = async () => {
        const validOnes = parsedQuestions.filter(q => q.isValid)
        if (validOnes.length === 0) return

        startTransition(async () => {
            const res = await bulkAddQuestions(exam.id, validOnes)
            if (res.success) {
                toast.success(res.success)
                setBulkText("")
                setParsedQuestions([])
                router.refresh()
            } else {
                toast.error(res.error)
            }
        })
    }

    return (
        <div className="grid lg:grid-cols-2 gap-8 h-full">
            {/* Left: Editor */}
            <div className="space-y-6">
                <Tabs defaultValue="single">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="single">Tek Soru Ekle</TabsTrigger>
                        <TabsTrigger value="bulk">Toplu Yükle (Word)</TabsTrigger>
                    </TabsList>

                    <TabsContent value="single" className="space-y-4 border rounded-xl p-4 bg-card mt-4">
                        <div className="space-y-2">
                            <Label>Soru Metni</Label>
                            <Textarea placeholder="Soru buraya..." value={qText} onChange={e => setQText(e.target.value)} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {options.map((opt, i) => (
                                <div key={i} className="space-y-2">
                                    <Label>Seçenek {String.fromCharCode(65 + i)}</Label>
                                    <Input
                                        value={opt}
                                        onChange={e => {
                                            const newOps = [...options]
                                            newOps[i] = e.target.value
                                            setOptions(newOps)
                                        }}
                                        placeholder={`Seçenek ${String.fromCharCode(65 + i)}`}
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="space-y-2">
                            <Label>Doğru Cevap</Label>
                            <Select onValueChange={setCorrect} value={correct}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Seçiniz" />
                                </SelectTrigger>
                                <SelectContent>
                                    {options.map((opt, i) => opt && (
                                        <SelectItem key={i} value={opt}>
                                            {String.fromCharCode(65 + i)}) {opt.substring(0, 20)}...
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <Button onClick={handleSingleAdd} disabled={isPending} className="w-full">
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Soruyu Kaydet
                        </Button>
                    </TabsContent>

                    <TabsContent value="bulk" className="space-y-4 border rounded-xl p-4 bg-card mt-4">
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg text-xs text-blue-800 dark:text-blue-200">
                            <strong>Format:</strong><br />
                            1. Başkent neresidir?<br />
                            A) İstanbul<br />
                            B) Ankara<br />
                            C) İzmir<br />
                            D) Bursa<br />
                            Cevap: B
                        </div>
                        <Textarea
                            className="min-h-[300px] font-mono text-xs"
                            placeholder="Soruları buraya yapıştırın..."
                            value={bulkText}
                            onChange={e => setBulkText(e.target.value)}
                        />
                        <Button onClick={parseBulkText} variant="secondary" className="w-full">
                            Analiz Et / Önizle
                        </Button>

                        {parsedQuestions.length > 0 && (
                            <div className="space-y-2">
                                <Label className="text-muted-foreground">{parsedQuestions.filter(q => q.isValid).length} geçerli soru bulundu</Label>
                                <div className="max-h-[200px] overflow-y-auto space-y-2 text-xs border p-2 rounded">
                                    {parsedQuestions.map((q, i) => (
                                        <div key={i} className={`p-2 rounded ${q.isValid ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
                                            <div className="font-bold truncate">{i + 1}. {q.text}</div>
                                            <div className="text-muted-foreground">{q.options.length} şık, Cevap: {q.correctAnswer || "YOK"}</div>
                                        </div>
                                    ))}
                                </div>
                                <Button onClick={saveBulk} disabled={isPending || parsedQuestions.filter(q => q.isValid).length === 0} className="w-full">
                                    {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Onayla ve Kaydet
                                </Button>
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </div>

            {/* Right: Preview List */}
            <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-200px)]">
                <h3 className="font-semibold flex items-center gap-2">
                    <FileText className="h-5 w-5" /> Mevcut Sorular ({exam.questions.length})
                </h3>
                {exam.questions.length === 0 && (
                    <div className="text-muted-foreground text-center py-10 border rounded-xl border-dashed">
                        Henüz soru eklenmemiş.
                    </div>
                )}
                {exam.questions.map((q: any, i: number) => {
                    let parsedOptions: string[] = []
                    try { parsedOptions = JSON.parse(q.options) } catch (e) { }

                    return (
                        <Card key={q.id} className="relative group">
                            <CardHeader className="py-3">
                                <CardTitle className="text-sm font-medium">
                                    <span className="text-muted-foreground mr-2">{i + 1}.</span>
                                    {q.text}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="py-2 text-xs space-y-1">
                                {parsedOptions.map((opt, idx) => (
                                    <div key={idx} className={`flex items-center gap-2 ${opt === q.correctAnswer ? 'text-green-600 font-bold' : 'text-muted-foreground'}`}>
                                        <div className={`h-4 w-4 rounded-full border flex items-center justify-center text-[10px] ${opt === q.correctAnswer ? 'border-green-600 bg-green-100' : ''}`}>
                                            {String.fromCharCode(65 + idx)}
                                        </div>
                                        {opt}
                                    </div>
                                ))}
                            </CardContent>
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => handleDelete(q.id)}>
                                    <Trash2 className="h-3 w-3" />
                                </Button>
                            </div>
                        </Card>
                    )
                })}
            </div>
        </div>
    )
}
