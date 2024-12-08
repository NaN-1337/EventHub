"use client"

import { useRef, useEffect } from "react"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface User {
  uid: string
  name: string
  email: string
  avatar: string
}

interface Message {
  id: string
  senderId: string
  receiverId: string
  content: string
  timestamp: any
}

interface ChatAreaProps {
  currentUser: User | null
  selectedUser: User | null
  messages: Message[]
  onSendMessage: (content: string) => void
}

export function ChatArea({ currentUser, selectedUser, messages, onSendMessage }: ChatAreaProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = () => {
    if (!inputRef.current?.value.trim() || !selectedUser || !currentUser) return
    onSendMessage(inputRef.current.value)
    inputRef.current.value = ''
  }

  if (!selectedUser) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500 bg-white">
        <div className="text-center">
          <h3 className="text-2xl font-semibold mb-2">Welcome to the Chat</h3>
          <p>Select a user to start chatting</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col bg-white">
      <ScrollArea ref={scrollRef} className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message, index) => {
            const isCurrentUser = message.senderId === currentUser?.uid
            const showAvatar = index === 0 || messages[index - 1].senderId !== message.senderId

            return (
              <div
                key={message.id}
                className={`flex items-end gap-2 ${
                  isCurrentUser ? "flex-row-reverse" : ""
                }`}
              >
                {showAvatar && (
                  <Avatar className="w-8 h-8">
                    <AvatarImage
                      src={
                        isCurrentUser
                          ? currentUser?.avatar
                          : selectedUser?.avatar
                      }
                    />
                    <AvatarFallback>
                      {(isCurrentUser ? currentUser?.name : selectedUser?.name)
                        ?.substring(0, 2)
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`rounded-lg p-3 max-w-[70%] ${
                    isCurrentUser
                      ? "bg-[#11999E] text-white rounded-br-none"
                      : "bg-gray-100 rounded-bl-none"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            )
          })}
        </div>
      </ScrollArea>
      <div className="p-4 border-t border-gray-200">
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            placeholder="Type a message..."
            className="flex-1"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSend()
              }
            }}
          />
          <Button
            onClick={handleSend}
            className="bg-[#11999E] hover:bg-[#11999E]/90"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
