'use client'

import { deleteUser, updateUserRole } from "@/app/actions/admin-actions"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Shieldalert, Trash2, UserCog } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { toast } from "sonner"

interface User {
    id: string
    name: string | null
    email: string
    role: string
    createdAt: Date
    purchases: {
        package: { name: string } | null
        course: { title: string } | null
    }[]
}

export function UsersTable({ initialUsers }: { initialUsers: User[] }) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [deleteId, setDeleteId] = useState<string | null>(null)

    const handleDelete = () => {
        if (!deleteId) return

        startTransition(async () => {
            const res = await deleteUser(deleteId)
            if (res.success) {
                toast.success("Kullanıcı silindi")
                setDeleteId(null)
                router.refresh()
            } else {
                toast.error(res.error)
            }
        })
    }

    const handleRoleChange = (userId: string, newRole: string) => {
        startTransition(async () => {
            const res = await updateUserRole(userId, newRole)
            if (res.success) {
                toast.success(`Rol güncellendi: ${newRole}`)
                router.refresh()
            } else {
                toast.error(res.error)
            }
        })
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="bg-muted/50 text-muted-foreground font-medium border-b">
                    <tr>
                        <th className="px-6 py-4">Kullanıcı</th>
                        <th className="px-6 py-4">Rol</th>
                        <th className="px-6 py-4">Satın Alımlar</th>
                        <th className="px-6 py-4 text-right">İşlemler</th>
                    </tr>
                </thead>
                <tbody className="divide-y">
                    {initialUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                            <td className="px-6 py-4">
                                <div className="font-medium">{user.name || "İsimsiz"}</div>
                                <div className="text-xs text-muted-foreground">{user.email}</div>
                                <div className="text-[10px] text-muted-foreground mt-1">
                                    Kayıt: {new Date(user.createdAt).toLocaleDateString('tr-TR')}
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${user.role === 'ADMIN'
                                        ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                                        : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                                    }`}>
                                    {user.role}
                                </span>
                            </td>
                            <td className="px-6 py-4">
                                {user.purchases.length === 0 ? (
                                    <span className="text-muted-foreground text-xs italic">Satın alım yok</span>
                                ) : (
                                    <div className="space-y-1">
                                        {user.purchases.map((p, i) => (
                                            <div key={i} className="text-xs flex items-center gap-1">
                                                <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                                                {p.package ? p.package.name : p.course?.title}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </td>
                            <td className="px-6 py-4 text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => handleRoleChange(user.id, user.role === 'ADMIN' ? 'STUDENT' : 'ADMIN')}>
                                            <UserCog className="mr-2 h-4 w-4" />
                                            {user.role === 'ADMIN' ? 'Öğrenci Yap' : 'Yönetici Yap'}
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setDeleteId(user.id)} className="text-red-600 focus:text-red-600">
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Kullanıcıyı Sil
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Emin misiniz?</DialogTitle>
                        <DialogDescription>
                            Bu işlem geri alınamaz. Kullanıcı ve tüm verileri silinecektir.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteId(null)} disabled={isPending}>İptal</Button>
                        <Button variant="destructive" onClick={handleDelete} disabled={isPending}>
                            {isPending ? "Siliniyor..." : "Evet, Sil"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
