'use server'

import { db } from "@/lib/db"
import { auth } from "@/auth"

// Very basic CSV parser
function parseCSV(csvText: string) {
    const lines = csvText.split(/\r?\n/).filter(line => line.trim() !== '')
    const headers = lines[0].split(',').map(h => h.trim())

    const result = []
    for (let i = 1; i < lines.length; i++) {
        const obj: any = {}
        const currentline = lines[i].split(',')

        // Skip malformed lines
        if (currentline.length !== headers.length) continue

        for (let j = 0; j < headers.length; j++) {
            obj[headers[j]] = currentline[j].trim()
        }
        result.push(obj)
    }
    return result
}

export async function uploadUsersFromCSV(formData: FormData) {
    const session = await auth()
    // Check role
    if ((session?.user as any)?.role !== "ADMIN") {
        return { error: "Unauthorized" }
    }

    const file = formData.get("file") as File
    if (!file) {
        return { error: "No file provided" }
    }

    try {
        const text = await file.text()
        const users = parseCSV(text)

        // Expected headers: email, name, password, role
        let count = 0
        for (const user of users) {
            if (!user.email) continue

            // Check if exists
            const existing = await db.user.findUnique({ where: { email: user.email } })
            if (existing) continue

            await db.user.create({
                data: {
                    email: user.email,
                    name: user.name || "Student",
                    password: user.password || "123456", // Default password, normally hashed
                    role: user.role || "STUDENT"
                }
            })
            count++
        }

        return { success: `Successfully added ${count} users.` }

    } catch (err) {
        console.error(err)
        return { error: "Failed to process CSV" }
    }
}

// Course Management Actions

export async function getAdminCourses() {
    const session = await auth()
    if ((session?.user as any)?.role !== "ADMIN") return []

    return await db.course.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            _count: {
                select: { lessons: true, exams: true }
            }
        }
    })
}

export async function deleteCourse(courseId: string) {
    const session = await auth()
    if ((session?.user as any)?.role !== "ADMIN") return { error: "Unauthorized" }

    try {
        await db.course.delete({
            where: { id: courseId }
        })
        return { success: "Course deleted" }
    } catch (err) {
        return { error: "Failed to delete course" }
    }
}

export async function createCourse(formData: FormData) {
    const session = await auth()
    if ((session?.user as any)?.role !== "ADMIN") return { error: "Unauthorized" }

    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const price = parseFloat(formData.get("price") as string) || 0
    const imageUrl = formData.get("imageUrl") as string
    const categoryId = formData.get("categoryId") as string

    if (!title) return { error: "Title is required" }

    try {
        await db.course.create({
            data: {
                title,
                description,
                price,
                imageUrl,
                categoryId // [NEW]
            }
        })
        return { success: "Course created" }
    } catch (err) {
        return { error: "Failed to create course" }
    }
}

export async function updateCourse(courseId: string, formData: FormData) {
    const session = await auth()
    if ((session?.user as any)?.role !== "ADMIN") return { error: "Unauthorized" }

    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const price = parseFloat(formData.get("price") as string) || 0
    const imageUrl = formData.get("imageUrl") as string
    const categoryId = formData.get("categoryId") as string

    try {
        await db.course.update({
            where: { id: courseId },
            data: {
                title,
                description,
                price,
                imageUrl,
                categoryId // [NEW]
            }
        })
        return { success: "Course updated" }
    } catch (err) {
        return { error: "Failed to update course" }
    }
}

export async function getAdminCourse(courseId: string) {
    const session = await auth()
    if ((session?.user as any)?.role !== "ADMIN") return null

    return await db.course.findUnique({
        where: { id: courseId },
        include: {
            lessons: {
                orderBy: { order: 'asc' }
            }
        }
    })
}

export async function createLesson(courseId: string, formData: FormData) {
    const session = await auth()
    if ((session?.user as any)?.role !== "ADMIN") return { error: "Unauthorized" }

    const title = formData.get("title") as string
    const videoUrl = formData.get("videoUrl") as string
    const order = parseInt(formData.get("order") as string) || 99

    if (!title || !videoUrl) return { error: "Title and Video URL required" }

    try {
        await db.lesson.create({
            data: {
                title,
                videoUrl,
                order,
                courseId
            }
        })
        return { success: "Lesson created" }
    } catch (err) {
        return { error: "Failed to create lesson" }
    }
}

export async function deleteLesson(lessonId: string) {
    const session = await auth()
    if ((session?.user as any)?.role !== "ADMIN") return { error: "Unauthorized" }

    try {
        await db.lesson.delete({
            where: { id: lessonId }
        })
        return { success: "Lesson deleted" }
    } catch (err) {
        return { error: "Failed to delete lesson" }
    }
}

export async function updateLesson(lessonId: string, formData: FormData) {
    const session = await auth()
    if ((session?.user as any)?.role !== "ADMIN") return { error: "Unauthorized" }

    const title = formData.get("title") as string
    const videoUrl = formData.get("videoUrl") as string
    const order = parseInt(formData.get("order") as string) || 99

    try {
        await db.lesson.update({
            where: { id: lessonId },
            data: {
                title,
                videoUrl,
                order
            }
        })
        return { success: "Lesson updated" }
    } catch (err) {
        return { error: "Failed to update lesson" }
    }
}
// Learning Outcome Actions

export async function createLearningOutcome(courseId: string, formData: FormData) {
    const session = await auth()
    if ((session?.user as any)?.role !== "ADMIN") return { error: "Unauthorized" }

    const text = formData.get("text") as string

    if (!text) return { error: "Text is required" }

    try {
        await db.learningOutcome.create({
            data: {
                text,
                courseId
            }
        })
        return { success: "Outcome created" }
    } catch (err) {
        return { error: "Failed to create outcome" }
    }
}

export async function deleteLearningOutcome(outcomeId: string) {
    const session = await auth()
    if ((session?.user as any)?.role !== "ADMIN") return { error: "Unauthorized" }

    try {
        await db.learningOutcome.delete({
            where: { id: outcomeId }
        })
        return { success: "Outcome deleted" }
    } catch (err) {
        return { error: "Failed to delete outcome" }
    }
}

// Package Actions

export async function getAdminPackages() {
    const session = await auth()
    if ((session?.user as any)?.role !== "ADMIN") return []
    return await db.package.findMany({
        include: { courses: true, _count: { select: { purchases: true } } },
        orderBy: { price: 'asc' }
    })
}

export async function createPackage(formData: FormData) {
    const session = await auth()
    if ((session?.user as any)?.role !== "ADMIN") return { error: "Unauthorized" }

    const name = formData.get("name") as string
    const description = formData.get("description") as string
    const price = parseFloat(formData.get("price") as string) || 0
    const features = formData.get("features") as string
    const courseLimitInput = formData.get("courseLimit") as string
    const courseLimit = courseLimitInput ? parseInt(courseLimitInput) : null
    const enableInstructorChat = formData.get("enableInstructorChat") === "on"
    const enableUserChat = formData.get("enableUserChat") === "on"

    if (!name) return { error: "Name is required" }

    try {
        await db.package.create({
            data: {
                name,
                description,
                price,
                features,
                courseLimit,
                enableInstructorChat,
                enableUserChat
            }
        })
        return { success: "Package created" }
    } catch (err) {
        return { error: "Failed to create package" }
    }
}

export async function updatePackage(packageId: string, formData: FormData) {
    const session = await auth()
    if ((session?.user as any)?.role !== "ADMIN") return { error: "Unauthorized" }

    const name = formData.get("name") as string
    const description = formData.get("description") as string
    const price = parseFloat(formData.get("price") as string) || 0
    const features = formData.get("features") as string
    const courseLimitInput = formData.get("courseLimit") as string
    const courseLimit = courseLimitInput ? parseInt(courseLimitInput) : null
    const enableInstructorChat = formData.get("enableInstructorChat") === "on"
    const enableUserChat = formData.get("enableUserChat") === "on"

    try {
        await db.package.update({
            where: { id: packageId },
            data: {
                name,
                description,
                price,
                features,
                courseLimit,
                enableInstructorChat,
                enableUserChat
            }
        })
        return { success: "Package updated" }
    } catch (err) {
        return { error: "Failed to update package" }
    }
}

export async function deletePackage(packageId: string) {
    const session = await auth()
    if ((session?.user as any)?.role !== "ADMIN") return { error: "Unauthorized" }

    try {
        await db.package.delete({ where: { id: packageId } })
        return { success: "Package deleted" }
    } catch (err) {
        return { error: "Failed to delete package" }
    }
}

// Enrollment Actions

export async function getCourseEnrollments(courseId: string) {
    const session = await auth()
    if ((session?.user as any)?.role !== "ADMIN") return []

    return await db.enrollment.findMany({
        where: { courseId },
        include: {
            user: {
                select: { id: true, name: true, email: true }
            }
        },
        orderBy: { createdAt: 'desc' }
    })
}

export async function removeEnrollment(courseId: string, userId: string) {
    const session = await auth()
    if ((session?.user as any)?.role !== "ADMIN") return { error: "Unauthorized" }

    try {
        await db.enrollment.deleteMany({
            where: {
                courseId: courseId,
                userId: userId
            }
        })
        return { success: "Enrollment removed" }
    } catch (err) {
        return { error: "Failed to remove enrollment" }
    }
}

// Material Actions

export async function createMaterial(courseId: string, formData: FormData) {
    const session = await auth()
    if ((session?.user as any)?.role !== "ADMIN") return { error: "Unauthorized" }

    const title = formData.get("title") as string
    const fileUrl = formData.get("fileUrl") as string
    const type = formData.get("type") as string || "LINK"

    if (!title || !fileUrl) return { error: "Title and URL required" }

    try {
        await db.material.create({
            data: {
                title,
                fileUrl,
                type,
                courseId
            }
        })
        return { success: "Material created" }
    } catch (err) {
        return { error: "Failed to create material" }
    }
}

export async function deleteMaterial(materialId: string) {
    const session = await auth()
    if ((session?.user as any)?.role !== "ADMIN") return { error: "Unauthorized" }

    try {
        await db.material.delete({
            where: { id: materialId }
        })
        return { success: "Material deleted" }
    } catch (err) {
        return { error: "Failed to delete material" }
    }
}
