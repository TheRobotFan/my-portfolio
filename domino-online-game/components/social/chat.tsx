"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useGameStore, ChatMessage } from "@/lib/game-store"
import {
    MessageSquare,
    Send,
    X,
    Smile,
    MoreVertical,
    Shield,
    Circle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

export function GlobalChat() {
    const [isOpen, setIsOpen] = useState(false)
    const [message, setMessage] = useState("")
    const { globalChat, sendChatMessage, user } = useGameStore()
    const scrollRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [globalChat, isOpen])

    const handleSend = () => {
        if (!message.trim()) return
        sendChatMessage(message, 'global')
        setMessage("")
    }

    return (
        <div className="fixed bottom-6 right-6 z-[100]">
            {/* Floating Toggle Button */}
            <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
            >
                <Button
                    onClick={() => setIsOpen(!isOpen)}
                    className={cn(
                        "h-14 w-14 rounded-full shadow-2xl relative transition-all",
                        isOpen ? "bg-red-500 hover:bg-red-600 rotate-90" : "bg-primary hover:bg-primary/90"
                    )}
                >
                    {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
                    {/* Active indicator */}
                    {!isOpen && (
                        <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full border-2 border-background animate-pulse" />
                    )}
                </Button>
            </motion.div>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="absolute bottom-20 right-0 w-[400px] h-[600px] bg-black/40 backdrop-blur-3xl border border-white/10 rounded-[32px] shadow-[0_30px_100px_rgba(0,0,0,0.6)] flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-6 bg-white/5 border-b border-white/10 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
                                        <MessageSquare className="w-5 h-5 text-primary" />
                                    </div>
                                    <Circle className="absolute -bottom-0.5 -right-0.5 w-3 h-3 text-green-500 fill-green-500 border-2 border-background" />
                                </div>
                                <div>
                                    <h3 className="font-black uppercase tracking-tighter text-sm">Chat Globale</h3>
                                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">1,248 Online</p>
                                </div>
                            </div>
                            <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10 h-10 w-10">
                                <MoreVertical className="w-5 h-5 text-muted-foreground" />
                            </Button>
                        </div>

                        {/* Messages Area */}
                        <div
                            ref={scrollRef}
                            className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-white/10"
                        >
                            <div className="text-center py-4">
                                <p className="text-[10px] text-muted-foreground uppercase font-black tracking-[0.2em] bg-white/5 inline-block px-3 py-1 rounded-full">Benvenuto nella Dominion Chat</p>
                            </div>

                            {globalChat.map((msg, index) => {
                                const isMe = msg.senderId === user?.id
                                return (
                                    <motion.div
                                        key={msg.id}
                                        initial={{ opacity: 0, x: isMe ? 20 : -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className={cn(
                                            "flex gap-3",
                                            isMe ? "flex-row-reverse" : ""
                                        )}
                                    >
                                        {!isMe && (
                                            <Avatar className="w-8 h-8 mt-1 border border-white/10">
                                                <AvatarImage src={msg.senderAvatar} />
                                                <AvatarFallback className="text-[10px] uppercase font-bold">{msg.senderName[0]}</AvatarFallback>
                                            </Avatar>
                                        )}
                                        <div className={cn(
                                            "flex flex-col max-w-[80%]",
                                            isMe ? "items-end" : "items-start"
                                        )}>
                                            {!isMe && (
                                                <div className="flex items-center gap-1.5 mb-1 px-1">
                                                    <span className="text-[10px] font-black uppercase text-muted-foreground">{msg.senderName}</span>
                                                    {index % 5 === 0 && <Shield className="w-3 h-3 text-primary" />}
                                                </div>
                                            )}
                                            <div className={cn(
                                                "px-4 py-2.5 rounded-2xl text-sm font-medium leading-relaxed shadow-lg",
                                                isMe
                                                    ? "bg-primary text-primary-foreground rounded-tr-none"
                                                    : "bg-white/10 text-foreground border border-white/10 rounded-tl-none backdrop-blur-md"
                                            )}>
                                                {msg.content}
                                            </div>
                                            <span className="text-[8px] text-muted-foreground font-bold mt-1 uppercase">12:45 PM</span>
                                        </div>
                                    </motion.div>
                                )
                            })}
                        </div>

                        {/* Input Area */}
                        <div className="p-6 bg-white/5 border-t border-white/10">
                            <div className="relative group">
                                <input
                                    type="text"
                                    placeholder="Scrivi un messaggio..."
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-4 pr-24 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                                />
                                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground">
                                        <Smile className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        onClick={handleSend}
                                        size="icon"
                                        className="h-8 w-8 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground"
                                    >
                                        <Send className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
