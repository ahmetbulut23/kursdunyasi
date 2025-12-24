
import { db } from "@/lib/db"
import { auth } from "@/auth"

export async function getAdminPackages() {
    const session = await auth()
    if ((session?.user as any)?.role !== "ADMIN") return []

    // Explicitly select fields to avoid circular ref or huge payload issues
    const packages = await db.package.findMany({
        orderBy: { price: 'asc' },
        include: {
            courses: {
                select: {
                    id: true,
                    title: true
                }
            },
            _count: {
                select: {
                    purchases: true
                }
            }
        }
    })

    // Convert Decimal/Date to plain types if necessary (Prisma usually handles this for RSC, but let's be safe)
    return JSON.parse(JSON.stringify(packages))
}

export async function getUsers() {
    const session = await auth()
    if ((session?.user as any)?.role !== "ADMIN") return []

    const users = await db.user.findMany({
        orderBy: { createdAt: 'desc' },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
            purchases: {
                where: { status: "COMPLETED" },
                select: {
                    id: true,
                    package: { select: { name: true } },
                    course: { select: { title: true } }
                }
            }
        }
    })

    return JSON.parse(JSON.stringify(users))
}
