'use client'

import { useState, useEffect, useRef } from 'react'
import { getMessages, sendMessage, getChatPermissions } from '@/app/actions/chat-actions'
import { Button } from '@/components/ui/button'
import { Send, Lock, Users, GraduationCap } from 'lucide-react'
import { useFormStatus } from 'react-dom'

// Simple polling hook
function usePolling(callback: () => void, interval: number) {
    useEffect(() => {
        const timer = setInterval(callback, interval)
        return () => clearInterval(timer)
    }, [callback, interval])
}

type Message = {
    id: string
    content: string
    createdAt: Date
    type: string
    user: {
        name: string | null
        role: string
    }
}

export default function ChatClient({ initialMessages, userId }: { initialMessages: any[], userId: string }) {
    const [messages, setMessages] = useState<Message[]>(initialMessages)
    const [inputText, setInputText] = useState("")
    const [activeTab, setActiveTab] = useState<'COMMUNITY' | 'INSTRUCTOR'>('COMMUNITY')
    const [permissions, setPermissions] = useState({ canUserChat: false, canInstructorChat: false })
    const [loading, setLoading] = useState(true)
    const scrollRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        getChatPermissions().then(perms => {
            setPermissions(perms)
            setLoading(false)
        })
    }, [])

    const fetchMessages = async () => {
        try {
            const msgs = await getMessages(activeTab)
            // Naive update
            setMessages(msgs as any)
        } catch (error) {
            console.error("Polling error:", error)
        }
    }

    // specific fetch on tab change
    useEffect(() => {
        fetchMessages()
    }, [activeTab])

    // Poll every 3 seconds
    usePolling(fetchMessages, 3000)

    // Scroll to bottom on new messages
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages])

    const handleSend = async () => {
        if (!inputText.trim()) return

        const text = inputText
        setInputText("")

        const res = await sendMessage(text, activeTab)
        if (res.error) {
            alert(res.error)
        } else {
            fetchMessages()
        }
    }

    const hasAccess = activeTab === 'COMMUNITY' ? permissions.canUserChat : permissions.canInstructorChat

    return (
        <div className="flex flex-col h-[600px] border rounded-xl bg-card overflow-hidden shadow-sm">
            {/* Header / Tabs */}
            <div className="flex border-b bg-muted/30">
                <button
                    onClick={() => setActiveTab('COMMUNITY')}
                    className={`flex-1 p-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${activeTab === 'COMMUNITY' ? 'bg-background border-b-2 border-primary text-primary' : 'text-muted-foreground hover:bg-muted/50'}`}
                >
                    <Users className="h-4 w-4" />
                    Topluluk
                </button>
                <button
                    onClick={() => setActiveTab('INSTRUCTOR')}
                    className={`flex-1 p-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${activeTab === 'INSTRUCTOR' ? 'bg-background border-b-2 border-primary text-primary' : 'text-muted-foreground hover:bg-muted/50'}`}
                >
                    <GraduationCap className="h-4 w-4" />
                    Eğitmenler
                </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 relative overflow-hidden flex flex-col">
                {!loading && !hasAccess ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/50 backdrop-blur-sm z-10 p-6 text-center">
                        <div className="bg-card p-6 rounded-2xl border shadow-lg max-w-sm w-full">
                            <div className="h-12 w-12 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Lock className="h-6 w-6" />
                            </div>
                            <h3 className="text-lg font-bold mb-2">Erişim Kısıtlı</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                {activeTab === 'COMMUNITY'
                                    ? "Topluluk sohbetine erişiminiz bulunmamaktadır."
                                    : "Eğitmenlerle sohbet özelliği paketinizde mevcut değil."}
                            </p>
                            <Button className="w-full">Paketini Yükselt</Button>
                        </div>
                    </div>
                ) : null}

                <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.length === 0 && hasAccess && (
                        <div className="text-center text-muted-foreground text-sm my-10">
                            Henüz mesaj yok. İlk mesajı sen yaz!
                        </div>
                    )}
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex flex-col ${msg.user.name === "Me" ? 'items-end' : 'items-start'}`}>
                            <div className={`px-3 py-2 rounded-lg max-w-[85%] ${msg.user.role === 'ADMIN' ? 'bg-red-50 dark:bg-red-900/10 border-red-100' : 'bg-muted'}`}>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className={`text-xs font-bold ${msg.user.role === 'ADMIN' ? 'text-red-500' : 'text-blue-500'}`}>
                                        {msg.user.name || 'Anonymous'}
                                    </span>
                                    {msg.user.role === 'ADMIN' && <span className="text-[10px] bg-red-100 text-red-600 px-1 rounded">ADMIN</span>}
                                    <span className="text-[10px] text-muted-foreground">
                                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                                <p className="text-sm break-words">{msg.content}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Input Area */}
                <div className="p-4 border-t bg-background flex gap-2">
                    <input
                        disabled={!hasAccess || loading}
                        className="flex-1 bg-muted px-3 py-2 rounded-md border-0 focus:ring-2 focus:ring-primary outline-none disabled:opacity-50"
                        placeholder={hasAccess ? "Bir mesaj yazın..." : "Sohbet kilitli"}
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    />
                    <Button size="icon" onClick={handleSend} disabled={!hasAccess || loading}>
                        <Send className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    )
}
