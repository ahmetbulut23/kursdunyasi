'use client'

import { createPackage } from "@/app/actions/admin-actions"
import { Button } from "@/components/ui/button"
import { Loader2, PlusCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { toast } from "sonner"

export function SeedPackagesButton() {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()

    const handleSeed = () => {
        const packages = [
            {
                name: 'Başlangıç Paketi',
                description: 'Tek bir kursa odaklanmak isteyenler için ideal.',
                price: 150.00,
                features: '[{"text":"1 Kurs Hakkı","valid":true},{"text":"Temel Derslere Erişim","valid":true},{"text":"Sertifika","valid":true},{"text":"Eğitmen Desteği","valid":false}]',
                courseLimit: '1',
                enableUserChat: false,
                enableInstructorChat: false
            },
            {
                name: 'Standart Paket',
                description: 'Birden fazla alanda kendini geliştirmek isteyenler için.',
                price: 350.00,
                features: '[{"text":"5 Kurs Hakkı","valid":true},{"text":"Öğrenci Topluluğu","valid":true},{"text":"Sertifika","valid":true},{"text":"Eğitmen Desteği","valid":false},{"text":"Tüm Materyaller","valid":true}]',
                courseLimit: '5',
                enableUserChat: true,
                enableInstructorChat: false
            },
            {
                name: 'Pro Üyelik',
                description: 'Sınırsız öğrenme ve eğitmen desteği ile kariyerinizi zirveye taşıyın.',
                price: 750.00,
                features: '[{"text":"Sınırsız Kurs","valid":true},{"text":"Eğitmenle Sohbet","valid":true},{"text":"Öncelikli Destek","valid":true},{"text":"Kariyer Danışmanlığı","valid":true},{"text":"VIP Topluluk","valid":true}]',
                courseLimit: '',
                enableUserChat: true,
                enableInstructorChat: true
            }
        ];

        startTransition(async () => {
            let count = 0;
            for (const pkg of packages) {
                const formData = new FormData()
                formData.append('name', pkg.name)
                formData.append('description', pkg.description)
                formData.append('price', pkg.price.toString())
                formData.append('features', pkg.features)
                formData.append('courseLimit', pkg.courseLimit)
                if (pkg.enableUserChat) formData.append('enableUserChat', 'on')
                if (pkg.enableInstructorChat) formData.append('enableInstructorChat', 'on')

                const res = await createPackage(formData)
                if (res.success) count++
            }

            if (count > 0) {
                toast.success(`${count} paket oluşturuldu`)
                router.refresh()
            } else {
                toast.error("Paketler oluşturulamadı veya zaten var")
            }
        })
    }

    return (
        <Button onClick={handleSeed} disabled={isPending} variant="outline" className="gap-2">
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <PlusCircle className="h-4 w-4" />}
            Varsayılan Paketleri Yükle
        </Button>
    )
}
