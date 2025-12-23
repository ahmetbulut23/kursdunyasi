
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const count = await prisma.course.count()
    console.log(`Course count: ${count}`)
    const courses = await prisma.course.findMany({ select: { title: true } })
    console.log(courses)
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
