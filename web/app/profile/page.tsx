'use client'

import { ProfileForm } from "@/components/profile/profile-form"
import { Bell } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CardTitle } from "@/components/ui/card"

export default function ProfilePage() {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div className="relative w-96">
            <CardTitle>Profile Settings</CardTitle>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          <Avatar>
            <AvatarImage src="/avatar.svg" />
            <AvatarFallback>SC</AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Profile Content */}
      <div className="max-w-4xl mx-auto">
        <ProfileForm />
      </div>
    </div>
  )
}

