import { Header } from "@/components/dashboard/header"
import { Sidebar } from "@/components/dashboard/sidebar"
import { EventsCenter } from "@/components/dashboard/events-center"
import { EventList } from "@/components/dashboard/events-list"
import { EventStatistic } from "@/components/dashboard/event-statistic"
import { EventMonthlyEvolution } from "@/components/dashboard/event-evolution"
import { EventMonthlyEvolutionAI } from "@/components/dashboard/event-evolution-ai"

export default function DashboardPage() {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-auto p-8">
          <EventsCenter />
          <div className="mt-8">
            <EventList />
          </div>
          <div>
            <EventStatistic />
            <EventMonthlyEvolution />
            <EventMonthlyEvolutionAI />
          </div>
        </main>
      </div>
    </div>
  )
}

