"use client"

import { Bell, MessageSquare, Search } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function Header() {
  return (
    <header className="h-16 bg-gray-100 px-8">
      <div className="flex h-full items-center justify-between">
        {/* Search Bar */}
        <div className="flex items-center gap-4 flex-1 max-w-xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#40514E]/50 bg-white" />
            <Input
              placeholder="Search events..."
              className="pl-9 bg-[#E4F9F5] border-gray-100 rounded-xl focus:ring-[#11999E] bg-white"
            />
          </div>
        </div>

        {/* Notifications and Profile */}
        <div className="flex items-center gap-6">
          {/* Notification Button */}
          <Button variant="ghost" size="icon" className="relative rounded-xl text-[#40514E] hover:bg-[#E4F9F5]">
            <Bell className="h-5 w-5" />
            <span className="absolute -right-1 -top-1 h-5 w-5 rounded-full bg-[#11999E] text-[10px] font-medium text-white flex items-center justify-center">
              3
            </span>
          </Button>

          {/* Messages Button */}
          <Button variant="ghost" size="icon" className="relative rounded-xl text-[#40514E] hover:bg-[#E4F9F5]">
            <MessageSquare className="h-5 w-5" />
            <span className="absolute -right-1 -top-1 h-5 w-5 rounded-full bg-[#11999E] text-[10px] font-medium text-white flex items-center justify-center">
              5
            </span>
          </Button>

          {/* User Profile */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-sm font-medium text-[#40514E]">Hello, Franklin</div>
              <div className="text-xs text-[#40514E]/70">Event Organizer</div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="h-10 w-10 cursor-pointer">
                  <AvatarImage src="https://github.com/shadcn.png" alt="Franklin" />
                  <AvatarFallback>FJ</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-xl bg-white">
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}
