"use client"

import { useState } from "react"
import { Search, Users } from "lucide-react"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

interface Group {
  id: string
  name: string
  participants: string[]
  avatar?: string
}

interface GroupsListProps {
  groups: Group[]
  selectedConversationId: string | null
  onSelectGroup: (group: Group) => void
  onNewGroup: () => void
}

export function GroupsList({ groups, selectedConversationId, onSelectGroup, onNewGroup }: GroupsListProps) {
  const [search, setSearch] = useState("")

  const filteredGroups = groups.filter(g =>
    g.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input
              placeholder="Search groups..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 bg-white border-[#30E3CA] focus:ring-[#11999E]"
            />
          </div>
          <Button onClick={onNewGroup} variant="outline" className="bg-[#30E3CA] text-white hover:bg-[#11999E] transition-colors">
            <Users className="h-4 w-4 mr-2" />
            New Group
          </Button>
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2">
          {filteredGroups.map((group) => (
            <button
              key={group.id}
              onClick={() => onSelectGroup(group)}
              className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                selectedConversationId === group.id
                  ? "bg-[#E4F9F5]"
                  : "hover:bg-gray-100"
              }`}
            >
              <Avatar>
                <AvatarImage src={group.avatar || `https://avatar.vercel.sh/${group.id}`} />
                <AvatarFallback className="bg-[#30E3CA] text-[#40514E]">
                  {group.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-left">
                <div className="font-medium text-[#40514E]">{group.name}</div>
                <div className="text-sm text-gray-500 truncate">
                  {group.participants.length} participants
                </div>
              </div>
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
