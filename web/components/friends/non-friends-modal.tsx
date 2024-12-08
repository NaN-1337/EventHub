"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search } from "lucide-react"
import { useState } from "react"

interface User {
  uid: string
  name: string
  email: string
  avatar: string
  friends?: string[]
}

interface NonFriendsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  nonFriendUsers: User[]
  onViewDetails: (user: User) => void
}

export function NonFriendsModal({ open, onOpenChange, nonFriendUsers, onViewDetails }: NonFriendsModalProps) {
    const [search, setSearch] = useState("")
  
    const filteredNonFriends = nonFriendUsers.filter(u =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
    )
  
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px] bg-white rounded-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-[#40514E]">
              Add New Co-Workers
            </DialogTitle>
          </DialogHeader>
          <div className="p-4 space-y-4">
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
              {filteredNonFriends.map((user) => (
                <div
                  key={user.uid}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-[#E4F9F5]"
                >
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={user.avatar || `https://avatar.vercel.sh/${user.uid}`} />
                      <AvatarFallback className="bg-[#30E3CA] text-[#40514E]">
                        {user.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-left">
                      <div className="font-medium text-[#40514E]">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => onViewDetails(user)}
                    className="bg-[#E4F9F5] text-[#11999E] hover:bg-[#30E3CA] hover:text-white"
                  >
                    View Details
                  </Button>
                </div>
              ))}
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>
    );
}
