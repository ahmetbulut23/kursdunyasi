'use server'

import { auth } from "@/auth"
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function enrollInCourse(courseId: string) {
    const session = await auth()
    if (!session?.user?.id) return { error: "Giriş yapmalısınız" }

    const user = await db.user.findUnique({
        where: { id: session.user.id },
        include: {
            enrollments: true,
            purchases: {
                include: { package: true },
                orderBy: { createdAt: 'desc' },
                take: 1
            }
        }
    })

    if (!user) return { error: "Kullanıcı bulunamadı" }

    // Check if user has ANY active package
    // We only care about the latest purchased PACKAGE
    const packagePurchases = user.purchases
        .filter(p => p.package !== null)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

    const activePurchase = packagePurchases[0]

    if (!activePurchase || !activePurchase.package) return { error: "Herhangi bir paketiniz yok veya aktif paket bulunamadı." }

    const activePackage = activePurchase.package
    const currentEnrollmentCount = user.enrollments.length

    // Check Limit (if courseLimit is set)
    if (activePackage.courseLimit !== null && currentEnrollmentCount >= activePackage.courseLimit) {
        return { error: `Paket limitinize ulaştınız (${activePackage.courseLimit} Kurs). Daha fazla kurs için paketinizi yükseltin.` }
    }

    // Check if already enrolled
    const existingEnrollment = await db.enrollment.findUnique({
        where: {
            userId_courseId: {
                userId: user.id,
                courseId: courseId
            }
        }
    })

    if (existingEnrollment) return { error: "Zaten kayıtlısınız" }

    try {
        await db.enrollment.create({
            data: {
                userId: user.id,
                courseId: courseId
            }
        })
        revalidatePath('/dashboard/courses')
        return { success: "Kursa başarıyla kayıt olundu!" }
    } catch (err) {
        return { error: "Kayıt işlemi başarısız" }
    }
}

export async function checkEnrollmentStatus(courseId: string) {
    const session = await auth()
    if (!session?.user?.id) return { isEnrolled: false, canEnroll: false }

    const enrollment = await db.enrollment.findUnique({
        where: {
            userId_courseId: {
                userId: session.user.id,
                courseId: courseId
            }
        }
    })

    if (enrollment) return { isEnrolled: true, canEnroll: false }

    // Check capability to enroll
    const user = await db.user.findUnique({
        where: { id: session.user.id },
        include: {
            enrollments: true,
            purchases: { include: { package: true } } // Get all just in case, logic simplified to last one usually
        }
    })

    // Find the most recent purchase THAT IS A PACKAGE
    // We filter purchases where package is not null, then sort.
    const packagePurchases = user?.purchases
        .filter(p => p.package !== null)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()) || []

    const activePurchase = packagePurchases[0]

    if (!activePurchase || !activePurchase.package) return { isEnrolled: false, canEnroll: false, error: "No package" }

    const pkg = activePurchase.package
    if (pkg.courseLimit === null) return { isEnrolled: false, canEnroll: true } // Unlimited

    if (user!.enrollments.length < pkg.courseLimit) {
        return { isEnrolled: false, canEnroll: true }
    }

    return { isEnrolled: false, canEnroll: false, error: "Limit reached" }
}
