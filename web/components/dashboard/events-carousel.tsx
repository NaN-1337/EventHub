"use client"

import * as React from "react"
import useEmblaCarousel from "embla-carousel-react"
import { ChevronLeft, ChevronRight, MapPin, Calendar } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const events = [
  {
    uid: "e1",
    name: "Local Rock Concert at The Old Brewery",
    description: "A night of live rock music featuring up-and-coming bands, craft beer, and a community atmosphere.",
    location: "The Old Brewery",
    date: "2025-04-01",
    organizer: "community",
    points: 5,
    participants: [],
    category: "music",
    subcategory: "Rock",
  },
  // Add more sample events here
]

function EventCard({ event }: { event: typeof events[0] }) {
  return (
    <Card className="relative overflow-hidden h-[300px] rounded-2xl shadow-lg transition-transform duration-300 hover:scale-105">
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
      <img
        src={`rock-poster.png`}
        alt={event.name}
        className="h-full w-full object-cover"
      />
      <CardContent className="absolute bottom-0 left-0 right-0 z-20 p-4 text-white">
        <div className="mb-2 flex items-center gap-2">
          <Badge variant="secondary" className="bg-[#30E3CA] text-[#40514E]">
            {event.points} points
          </Badge>
          <Badge variant="outline" className="text-[#E4F9F5] border-[#E4F9F5]">
            {event.category}
          </Badge>
        </div>
        <h3 className="mb-2 text-xl font-bold">{event.name}</h3>
        <div className="space-y-1 text-sm">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{new Date(event.date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            <span>{event.location}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function EventCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: false, 
    align: "start",
    containScroll: "trimSnaps" 
  })

  const [canScrollPrev, setCanScrollPrev] = React.useState(false)
  const [canScrollNext, setCanScrollNext] = React.useState(true)

  const scrollPrev = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  const onSelect = React.useCallback((emblaApi: any) => {
    setCanScrollPrev(emblaApi.canScrollPrev())
    setCanScrollNext(emblaApi.canScrollNext())
  }, [])

  React.useEffect(() => {
    if (!emblaApi) return

    onSelect(emblaApi)
    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', onSelect)
  }, [emblaApi, onSelect])

  return (
    <div className="relative">
      <div className="overflow-hidden rounded-2xl" ref={emblaRef}>
        <div className="flex gap-6">
          {events.map((event) => (
            <div key={event.uid} className="flex-[0_0_350px] min-w-0">
              <EventCard event={event} />
            </div>
          ))}
        </div>
      </div>
      {canScrollPrev && (
        <Button
          variant="secondary"
          size="icon"
          className="absolute -left-4 top-1/2 -translate-y-1/2 bg-white rounded-full shadow-md"
          onClick={scrollPrev}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      )}
      {canScrollNext && (
        <Button
          variant="secondary"
          size="icon"
          className="absolute -right-4 top-1/2 -translate-y-1/2 bg-white rounded-full shadow-md"
          onClick={scrollNext}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}

