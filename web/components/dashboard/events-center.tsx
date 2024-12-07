"use client"

import { Plus } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { EventCarousel } from "./events-carousel"

export function EventsCenter() {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#40514E]">Featured Events</h2>
        <Button className="bg-[#11999E] hover:bg-[#11999E]/90 rounded-xl">
          <Plus className="mr-2 h-4 w-4" />
          Create Event
        </Button>
      </div>
      <EventCarousel />
    </div>
  )
}

