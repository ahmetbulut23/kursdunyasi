'use server'

import { db } from "@/lib/db"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"
import { initializePayment } from "@/lib/iyzico"

export async function purchasePackage(packageId: string) {
    const session = await auth()

    if (!session?.user?.id) {
        return { error: "Unauthorized" }
    }

    const pkg = await db.package.findUnique({ where: { id: packageId } })
    if (!pkg) return { error: "Paket bulunamadı" }

    // Check if already purchased (Completed)
    const existing = await db.purchase.findFirst({
        where: {
            userId: session.user.id,
            packageId: packageId,
            status: "COMPLETED"
        }
    })

    if (existing) {
        return { error: "Already purchased" }
    }

    // 1. Create Pending Purchase
    const purchase = await db.purchase.create({
        data: {
            userId: session.user.id,
            packageId: packageId,
            amount: pkg.price,
            status: "PENDING"
        }
    })

    // 2. Initialize Iyzico
    try {
        let baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
        baseUrl = baseUrl.trim();
        console.log("Purchase Init - Base URL:", baseUrl);

        const callbackUrl = `${baseUrl}/api/payment/callback`;
        console.log("Purchase Init - Callback URL:", callbackUrl);

        const result: any = await initializePayment({
            price: pkg.price,
            paidPrice: pkg.price,
            basketId: purchase.id,
            callbackUrl: callbackUrl,
            buyer: {
                id: session.user.id,
                name: session.user.name || "Kullanici",
                surname: "Soyad",
                email: session.user.email || "email@example.com",
                identityNumber: "11111111111",
                address: "Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1",
                ip: "85.34.78.112",
                city: "Istanbul",
                country: "Turkey"
            },
            items: [{
                id: pkg.id,
                name: pkg.name,
                category: "Online Education Package",
                price: pkg.price
            }]
        })

        console.log("Iyzico Result:", JSON.stringify(result, null, 2));

        if (result.status === "success" && result.paymentPageUrl) {
            await db.purchase.update({
                where: { id: purchase.id },
                data: { paymentToken: result.token }
            })
            return { redirectUrl: result.paymentPageUrl }
        } else {
            console.error("Iyzico Init Failed:", result)
            return { error: "Ödeme başlatılamadı: " + (result.errorMessage || "Bilinmeyen hata") }
        }
    } catch (err: any) {
        console.error("Iyzico Error:", err)
        return { error: "Sistem hatası: " + err.message }
    }
}

// Buy a specific course directly
// Buy a specific course directly
export async function buyCourse(courseId: string) {
    console.log("buyCourse: Started for courseId", courseId);

    // Validate Environment URL
    let baseUrl = process.env.NEXTAUTH_URL;
    if (!baseUrl) {
        console.warn("buyCourse: NEXTAUTH_URL is missing, falling back to VERCEL_URL");
        baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';
    }

    console.log("buyCourse: effective Base URL:", baseUrl);

    let session;
    try {
        session = await auth();
    } catch (authErr) {
        console.error("buyCourse: Auth Error", authErr);
        return { error: "Kimlik doğrulama hatası. Lütfen tekrar giriş yapın." };
    }

    if (!session?.user?.id) return { error: "Satın alma işlemi için giriş yapmalısınız." }

    try {
        const course = await db.course.findUnique({ where: { id: courseId } })
        if (!course) return { error: "Kurs bulunamadı." }

        // Check if already enrolled or purchased
        const existingEnrollment = await db.enrollment.findUnique({
            where: {
                userId_courseId: {
                    userId: session.user.id,
                    courseId: courseId
                }
            }
        })
        if (existingEnrollment) return { error: "Zaten bu kursa sahipsiniz." }

        // 1. Create Pending Purchase
        const purchase = await db.purchase.create({
            data: {
                userId: session.user.id,
                courseId: courseId,
                amount: course.price,
                status: "PENDING"
            }
        })

        // 2. Init Iyzico with Timeout
        const callbackUrl = `${baseUrl}/api/payment/callback`;

        // Helper for timeout
        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Ödeme servisi zaman aşımına uğradı (15s)")), 15000)
        );

        const paymentPromise = initializePayment({
            price: course.price,
            paidPrice: course.price,
            basketId: purchase.id,
            callbackUrl: callbackUrl,
            buyer: {
                id: session.user.id,
                name: session.user.name || "Misafir",
                surname: "Kullanici",
                email: session.user.email || "email@example.com",
                identityNumber: "11111111111",
                address: "Online Course Platform",
                ip: "85.34.78.112",
                city: "Istanbul",
                country: "Turkey"
            },
            items: [{
                id: course.id,
                name: course.title,
                category: "Online Course",
                price: course.price
            }]
        });

        // Race against timeout
        const result: any = await Promise.race([paymentPromise, timeoutPromise]);

        console.log("Iyzico Result:", JSON.stringify(result, null, 2));

        if (result.status === "success" && result.paymentPageUrl) {
            await db.purchase.update({
                where: { id: purchase.id },
                data: { paymentToken: result.token }
            })
            return { redirectUrl: result.paymentPageUrl }
        } else {
            console.error("Iyzico Initialization Failed:", result);
            return { error: "Ödeme başlatılamadı: " + (result.errorMessage || "Bilinmeyen hata") }
        }

    } catch (err: any) {
        console.error("buyCourse System Error:", err);
        return { error: "İşlem sırasında bir hata oluştu: " + (err.message || "Bilinmeyen hata") }
    }
}

export async function getPackages() {
    return await db.package.findMany({
        orderBy: { price: 'asc' }
    })
}

export async function getUserPurchases(userId: string) {
    const purchases = await db.purchase.findMany({
        where: {
            userId: userId,
            status: "COMPLETED",
            packageId: { not: null }
        },
        select: { packageId: true }
    })
    return purchases.map(p => p.packageId!)
}
