import Link from "next/link"
import { Button } from "@/components/ui/button"
import { db } from "@/lib/db"
import { PlayCircle, Star, Clock, ChevronRight } from "lucide-react"

export default async function Home() {
  const categories = await db.category.findMany({
    orderBy: { name: 'asc' }
  });

  const courses = await db.course.findMany({
    include: {
      category: true,
      _count: {
        select: { lessons: true }
      }
    },
    orderBy: { createdAt: 'desc' },
    // take: 8 // Show all courses as requested
  })

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center justify-between px-6 lg:px-8 max-w-7xl mx-auto w-full">
          <div className="font-bold text-xl flex items-center gap-2">
            <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold">K</div>
            Kurs Dünyası
          </div>
          <div className="flex gap-4">
            <nav className="hidden md:flex items-center gap-6 mr-6 text-sm font-medium">
              <Link href="/dashboard/courses" className="hover:text-primary transition-colors">Kurslar</Link>
              <Link href="#" className="hover:text-primary transition-colors">Eğitmenler</Link>
              <Link href="#" className="hover:text-primary transition-colors">Hakkımızda</Link>
            </nav>
            <Link href="/login">
              <Button variant="ghost">Giriş Yap</Button>
            </Link>
            <Link href="/register">
              <Button>Kayıt Ol</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-background py-10 sm:py-16">
          <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
            <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{ clipPath: "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)" }}></div>
          </div>
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
                Sınırsız Öğrenme Dünyasına Hoşgeldiniz
              </h1>
              <p className="mt-4 text-base leading-7 text-muted-foreground">
                Kariyerinizi ileriye taşıyacak yetenekleri keşfedin. Uzman eğitmenlerden, gerçek dünya projeleriyle öğrenin.
              </p>
              <div className="mt-6 flex items-center justify-center gap-x-6">
                <Link href="/dashboard/courses">
                  <Button className="h-10 px-6 text-base rounded-full shadow-lg hover:scale-105 transition-transform">Kursları İncele</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Category Nav - Scrollable */}
        <section className="border-y bg-muted/30">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center gap-8 overflow-x-auto no-scrollbar justify-start md:justify-center">
              {categories.map((cat: any) => (
                <Link
                  key={cat.id}
                  href={`/dashboard/courses?category=${cat.slug}`}
                  className="text-sm font-medium text-muted-foreground hover:text-primary shrink-0 transition-colors whitespace-nowrap"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Course Discovery Section */}
        <section className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Popüler Kurslar</h2>
            <Link href="/dashboard/courses" className="text-primary font-semibold hover:underline flex items-center gap-1">
              Tümünü Gör <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {courses.map((course: any) => (
              <Link href={`/dashboard/courses/${course.id}`} key={course.id} className="group flex flex-col h-full bg-card border rounded-xl overflow-hidden hover:shadow-lg transition-all hover:scale-[1.01]">
                {/* Image Container */}
                <div className="relative aspect-video w-full bg-gray-200 dark:bg-gray-800">
                  {course.imageUrl ? (
                    <img
                      src={course.imageUrl}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full text-gray-400">
                      <PlayCircle className="h-12 w-12" />
                    </div>
                  )}
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <span className="text-white text-sm font-medium flex items-center gap-1">
                      <PlayCircle className="h-4 w-4" /> Kursu İncele
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-col flex-1 p-4 gap-2">
                  <h3 className="font-bold line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {course.instructor || "Kurs Dünyası Eğitmeni"}
                  </p>

                  {/* Rating */}
                  <div className="flex items-center gap-1 text-xs font-bold text-yellow-600 dark:text-yellow-500">
                    <span className="text-sm">{course.rating.toFixed(1)}</span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-3 w-3 ${i < Math.floor(course.rating) ? "fill-current" : "text-gray-300"}`} />
                      ))}
                    </div>
                    <span className="text-muted-foreground font-normal">(1,250)</span>
                  </div>

                  {/* Meta Info */}
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                    <span className="flex items-center gap-1">
                      <PlayCircle className="h-3 w-3" /> {course._count.lessons} Ders
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> 12s 30dk
                    </span>
                  </div>

                  <div className="mt-auto pt-4 flex items-center justify-between">
                    <span className="text-lg font-bold">
                      {course.price > 0 ? `₺${course.price}` : 'Ücretsiz'}
                    </span>
                    {course._count.lessons > 0 && course.category && (
                      <span className="text-[10px] uppercase tracking-wider font-semibold bg-secondary px-2 py-1 rounded text-secondary-foreground">
                        {course.category.name}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Categories Grid */}
        <section className="bg-slate-50 dark:bg-slate-900/50 py-16">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <h2 className="text-2xl font-bold mb-8">Kategorilere Göre Göz At</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {categories.map((cat: any) => (
                <Link href={`/dashboard/courses?category=${cat.slug}`} key={cat.id} className="border bg-background rounded-lg p-4 hover:shadow-md hover:border-primary transition-all cursor-pointer flex flex-col gap-2 group text-center items-center justify-center h-32">
                  <span className="font-semibold text-foreground group-hover:text-primary transition-colors">{cat.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-12 text-center text-sm text-gray-500 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center mb-8">
            <div className="font-bold text-xl">Kurs Dünyası</div>
            <div className="flex gap-6">
              <Link href="#" className="hover:text-primary">Hakkımızda</Link>
              <Link href="#" className="hover:text-primary">İletişim</Link>
              <Link href="#" className="hover:text-primary">Gizlilik</Link>
            </div>
          </div>
          <p>© 2025 Kurs Dünyası. Tüm hakları saklıdır.</p>
        </div>
      </footer>
    </div>
  )
}
