import { auth } from "@/auth"
import { getMessages } from "@/app/actions/chat-actions"
import ChatClient from "@/components/chat/chat-client"

export default async function ChatPage() {
    const session = await auth()
    const messages = await getMessages()

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold tracking-tight">Topluluk Sohbeti</h1>
                <p className="text-gray-500 dark:text-gray-400">
                    Diğer öğrenciler ve eğitmenlerle bağlantı kurun.
                </p>
            </div>

            <ChatClient initialMessages={messages} userId={session?.user?.id || ""} />
        </div>
    )
}
