import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { ChatInterface } from "@/components/friends/chat-interface"

export default function FriendsPage() {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-8">
          <ChatInterface />
        </main>
      </div>
    </div>
  )
}
