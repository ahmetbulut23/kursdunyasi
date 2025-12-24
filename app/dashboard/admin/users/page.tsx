import { getUsers } from "@/app/actions/admin-actions"
import { UsersTable } from "./users-table"

export const dynamic = 'force-dynamic'

export default async function AdminUsersPage() {
    const users = await getUsers()

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Kullanıcı Yönetimi</h1>
                    <p className="text-muted-foreground">
                        Kayıtlı kullanıcıları, rollerini ve satın aldıkları paketleri yönetin.
                    </p>
                </div>
                <div className="bg-secondary/50 px-4 py-2 rounded-lg text-sm text-secondary-foreground font-medium">
                    Toplam Kullanıcı: {users.length}
                </div>
            </div>

            <div className="border rounded-xl bg-card shadow-sm overflow-hidden">
                <UsersTable initialUsers={users} />
            </div>
        </div>
    )
}
