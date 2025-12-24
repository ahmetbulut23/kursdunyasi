import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Seeding database...')

    // 1. Clean up existing courses to avoid duplicates (Optional, safe for fresh prod)
    // await prisma.course.deleteMany({}) 
    // await prisma.category.deleteMany({})

    // 2. Create Categories
    const categories = [
        { name: 'Web Geliştirme', slug: 'web-gelistirme' },
        { name: 'Mobil Geliştirme', slug: 'mobil-gelistirme' },
        { name: 'Veri Bilimi', slug: 'veri-bilimi' },
        { name: 'Siber Güvenlik', slug: 'siber-guvenlik' },
        { name: 'Yapay Zeka', slug: 'yapay-zeka' },
        { name: 'Mühendislik', slug: 'muhendislik' }
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

    // 3. Define Courses
    const coursesData = [
        // Web Geliştirme
        {
            title: 'Next.js 15 ile Full Stack Geliştirme',
            description: 'Next.js 15, App Router, Server Actions ve Prisma ile modern web uygulamaları geliştirmeyi öğrenin.',
            price: 269.99,
            rating: 4.8,
            instructor: 'Ahmet Yılmaz',
            imageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2070&auto=format&fit=crop', // React/Next logo vibe
            categorySlug: 'web-gelistirme'
        },
        {
            title: 'Next.js Giriş',
            description: 'React geliştiricileri için Next.js dünyasına hızlı bir başlangıç rehberi.',
            price: 150.00,
            rating: 0.0,
            instructor: 'Kurs Dünyası Eğitmen',
            imageUrl: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=2031&auto=format&fit=crop', // Coding generic
            categorySlug: 'web-gelistirme'
        },
        {
            title: 'Introduction to Next.js',
            description: 'Beginner friendly introduction to Server Side Rendering and Static Site Generation.',
            price: 100.00,
            rating: 0.0,
            instructor: 'Kurs Dünyası Eğitmen',
            imageUrl: 'https://images.unsplash.com/photo-1593720213428-28a5b9e94613?q=80&w=2070&auto=format&fit=crop', // Tech background
            categorySlug: 'web-gelistirme'
        },

        // Veri Bilimi
        {
            title: 'Python ile Veri Bilimi ve Makine Öğrenmesi',
            description: 'Sıfırdan ileri seviyeye Python, Pandas, NumPy ve Scikit-Learn ile veri analizi ve yapay zeka.',
            price: 199.99,
            rating: 4.7,
            instructor: 'Ayşe Demir',
            imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop', // Data graphs
            categorySlug: 'veri-bilimi'
        },

        // Mobil Geliştirme
        {
            title: 'Android Studio Giriş',
            description: 'Java ve Kotlin kullanarak Android uygulamaları geliştirmeye başlayın.',
            price: 100.00,
            rating: 0.0,
            instructor: 'Kurs Dünyası Eğitmen',
            imageUrl: 'https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?q=80&w=2070&auto=format&fit=crop', // Android vibe
            categorySlug: 'mobil-gelistirme'
        },

        // Siber Güvenlik
        {
            title: 'Etik Hacker Olma Kursu',
            description: 'Siber güvenlik dünyasına adım atın, ağ güvenliği ve sızma testlerini öğrenin.',
            price: 1799.99,
            rating: 4.7,
            instructor: 'Atil Samancioglu',
            imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop', // Hacker hoodie
            categorySlug: 'siber-guvenlik'
        },

        // Yapay Zeka
        {
            title: 'ChatGPT 2026: Prompt Mühendisliği ve Görsel Üretme',
            description: 'Yapay zeka araçlarını kullanarak iş akışınızı hızlandırın ve yaratıcı içerikler üretin.',
            price: 1099.99,
            rating: 4.6,
            instructor: 'Atil Samancioglu',
            imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2070&auto=format&fit=crop', // AI brain
            categorySlug: 'yapay-zeka'
        },
        {
            title: 'Üretken Yapay Zeka | Generative AI MasterClass',
            description: 'GANs, Autoencoders ve modern üretken modellerin derinlemesine incelenmesi.',
            price: 499.99,
            rating: 4.7,
            instructor: 'Dr. Ulaş Celenk',
            imageUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1965&auto=format&fit=crop', // Abstract AI
            categorySlug: 'yapay-zeka'
        },
        {
            title: 'Yapay Zeka 101: Modeller, Prompt Yazma',
            description: 'Temel kavramlardan başlayarak yapay zeka modellerini ve kullanım alanlarını keşfedin.',
            price: 499.99,
            rating: 4.5,
            instructor: 'Pınar İLBARS',
            imageUrl: 'https://images.unsplash.com/photo-1617791160505-6f00504e3519?q=80&w=2070&auto=format&fit=crop', // Tech pattern
            categorySlug: 'yapay-zeka'
        },
        {
            title: 'Full stack generative and Agentic AI with python',
            description: 'Python kullanarak uçtan uca üretken yapay zeka uygulamaları geliştirin.',
            price: 499.99,
            rating: 4.5,
            instructor: 'Hitesh Choudhary',
            imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=2070&auto=format&fit=crop', // Matrix code
            categorySlug: 'yapay-zeka'
        },
        {
            title: 'ChatGPT: İş Dünyası İçin Yapay Zeka Eğitimi',
            description: 'Kurumsal hayatta ChatGPT ve AI araçlarıyla verimliliği artırma teknikleri.',
            price: 999.99,
            rating: 4.5,
            instructor: 'Emre Akyüz',
            imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop', // Business meeting
            categorySlug: 'yapay-zeka'
        },

        // Mühendislik
        {
            title: 'Sistem ve Network Mühendisliği',
            description: 'Ağ altyapıları, sunucu yönetimi ve sistem güvenliği konularında uzmanlaşın.',
            price: 1999.99,
            rating: 4.7,
            instructor: 'Kayhan KIRBAŞ',
            imageUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bbcbf?q=80&w=2070&auto=format&fit=crop', // Server room
            categorySlug: 'muhendislik'
        },
        {
            title: 'Tia Portal ile Siemens S7-1200 PLC Programlama',
            description: 'Endüstriyel otomasyon ve PLC programlama temelleri.',
            price: 1699.99,
            rating: 4.8,
            instructor: 'Ayberk Tokmak',
            imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop', // Factory/Automation
            categorySlug: 'muhendislik'
        },
    ];

    for (const courseData of coursesData) {
        // Upsert based on title (somewhat risky if title changes, but good for id stability in seed)
        // Finding First to check existence if unique constraint doesn't exist on title
        const existing = await prisma.course.findFirst({
            where: { title: courseData.title }
        })

        if (!existing) {
            await prisma.course.create({
                data: {
                    title: courseData.title,
                    description: courseData.description,
                    price: courseData.price,
                    rating: courseData.rating,
                    instructor: courseData.instructor,
                    imageUrl: courseData.imageUrl,
                    categoryId: categoryMap.get(courseData.categorySlug),
                    lessons: {
                        create: [
                            { title: 'Giriş ve Kurs Tanıtımı', order: 1, videoUrl: '' },
                            { title: 'Temel Kavramlar', order: 2, videoUrl: '' },
                            { title: 'Uygulama Örnekleri', order: 3, videoUrl: '' }
                        ]
                    },
                    learningOutcomes: {
                        create: [
                            { text: 'Bu kurs ile temel yetkinlikleri kazanacaksınız.' },
                            { text: 'Gerçek dünya projeleri ile deneyim edineceksiniz.' },
                            { text: 'Sektör standartlarında araçları kullanmayı öğreneceksiniz.' }
                        ]
                    }
                }
            })
            console.log(`Created course: ${courseData.title}`)
        } else {
            console.log(`Skipped existing course: ${courseData.title}`)
        }
    } else {
        console.log(`Skipped existing course: ${courseData.title}`)
    }
}

// 4. Create Packages
const packages = [
    {
        name: 'Başlangıç Paketi',
        description: 'Tek bir kursa odaklanmak isteyenler için ideal.',
        price: 150.00,
        courseLimit: 1,
        enableUserChat: false,
        enableInstructorChat: false,
        features: JSON.stringify([
            { text: "1 Kurs Hakkı", valid: true },
            { text: "Temel Derslere Erişim", valid: true },
            { text: "Sertifika", valid: true },
            { text: "Eğitmen Desteği", valid: false },
            { text: "Topluluk Sohbeti", valid: false }
        ])
    },
    {
        name: 'Standart Paket',
        description: 'Birden fazla alanda kendini geliştirmek isteyenler için.',
        price: 350.00,
        courseLimit: 5,
        enableUserChat: true,
        enableInstructorChat: false,
        features: JSON.stringify([
            { text: "5 Kurs Hakkı", valid: true },
            { text: "Öğrenci Topluluğu", valid: true },
            { text: "Sertifika", valid: true },
            { text: "Eğitmen Desteği", valid: false },
            { text: "Tüm Materyaller", valid: true }
        ])
    },
    {
        name: 'Pro Üyelik',
        description: 'Sınırsız öğrenme ve eğitmen desteği ile kariyerinizi zirveye taşıyın.',
        price: 750.00,
        courseLimit: null, // Unlimited
        enableUserChat: true,
        enableInstructorChat: true,
        features: JSON.stringify([
            { text: "Sınırsız Kurs Hakkı", valid: true },
            { text: "Eğitmenle Sohbet", valid: true },
            { text: "Öncelikli Destek", valid: true },
            { text: "Kariyer Danışmanlığı", valid: true },
            { text: "VIP Topluluk", valid: true }
        ])
    }
];

for (const pkg of packages) {
    const existingPkg = await prisma.package.findFirst({ where: { name: pkg.name } });
    if (!existingPkg) {
        await prisma.package.create({
            data: {
                name: pkg.name,
                description: pkg.description,
                price: pkg.price,
                courseLimit: pkg.courseLimit,
                enableUserChat: pkg.enableUserChat,
                enableInstructorChat: pkg.enableInstructorChat,
                features: pkg.features
            }
        })
        console.log(`Created package: ${pkg.name}`)
    }
}
const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
        email: 'admin@example.com',
        name: 'Admin User',
        role: 'ADMIN',
        password: 'password123'
    }
})

console.log(`Seed completed. Admin: ${admin.email}`)
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
