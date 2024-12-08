"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface User {
  uid: string
  name: string
  email: string
  avatar: string
}

interface NewGroupDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreateGroup: (name: string, participantUids: string[]) => void
  currentUser: User | null
  users: User[]
}

export function NewGroupDialog({
  open,
  onOpenChange,
  onCreateGroup,
  currentUser,
  users
}: NewGroupDialogProps) {
  const [search, setSearch] = useState("")
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [groupName, setGroupName] = useState("")

  const filteredUsers = users.filter(user =>
    user.uid !== currentUser?.uid &&
    (user.name.toLowerCase().includes(search.toLowerCase()) ||
     user.email.toLowerCase().includes(search.toLowerCase()))
  )

  const toggleUserSelection = (uid: string) => {
    setSelectedUsers((prev) =>
      prev.includes(uid) ? prev.filter(id => id !== uid) : [...prev, uid]
    )
  }

  const handleCreateGroup = () => {
    if (!groupName.trim() || selectedUsers.length === 0) return
    onCreateGroup(groupName, selectedUsers)
    onOpenChange(false)
    setGroupName("")
    setSelectedUsers([])
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#40514E]">Create New Group</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Group Name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="bg-white border-[#30E3CA] focus:ring-[#11999E]"
          />
          <div className="relative">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 bg-white border-[#30E3CA] focus:ring-[#11999E]"
            />
          </div>
          <ScrollArea className="h-64 border rounded-md p-2">
            {filteredUsers.map((user) => {
              const isSelected = selectedUsers.includes(user.uid)
              return (
                <div
                  key={user.uid}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#E4F9F5] cursor-pointer"
                  onClick={() => toggleUserSelection(user.uid)}
                >
                  <Checkbox 
                    checked={isSelected} 
                    onCheckedChange={() => toggleUserSelection(user.uid)}
                    className="border-[#30E3CA] text-[#11999E]"
                  />
                  <Avatar>
                    <AvatarImage src={user.avatar || `https://avatar.vercel.sh/${user.uid}`} />
                    <AvatarFallback className="bg-[#30E3CA] text-[#40514E]">
                      {user.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-left">
                    <div className="font-medium text-[#40514E]">{user.name}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </div>
                </div>
              )
            })}
          </ScrollArea>
        </div>
        <DialogFooter>
          <Button 
            onClick={handleCreateGroup} 
            className="bg-[#11999E] hover:bg-[#11999E]/90 text-white"
          >
            Create Group
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
