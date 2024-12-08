"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface User {
  uid: string
  name: string
  email: string
  avatar: string
}

interface UsersListProps {
  users: User[]
  currentUser: User | null
  selectedConversationId: string | null
  onSelectUser: (user: User) => void
}

export function UsersList({ users, currentUser, selectedConversationId, onSelectUser }: UsersListProps) {
  const [search, setSearch] = useState("")

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-200">
        <div className="relative mb-4">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2">
          {filteredUsers.map((user) => {
            if (user.uid === currentUser?.uid) return null
            return (
              <button
                key={user.uid}
                onClick={() => onSelectUser(user)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  selectedConversationId && selectedConversationId.includes(user.uid)
                    ? "bg-[#E4F9F5]"
                    : "hover:bg-gray-100"
                }`}
              >
                <Avatar>
                  <AvatarImage src={user.avatar || `https://avatar.vercel.sh/${user.uid}`} />
                  <AvatarFallback>
                    {user.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left">
                  <div className="font-medium">{user.name}</div>
                  <div className="text-sm text-gray-500 truncate">
                    {user.email}
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </ScrollArea>
    </div>
  )
}
