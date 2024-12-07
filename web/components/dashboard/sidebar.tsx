"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, User, Users, Calendar, Globe2, Mail } from 'lucide-react'
import { Button } from "@/components/ui/button"

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Profile",
    href: "/dashboard/profile",
    icon: User,
  },
  {
    name: "Friends",
    href: "/dashboard/friends",
    icon: Users,
  },
  {
    name: "My Events",
    href: "/dashboard/my-events",
    icon: Calendar,
  },
  {
    name: "All Events",
    href: "/dashboard/all-events",
    icon: Globe2,
  },
  {
    name: "Contact",
    href: "/dashboard/contact",
    icon: Mail,
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-64 flex-col bg-[#11999E] rounded-r-3xl shadow-lg">
      <div className="flex h-16 items-center px-6">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="text-[#E4F9F5] text-2xl font-bold">E</div>
          <span className="text-lg font-semibold text-[#E4F9F5]">EventHub</span>
        </Link>
      </div>
      <nav className="flex-1 space-y-2 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Button
              key={item.name}
              variant={isActive ? "default" : "ghost"}
              className={cn(
                "w-full justify-start rounded-xl transition-all duration-200",
                isActive 
                  ? "bg-[#ffffff] text-[#40514E] hover:bg-[#ffffff]/90" 
                  : "text-[#E4F9F5] hover:bg-[#30E3CA]/20"
              )}
              asChild
            >
              <Link href={item.href}>
                <item.icon className="mr-2 h-5 w-5" />
                {item.name}
              </Link>
            </Button>
          )
        })}
      </nav>
      <div className="p-4 text-xs text-[#E4F9F5]/80">
        <p>EventHub Dashboard</p>
        <p>© 2023 All rights reserved</p>
      </div>
    </div>
  )
}

