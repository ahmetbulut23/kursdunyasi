'use client'

import { createExam } from "@/app/actions/exam-admin-actions"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { toast } from "sonner"

export function CreateExamDialog({ courses }: { courses: any[] }) {
    const router = useRouter()
    const [open, setOpen] = useState(false)
    const [isPending, startTransition] = useTransition()
    const [courseId, setCourseId] = useState("")

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const title = formData.get("title") as string

        if (!title || !courseId) {
            toast.error("Lütfen tüm alanları doldurun")
            return
        }

        startTransition(async () => {
            const res = await createExam(title, courseId)
            if (res.success) {
                toast.success("Sınav oluşturuldu")
                setOpen(false)
                router.refresh()
            } else {
                toast.error(res.error)
            }
        })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Yeni Sınav
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Yeni Sınav Oluştur</DialogTitle>
                    <DialogDescription>
                        Bir kursa bağlı yeni bir sınav oluşturun.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Sınav Başlığı</Label>
                        <Input id="title" name="title" placeholder="Örn: Modül 1 Değerlendirme" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="course">İlgili Kurs</Label>
                        <Select onValueChange={setCourseId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Kurs Seçin" />
                            </SelectTrigger>
                            <SelectContent>
                                {courses.map((c: any) => (
                                    <SelectItem key={c.id} value={c.id}>
                                        {c.title}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={isPending}>
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Oluştur
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
