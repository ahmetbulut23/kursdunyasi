import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Seeding database...')

    // Create Categories
    const categories = [
        { name: 'Web Geliştirme', slug: 'web-gelistirme' },
        { name: 'Mobil Geliştirme', slug: 'mobil-gelistirme' },
        { name: 'Veri Bilimi', slug: 'veri-bilimi' },
        { name: 'Oyun Geliştirme', slug: 'oyun-gelistirme' },
        { name: 'Siber Güvenlik', slug: 'siber-guvenlik' }
    ];

    const categoryMap = new Map();

    for (const cat of categories) {
        const created = await prisma.category.upsert({
            where: { slug: cat.slug },
            update: {},
            create: cat
        });
        categoryMap.set(cat.slug, created.id);
    }

    // Create a sample course (Web Geliştirme)
    const course = await prisma.course.create({
        data: {
            title: 'Next.js 15 ile Full Stack Geliştirme',
            description: 'Next.js 15, App Router, Server Actions ve Prisma ile modern web uygulamaları geliştirmeyi öğrenin.',
            price: 269.99,
            rating: 4.8,
            instructor: 'Ahmet Yılmaz',
            imageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2070&auto=format&fit=crop',
            categoryId: categoryMap.get('web-gelistirme'),
            learningOutcomes: {
                create: [
                    { text: 'Sıfırdan ileri seviyeye modern web geliştirme' },
                    { text: 'React ve Next.js ile dinamik uygulamalar oluşturma' },
                    { text: 'Veritabanı tasarımı ve yönetimi (Prisma & SQL)' },
                    { text: 'Responsive ve mobil uyumlu arayüz tasarımları' },
                    { text: 'API entegrasyonları ve backend iletişimi' },
                    { text: 'Güvenli kimlik doğrulama sistemleri (Auth.js)' }
                ]
            },
            lessons: {
                create: [
                    { title: 'Kurulum ve Başlangıç', order: 1, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
                    { title: 'Dosya Tabanlı Yönlendirme', order: 2, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
                    { title: 'Server Components', order: 3, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
                    { title: 'Client Components', order: 4, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
                    { title: 'Veri Çekme (Data Fetching)', order: 5, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
                ]
            },
            exams: {
                create: [
                    {
                        title: 'Next.js Temelleri Sınavı',
                        questions: {
                            create: [
                                {
                                    text: 'App Router için hangi dizin kullanılır?',
                                    options: JSON.stringify(['pages', 'app', 'src', 'next']),
                                    correctAnswer: 'app'
                                },
                                {
                                    text: 'Server Componentlerde veri çekmek için hangi fonksiyon kullanılır?',
                                    options: JSON.stringify(['useEffect', 'getServerSideProps', 'fetch', 'useSWR']),
                                    correctAnswer: 'fetch'
                                }
                            ]
                        }
                    }
                ]
            }
        }
    })

    // Create another course (Python/Data Science)
    await prisma.course.create({
        data: {
            title: 'Python ile Veri Bilimi ve Makine Öğrenmesi',
            description: 'Sıfırdan ileri seviyeye Python, Pandas, NumPy ve Scikit-Learn ile veri analizi ve yapay zeka.',
            price: 199.99,
            rating: 4.7,
            instructor: 'Ayşe Demir',
            imageUrl: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?q=80&w=2070&auto=format&fit=crop',
            categoryId: categoryMap.get('veri-bilimi'),
            learningOutcomes: {
                create: [
                    { text: 'Python programlama diline hakimiyet' },
                    { text: 'Pandas ve NumPy ile veri analizi' },
                    { text: 'Makine öğrenmesi algoritmalarını anlama' },
                    { text: 'Veri görselleştirme teknikleri (Matplotlib)' },
                    { text: 'Gerçek dünya veri setleri ile projeler' }
                ]
            },
            lessons: {
                create: [
                    { title: 'Python Giriş', order: 1, videoUrl: '' },
                    { title: 'Pandas ile Veri Analizi', order: 2, videoUrl: '' }
                ]
            }
        }
    })

    // Create a Package
    const proPackage = await prisma.package.create({
        data: {
            name: 'Profesyonel Paket',
            description: 'Tüm Next.js kurslarına ve sınavlarına erişim.',
            price: 199.99,
            courses: {
                connect: { id: course.id }
            }
        }
    })

    console.log(`Created course: ${course.title}`)
    console.log(`Created package: ${proPackage.name}`)

    // Create Admin User
    const admin = await prisma.user.upsert({
        where: { email: 'admin@example.com' },
        update: {},
        create: {
            email: 'admin@example.com',
            name: 'Admin User',
            role: 'ADMIN',
            password: 'password123' // Plain text for MVP
        }
    })

    // Create Student User
    const student = await prisma.user.upsert({
        where: { email: 'student@example.com' },
        update: {},
        create: {
            email: 'student@example.com',
            name: 'Student User',
            role: 'STUDENT',
            password: 'password123'
        }
    })

    console.log(`Created admin: ${admin.email}`)
    console.log(`Created student: ${student.email}`)
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
