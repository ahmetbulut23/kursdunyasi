'use client'

import { useActionState, useState } from 'react'
import { createPackage, updatePackage } from '@/app/actions/admin-actions'
import { Button } from '@/components/ui/button'
import { Loader2, Plus, Trash2, Check } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function PackageForm({ pkg }: { pkg?: any }) {
    const router = useRouter()
    // Initialize features state
    const [features, setFeatures] = useState<string[]>(
        pkg?.features ? pkg.features.split('\n') : ['']
    )

    const [state, formAction, isPending] = useActionState(async (prevState: any, formData: FormData) => {
        let result;
        if (pkg) {
            result = await updatePackage(pkg.id, formData);
        } else {
            result = await createPackage(formData);
        }

        if (result.success) {
            router.push('/dashboard/admin/packages');
            router.refresh();
        }
        return result;
    }, undefined)

    const handleAddFeature = () => {
        setFeatures([...features, ''])
    }

    const handleFeatureChange = (index: number, value: string) => {
        const newFeatures = [...features]
        newFeatures[index] = value
        setFeatures(newFeatures)
    }

    const handleRemoveFeature = (index: number) => {
        if (features.length === 1) {
            setFeatures([''])
            return
        }
        const newFeatures = features.filter((_, i) => i !== index)
        setFeatures(newFeatures)
    }

    return (
        <form action={formAction} className="space-y-4">
            <div className="space-y-2">
                <label className="text-sm font-medium">Paket Adı</label>
                <input name="name" defaultValue={pkg?.name || ''} required className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="Örn: Premium Paket" />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Açıklama</label>
                <textarea name="description" defaultValue={pkg?.description || ''} className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="Kısa açıklama..." />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Özellikler</label>
                <div className="space-y-3 border rounded-lg p-4 bg-muted/20">
                    <p className="text-xs text-muted-foreground mb-2">Paket kartında yeşil tik <span className="inline-flex align-middle"><Check className="h-3 w-3 text-green-500" /></span> ile görünecek özellikleri ekleyin.</p>

                    {features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100 border border-green-200">
                                <Check className="h-4 w-4 text-green-600" />
                            </div>
                            <input
                                value={feature}
                                onChange={(e) => handleFeatureChange(index, e.target.value)}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                placeholder={`Özellik ${index + 1} (Örn: Sınırsız Erişim)`}
                            />
                            {features.length > 0 && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleRemoveFeature(index)}
                                    className="text-red-400 hover:text-red-500 hover:bg-red-50"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    ))}
                    <Button type="button" variant="outline" size="sm" onClick={handleAddFeature} className="mt-2">
                        <Plus className="mr-2 h-4 w-4" /> Yeni Özellik Ekle
                    </Button>
                </div>
                {/* Hidden input to pass data to server action */}
                <input type="hidden" name="features" value={features.filter(f => f.trim() !== '').join('\n')} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2 border p-4 rounded-lg bg-muted/50">
                    <input
                        type="checkbox"
                        id="enableInstructorChat"
                        name="enableInstructorChat"
                        defaultChecked={pkg?.enableInstructorChat || false}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <label htmlFor="enableInstructorChat" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Eğitmenle Sohbet (Instructor)
                    </label>
                </div>
                <div className="flex items-center space-x-2 border p-4 rounded-lg bg-muted/50">
                    <input
                        type="checkbox"
                        id="enableUserChat"
                        name="enableUserChat"
                        defaultChecked={pkg?.enableUserChat || false}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <label htmlFor="enableUserChat" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Topluluk Sohbeti (Students)
                    </label>
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Kurs Limiti</label>
                <input
                    name="courseLimit"
                    type="number"
                    min="1"
                    defaultValue={pkg?.courseLimit || ''}
                    placeholder="Boş bırakılırsa sınırsız"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
                <p className="text-xs text-muted-foreground">Kullanıcının kaç kursa kayıt olabileceğini belirler. Sınırsız için boş bırakın.</p>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Fiyat (₺)</label>
                <input name="price" type="number" step="0.01" defaultValue={pkg?.price || 0} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
            </div>

            <div className="pt-4">
                <Button type="submit" className="w-full" disabled={isPending}>
                    {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {pkg ? 'Güncelle' : 'Oluştur'}
                </Button>
            </div>

            {state?.error && <p className="text-sm text-red-500 text-center">{state.error}</p>}
        </form>
    )
}
