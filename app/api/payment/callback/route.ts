import { NextRequest, NextResponse } from "next/server";
import { retrievePaymentResult } from "@/lib/iyzico";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    try {
        const formData = await req.formData();
        const token = formData.get("token") as string;

        if (!token) {
            return NextResponse.redirect(new URL("/dashboard?error=PaymentFailed", baseUrl), { status: 303 });
        }

        const result: any = await retrievePaymentResult(token);

        if (result.status === "success" && result.paymentStatus === "SUCCESS") {
            // Find purchase by paymentToken (we saved it on init) or basketId (which is purchaseId)
            const basketId = result.basketId;

            const purchase = await db.purchase.findUnique({
                where: { id: basketId }, // basketId = purchase.id
                include: { course: true, package: true }
            });

            if (!purchase) {
                console.error("Purchase not found for basketId:", basketId);
                return NextResponse.redirect(new URL("/dashboard?error=PurchaseNotFound", baseUrl), { status: 303 });
            }

            if (purchase.status === "COMPLETED") {
                return NextResponse.redirect(new URL("/dashboard?success=AlreadyPaid", baseUrl), { status: 303 });
            }

            // Update Purchase Status
            await db.purchase.update({
                where: { id: purchase.id },
                data: {
                    status: "COMPLETED",
                    paymentId: result.paymentId,
                    paymentToken: token // Ensure it matches
                }
            });

            // Logic to Enroll if it was a Course Purchase
            // (We created Enrollment with transaction in buyCourse? No, in buyCourse we replaced logic to just create Pending Purchase)
            // Wait, I updated buyCourse to ONLY create Pending Purchase.
            // So now I need to create the Enrollment record HERE if it's a course purchase.

            if (purchase.courseId) {
                // Check if enrollment exists
                const existing = await db.enrollment.findUnique({
                    where: {
                        userId_courseId: {
                            userId: purchase.userId,
                            courseId: purchase.courseId
                        }
                    }
                });

                if (!existing) {
                    await db.enrollment.create({
                        data: {
                            userId: purchase.userId,
                            courseId: purchase.courseId
                        }
                    });
                }
            }

            // Redirect to success page (or dashboard with param)
            let redirectUrl = "";
            let itemName = "";

            if (purchase.courseId) {
                itemName = purchase.course?.title || "Kurs";
                redirectUrl = `/dashboard/courses/${purchase.courseId}?payment=success&itemName=${encodeURIComponent(itemName)}`;
            } else if (purchase.packageId) {
                itemName = purchase.package?.name || "Paket";
                redirectUrl = `/dashboard?payment=success&itemName=${encodeURIComponent(itemName)}`;
            } else {
                redirectUrl = `/dashboard?payment=success`;
            }

            return NextResponse.redirect(new URL(redirectUrl, baseUrl), { status: 303 });

        } else {
            // Payment Failed
            // We could update status to FAILED
            // Redirect
            const errorMessage = result.errorMessage || "Ödeme başarısız";
            return NextResponse.redirect(new URL(`/dashboard?error=${encodeURIComponent(errorMessage)}`, baseUrl), { status: 303 });
        }

    } catch (error) {
        console.error("Callback Error:", error);
        return NextResponse.redirect(new URL("/dashboard?error=SystemError", baseUrl), { status: 303 });
    }
}
