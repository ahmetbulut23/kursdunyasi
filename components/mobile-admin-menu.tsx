"use client"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { BookOpen, Menu, Shield, Trophy, User, Users } from "lucide-react"
import Link from "next/link"

export function MobileAdminMenu() {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden text-primary-foreground hover:bg-primary-foreground/10 hover:text-white">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Admin Menüsü</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
                <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">
                    Yönetici Paneli
                </div>
                <DropdownMenuItem asChild>
                    <Link href="/dashboard/admin/users" className="flex items-center gap-2 cursor-pointer">
                        <Users className="h-4 w-4" />
                        <span>Kullanıcılar</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href="/dashboard/admin/exams" className="flex items-center gap-2 cursor-pointer">
                        <Trophy className="h-4 w-4" />
                        <span>Sınav Yönetimi</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href="/dashboard/admin/packages" className="flex items-center gap-2 cursor-pointer">
                        <Shield className="h-4 w-4" />
                        <span>Paket Yönetimi</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href="/dashboard/admin/courses" className="flex items-center gap-2 cursor-pointer">
                        <BookOpen className="h-4 w-4" />
                        <span>Kurs Yönetimi</span>
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
