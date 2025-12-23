'use client'

import { useActionState } from 'react'
import { createCourse } from '@/app/actions/admin-actions'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function CreateCourseForm({ categories }: { categories: any[] }) {
    const router = useRouter()
    const [state, formAction, isPending] = useActionState(async (prevState: any, formData: FormData) => {
        const result = await createCourse(formData);
        if (result.success) {
            router.push('/dashboard/admin/courses');
        }
        return result;
    }, undefined)

    return (
        <form action={formAction} className="space-y-4">
            <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium leading-none">Kurs Başlığı</label>
                <input
                    id="title"
                    name="title"
                    required
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    placeholder="Örn: İleri Seviye Next.js"
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="categoryId" className="text-sm font-medium leading-none">Kategori</label>
                <select
                    id="categoryId"
                    name="categoryId"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    defaultValue=""
                >
                    <option value="" disabled>Kategori Seçin</option>
                    {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                </select>
            </div>

            <div className="space-y-2">
                <label htmlFor="imageUrl" className="text-sm font-medium leading-none">Kapak Resmi (URL)</label>
                <input
                    id="imageUrl"
                    name="imageUrl"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    placeholder="https://..."
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium leading-none">Açıklama</label>
                <textarea
                    id="description"
                    name="description"
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    placeholder="Kurs içeriği hakkında kısa bilgi..."
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="price" className="text-sm font-medium leading-none">Fiyat (₺)</label>
                <input
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    defaultValue="0"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
                <p className="text-xs text-muted-foreground">0 = Ücretsiz</p>
            </div>

            <div className="pt-4">
                <Button type="submit" className="w-full" disabled={isPending}>
                    {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Kurs Oluştur
                </Button>
            </div>

            {state?.error && <p className="text-sm text-red-500 text-center">{state.error}</p>}
        </form>
    )
}
