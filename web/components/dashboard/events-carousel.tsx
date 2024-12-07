"use client";

import * as React from "react";
import { db } from "@/lib/firebaseConfig"; // Import Firestore from your config
import { collection, getDocs } from "firebase/firestore";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, MapPin, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EditEventModal } from "./edit-event-modal";

function EventCard({
  event,
  onEdit,
  eventImage,
}: {
  event: any;
  onEdit: () => void;
  eventImage: string;
}) {
  return (
    <Card
      className="relative overflow-hidden h-[300px] rounded-2xl shadow-lg transition-transform duration-300 hover:scale-105 cursor-pointer"
      onClick={onEdit}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
      <img
        src={eventImage}
        alt={event.name}
        onError={(e) => {
          const img = e.currentTarget;
          img.src = "/events-images/default.png"; // Fallback image
        }}
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
  );
}

export function EventCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: "start",
    containScroll: "trimSnaps",
  });

  const [canScrollPrev, setCanScrollPrev] = React.useState(false);
  const [canScrollNext, setCanScrollNext] = React.useState(true);
  const [events, setEvents] = React.useState<any[]>([]); // State to hold events
  const [imageMap, setImageMap] = React.useState<Record<string, string>>({}); // Map for UUID-to-image mapping
  const [editingEvent, setEditingEvent] = React.useState<any | null>(null);

  const fetchAllEvents = React.useCallback(async () => {
    try {
      const eventsRef = collection(db, "events");
      const querySnapshot = await getDocs(eventsRef);
      const fetchedEvents = querySnapshot.docs.map((doc, index) => {
        const uuid = doc.id;
        const imageFile = `${index + 1}.png`; // Assign images in sequence
        return {
          id: uuid,
          image: imageFile,
          ...doc.data(),
        };
      });

      // Create the UUID-to-image map
      const uuidToImage = fetchedEvents.reduce((map, event) => {
        map[event.id] = `/events-images/${event.image}`;
        return map;
      }, {} as Record<string, string>);

      setEvents(fetchedEvents);
      setImageMap(uuidToImage);
    } catch (error) {
      console.error("Error fetching all events:", error);
    }
  }, []);

  React.useEffect(() => {
    fetchAllEvents();
  }, [fetchAllEvents]);

  const scrollPrev = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = React.useCallback((emblaApi: any) => {
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, []);

  React.useEffect(() => {
    if (!emblaApi) return;

    onSelect(emblaApi);
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  return (
    <div className="relative">
      <div className="overflow-hidden rounded-2xl" ref={emblaRef}>
        <div className="flex gap-6">
          {events.map((event) => {
            const eventImage = imageMap[event.id] || "/events-images/default.png"; // Fallback image
            return (
              <div key={event.id} className="flex-[0_0_350px] min-w-0">
                <EventCard
                  event={event}
                  onEdit={() => setEditingEvent(event)}
                  eventImage={eventImage}
                />
              </div>
            );
          })}
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
      {editingEvent && (
        <EditEventModal
          event={editingEvent}
          isOpen={!!editingEvent}
          onClose={() => setEditingEvent(null)}
        />
      )}
    </div>
  );
}
