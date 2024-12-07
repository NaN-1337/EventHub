"use client"

import { useEffect, useState } from "react"
import { Bell, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function Header() {
  const [fullName, setFullName] = useState<string | null>(null)

  useEffect(() => {
    // Simulating fetching user data
    setFullName("ANDREI") // Replace with actual fetch call
  }, [])

  return (
    <header className="h-auto bg-gray-100 px-8 py-4">
      <div className="flex items-center justify-between">
        {/* Welcome Message */}
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-[#40514E]">
            Welcome, {fullName || "there"}!
          </h1>
          <p className="text-sm text-[#40514E]/70 mt-1">
            Ready to explore exciting events?
          </p>
        </div>

        {/* Notifications and Profile */}
        <div className="flex items-center gap-6">
          {/* Notification Button */}
          <Button
            variant="ghost"
            size="icon"
            className="relative rounded-xl text-[#40514E] hover:bg-[#E4F9F5]"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute -right-1 -top-1 h-5 w-5 rounded-full bg-[#11999E] text-[10px] font-medium text-white flex items-center justify-center">
              3
            </span>
          </Button>

          {/* Messages Button */}
          <Button
            variant="ghost"
            size="icon"
            className="relative rounded-xl text-[#40514E] hover:bg-[#E4F9F5]"
          >
            <MessageSquare className="h-5 w-5" />
            <span className="absolute -right-1 -top-1 h-5 w-5 rounded-full bg-[#11999E] text-[10px] font-medium text-white flex items-center justify-center">
              5
            </span>
          </Button>

          {/* User Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="h-10 w-10 cursor-pointer">
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt={fullName || "User"}
                />
                <AvatarFallback>AN</AvatarFallback>
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
    </header>
  )
}
