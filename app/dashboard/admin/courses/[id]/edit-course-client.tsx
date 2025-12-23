'use client'

import { useActionState, useState } from 'react'
import { updateCourse, createLesson, deleteLesson, updateLesson } from '@/app/actions/admin-actions'
import { Button } from '@/components/ui/button'
import { Loader2, Trash2, Plus, Edit2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

// --- Client Components ---

export function CourseEditForm({ course, categories }: { course: any, categories: any[] }) {
    const [state, formAction, isPending] = useActionState(async (prevState: any, formData: FormData) => {
        return await updateCourse(course.id, formData);
    }, undefined)

    return (
        <form action={formAction} className="space-y-4">
            <div className="space-y-2">
                <label className="text-sm font-medium">Kurs Başlığı</label>
                <input name="title" defaultValue={course.title} required className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Kategori</label>
                <select
                    name="categoryId"
                    defaultValue={course.categoryId || ""}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                    <option value="">Seçiniz</option>
                    {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                </select>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Açıklama</label>
                <textarea name="description" defaultValue={course.description || ''} className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium">Kapak Resmi (URL)</label>
                <input name="imageUrl" defaultValue={course.imageUrl || ''} placeholder="https://..." className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium">Fiyat (₺)</label>
                <input name="price" type="number" defaultValue={course.price} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
            </div>
            <Button type="submit" className="w-full" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Güncelle
            </Button>
            {state?.success && <p className="text-sm text-green-500 text-center">{state.success}</p>}
            {state?.error && <p className="text-sm text-red-500 text-center">{state.error}</p>}
        </form>
    )
}

export function LessonManager({ courseId, lessons }: { courseId: string, lessons: any[] }) {
    const router = useRouter()
    const [editingId, setEditingId] = useState<string | null>(null)

    // Create Lesson Logic
    const [createState, createAction, isCreating] = useActionState(async (prevState: any, formData: FormData) => {
        const res = await createLesson(courseId, formData)
        if (res.success) {
            router.refresh()
            return { success: "Eklendi" }
        }
        return res
    }, undefined)

    return (
        <div className="space-y-6">
            {/* List */}
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                {lessons.length === 0 && <p className="text-sm text-muted-foreground">Henüz ders yok.</p>}
                {lessons.map((lesson) => (
                    <div key={lesson.id} className="p-3 rounded-lg border bg-muted/50">
                        {editingId === lesson.id ? (
                            <LessonEditForm
                                lesson={lesson}
                                onCancel={() => setEditingId(null)}
                                onSuccess={() => {
                                    setEditingId(null)
                                    router.refresh()
                                }}
                            />
                        ) : (
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-background text-xs font-medium">
                                        {lesson.order}
                                    </span>
                                    <div className="truncate">
                                        <p className="text-sm font-medium truncate">{lesson.title}</p>
                                    </div>
                                </div>
                                <div className="flex gap-1">
                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-blue-500 hover:text-blue-600" onClick={() => setEditingId(lesson.id)}>
                                        <Edit2 className="h-4 w-4" />
                                    </Button>
                                    <form action={async () => {
                                        await deleteLesson(lesson.id)
                                        router.refresh()
                                    }}>
                                        <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500 hover:text-red-600">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Add New */}
            <div className="border-t pt-4">
                <h4 className="text-sm font-medium mb-3">Yeni Ders Ekle</h4>
                <form action={createAction} className="space-y-3">
                    <div className="grid grid-cols-4 gap-2">
                        <input name="order" type="number" placeholder="Sıra" defaultValue={lessons.length + 1} className="col-span-1 h-9 rounded-md border border-input bg-background px-3 py-1 text-sm" />
                        <input name="title" placeholder="Ders Başlığı" required className="col-span-3 h-9 rounded-md border border-input bg-background px-3 py-1 text-sm" />
                    </div>
                    <input name="videoUrl" placeholder="Video URL (YouTube/MP4)" required className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm" />

                    <Button type="submit" size="sm" className="w-full" disabled={isCreating}>
                        {isCreating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                        Ders Ekle
                    </Button>
                </form>
            </div>
        </div>
    )
}

function LessonEditForm({ lesson, onCancel, onSuccess }: { lesson: any, onCancel: () => void, onSuccess: () => void }) {
    const [state, formAction, isPending] = useActionState(async (prevState: any, formData: FormData) => {
        const res = await updateLesson(lesson.id, formData)
        if (res.success) {
            onSuccess()
            return { success: "Güncellendi" }
        }
        return res
    }, undefined)

    return (
        <form action={formAction} className="space-y-2">
            <div className="grid grid-cols-4 gap-2">
                <input name="order" type="number" defaultValue={lesson.order} className="col-span-1 h-8 rounded-md border border-input bg-background px-2 text-xs" />
                <input name="title" defaultValue={lesson.title} required className="col-span-3 h-8 rounded-md border border-input bg-background px-2 text-xs" />
            </div>
            <input name="videoUrl" defaultValue={lesson.videoUrl} required className="flex h-8 w-full rounded-md border border-input bg-background px-2 text-xs" />

            <div className="flex gap-2 justify-end">
                <Button type="button" variant="ghost" size="sm" onClick={onCancel} className="h-7 text-xs">İptal</Button>
                <Button type="submit" size="sm" className="h-7 text-xs" disabled={isPending}>
                    {isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : "Kaydet"}
                </Button>
            </div>
        </form>
    )
}

export function LearningOutcomeManager({ courseId, outcomes }: { courseId: string, outcomes: any[] }) {
    const router = useRouter()

    // Create Logic
    const [createState, createAction, isCreating] = useActionState(async (prevState: any, formData: FormData) => {
        const res = await import('@/app/actions/admin-actions').then(mod => mod.createLearningOutcome(courseId, formData))
        if (res.success) {
            router.refresh()
            // Reset form manually or by key if needed, simpler here
            return { success: "Eklendi" }
        }
        return res
    }, undefined)

    return (
        <div className="space-y-6">
            {/* List */}
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                {outcomes.length === 0 && <p className="text-sm text-muted-foreground">Henüz kazanım eklenmemiş.</p>}
                {outcomes.map((outcome) => (
                    <div key={outcome.id} className="p-3 rounded-lg border bg-muted/50 flex items-center justify-between">
                        <p className="text-sm font-medium">{outcome.text}</p>
                        <form action={async () => {
                            await import('@/app/actions/admin-actions').then(mod => mod.deleteLearningOutcome(outcome.id))
                            router.refresh()
                        }}>
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500 hover:text-red-600">
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </form>
                    </div>
                ))}
            </div>

            {/* Add New */}
            <div className="border-t pt-4">
                <h4 className="text-sm font-medium mb-3">Yeni Kazanım Ekle</h4>
                <form action={createAction} className="flex gap-2">
                    <input name="text" placeholder="Örn: React Hooklarını öğrenmek..." required className="flex-1 h-9 rounded-md border border-input bg-background px-3 py-1 text-sm" />
                    <Button type="submit" size="sm" disabled={isCreating}>
                        {isCreating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                    </Button>
                </form>
            </div>
        </div>
    )
}

export function EnrollmentManager({ courseId, enrollments }: { courseId: string, enrollments: any[] }) {
    const router = useRouter()

    return (
        <div className="space-y-6">
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                {enrollments.length === 0 && <p className="text-sm text-muted-foreground">Henüz kayıtlı öğrenci yok.</p>}
                {enrollments.map((enrollment) => (
                    <div key={enrollment.user.id} className="p-3 rounded-lg border bg-muted/50 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium">{enrollment.user.name}</p>
                            <p className="text-xs text-muted-foreground">{enrollment.user.email}</p>
                        </div>
                        <form action={async () => {
                            if (!confirm("Kullanıcının kurs erişimini kaldırmak istediğinize emin misiniz?")) return;

                            const res = await import('@/app/actions/admin-actions').then(mod => mod.removeEnrollment(courseId, enrollment.user.id));
                            if (res.error) {
                                alert(res.error);
                            } else {
                                router.refresh();
                            }
                        }}>
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500 hover:text-red-600" title="Erişimi Kaldır">
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </form>
                    </div>
                ))}
            </div>
            {enrollments.length > 0 && (
                <div className="text-xs text-muted-foreground mt-2 border-t pt-2">
                    Toplam {enrollments.length} öğrenci kayıtlı.
                </div>
            )}
        </div>
    )
}

export function MaterialManager({ courseId, materials }: { courseId: string, materials: any[] }) {
    const router = useRouter()

    // Create Logic
    const [createState, createAction, isCreating] = useActionState(async (prevState: any, formData: FormData) => {
        const res = await import('@/app/actions/admin-actions').then(mod => mod.createMaterial(courseId, formData))
        if (res.success) {
            router.refresh()
            return { success: "Eklendi" }
        }
        return res
    }, undefined)

    return (
        <div className="space-y-6">
            {/* List */}
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                {materials.length === 0 && <p className="text-sm text-muted-foreground">Henüz materyal eklenmemiş.</p>}
                {materials.map((material) => (
                    <div key={material.id} className="p-3 rounded-lg border bg-muted/50 flex items-center justify-between">
                        <div className="overflow-hidden">
                            <p className="text-sm font-medium truncate">{material.title}</p>
                            <a href={material.fileUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline truncate block">
                                {material.fileUrl}
                            </a>
                        </div>
                        <form action={async () => {
                            if (!confirm("Silmek istediğinize emin misiniz?")) return;
                            await import('@/app/actions/admin-actions').then(mod => mod.deleteMaterial(material.id))
                            router.refresh()
                        }}>
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500 hover:text-red-600">
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </form>
                    </div>
                ))}
            </div>

            {/* Add New */}
            <div className="border-t pt-4">
                <h4 className="text-sm font-medium mb-3">Yeni Materyal Ekle</h4>
                <form action={createAction} className="space-y-3">
                    <div className="grid gap-2">
                        <input name="title" placeholder="Materyal Başlığı" required className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm" />
                        <input name="fileUrl" placeholder="Dosya/Link URL" required className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm" />
                        <select name="type" className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm">
                            <option value="LINK">Link / URL</option>
                            <option value="PDF">PDF</option>
                            <option value="VIDEO">Video</option>
                            <option value="ZIP">Zip / Arşiv</option>
                        </select>
                    </div>

                    <Button type="submit" size="sm" className="w-full" disabled={isCreating}>
                        {isCreating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                        Ekle
                    </Button>
                </form>
            </div>
        </div>
    )
}
