import { Header } from "@/components/dashboard/header"
import { Sidebar } from "@/components/dashboard/sidebar"
import ProfileContent from "@/components/profile/profile-content"

export default function ProfilePage() {
  return (
    <div className="flex h-screen bg-[#E4F9F5]">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-auto p-8">
          <ProfileContent />
        </main>
      </div>
    </div>
  )
}

