"use client";

import React, { useEffect, useState, useCallback } from "react";
import { db, auth } from "@/lib/firebaseConfig"; // Import Firestore and Auth config
import { collection, query, where, getDocs, onSnapshot } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, MapPin, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ViewEventModal } from "./view-event-modal";

function EventCard({
  event,
  onView,
  eventImage,
}: {
  event: any;
  onView: () => void;
  eventImage: string;
}) {
  return (
    <Card
      className="relative overflow-hidden h-[300px] rounded-2xl shadow-lg transition-transform duration-300 hover:scale-105 cursor-pointer"
      onClick={onView}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
      <img
        src={eventImage}
        alt={event.name}
        onError={(e) => {
          const img = e.currentTarget;
          img.src = "/events-images/default.png"; // Fallback to default image
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

export function EventCarouselByPreferences() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: "start",
    containScroll: "trimSnaps",
  });

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);
  const [events, setEvents] = useState<any[]>([]);
  const [imageMap, setImageMap] = useState<Record<string, string>>({});
  const [viewingEventUid, setViewingEventUid] = useState<string | null>(null);
  const [userPreferences, setUserPreferences] = useState<Record<string, string[]>>({});

  // Fetch user preferences
  useEffect(() => {
    const fetchUserPreferences = async () => {
      const authUser = auth.currentUser;

      if (authUser) {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("email", "==", authUser.email));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0];
          const userData = userDoc.data();
          setUserPreferences(userData.preferences || {});
        }
      }
    };

    const unsubscribeAuth = onAuthStateChanged(auth, () => {
      fetchUserPreferences();
    });

    return () => unsubscribeAuth();
  }, []);

  // Fetch events matching user preferences
  useEffect(() => {
    const eventsRef = collection(db, "events");

    const unsubscribe = onSnapshot(eventsRef, (snapshot) => {
      const fetchedEvents = snapshot.docs.map((doc) => {
        const data = doc.data();
        const uid = data.uid; // Extract the `uid` field from the document

        return {
          id: doc.id, // Firestore document ID
          uid, // The event's UID
          ...data,
        };
      });

      const matchingEvents = fetchedEvents.filter((event) =>
        Object.keys(userPreferences).some(
          (category) =>
            event.category === category &&
            userPreferences[category]?.some((preference) => preference === event.subcategory)
        )
      );

      // Map UIDs to images
      const uidToImage = matchingEvents.reduce((map, event) => {
        map[event.uid] = `/events-images/${event.uid}.png`;
        return map;
      }, {} as Record<string, string>);

      setEvents(matchingEvents); // Update events state
      setImageMap(uidToImage); // Update image mapping
    });

    return () => unsubscribe(); // Clean up the listener on component unmount
  }, [userPreferences]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback((emblaApi: any) => {
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, []);

  useEffect(() => {
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
            const eventImage = imageMap[event.uid] || "/events-images/default.png"; // Default fallback
            return (
              <div key={event.uid} className="flex-[0_0_350px] min-w-0">
                <EventCard
                  event={event}
                  onView={() => setViewingEventUid(event.uid)}
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
      {viewingEventUid && (
        <ViewEventModal
          eventUid={viewingEventUid}
          isOpen={!!viewingEventUid}
          onClose={() => setViewingEventUid(null)}
          onEdit={() => setViewingEventUid(null)}
          imageMap={imageMap}
        />
      )}
    </div>
  );
}
