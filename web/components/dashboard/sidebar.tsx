"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  User,
  Users,
  Calendar,
  Globe2,
  Mail,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebaseConfig";

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Profile",
    href: "/profile",
    icon: User,
  },
  {
    name: "Co-Workers",
    href: "/friends",
    icon: Users,
  },
  {
    name: "My Events",
    href: "/dashboard/my-events",
    icon: Calendar,
  },
  {
    name: "All Events",
    href: "/all-events",
    icon: Globe2,
  },
  {
    name: "Contact",
    href: "/dashboard/contact",
    icon: Mail,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth); // Sign out the user
      router.push("/login"); // Redirect to the login page
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

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
          const isActive = pathname === item.href;
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
          );
        })}
      </nav>
      <div className="p-4">
        <Button
          variant="ghost"
          className="w-full justify-start rounded-xl text-[#E4F9F5] hover:bg-[#30E3CA]/20"
          onClick={handleLogout} // Attach the logout handler
        >
          <LogOut className="mr-2 h-5 w-5" />
          Logout
        </Button>
      </div>
      <div className="p-4 text-xs text-[#E4F9F5]/80">
        <p>EventHub Dashboard</p>
        <p>© 2023 All rights reserved</p>
      </div>
    </div>
  );
}
