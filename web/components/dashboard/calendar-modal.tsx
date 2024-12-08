"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { db } from "@/lib/firebaseConfig";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { collection, query, where, getDocs } from "firebase/firestore";
import { CalendarDays, MapPin, Users, Award } from "lucide-react";

interface CalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail: string;
}

interface Event {
  uid: string;
  name: string;
  description: string;
  date: string;
  location: string;
  organizer: string;
  points: number;
  category: string;
  subcategory: string;
}

export function CalendarModal({ isOpen, onClose, userEmail }: CalendarModalProps) {
  const [createdEvents, setCreatedEvents] = useState<Event[]>([]);
  const [joinedEvents, setJoinedEvents] = useState<Event[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedEvents, setSelectedEvents] = useState<Event[]>([]);
  const [imageMap, setImageMap] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchUserEvents = async () => {
      if (!userEmail) return;

      try {
        const usersRef = collection(db, "users");
        const userQuery = query(usersRef, where("email", "==", userEmail));
        const userSnapshot = await getDocs(userQuery);

        if (!userSnapshot.empty) {
          const userData = userSnapshot.docs[0].data();
          const createdEventIds = userData.createdEvents || [];
          const joinedEventIds = userData.joinedEvents || [];

          const eventsRef = collection(db, "events");

          const fetchEvents = async (eventIds: string[]) => {
            if (eventIds.length === 0) return [];
            const eventsQuery = query(eventsRef, where("uid", "in", eventIds));
            const eventSnapshot = await getDocs(eventsQuery);
            return eventSnapshot.docs.map((doc) => ({
              uid: doc.id,
              ...doc.data(),
            })) as Event[];
          };

          const fetchedCreatedEvents = await fetchEvents(createdEventIds);
          const fetchedJoinedEvents = await fetchEvents(joinedEventIds);

          setCreatedEvents(fetchedCreatedEvents);
          setJoinedEvents(fetchedJoinedEvents);

          const newImageMap = [...fetchedCreatedEvents, ...fetchedJoinedEvents].reduce(
            (acc, event) => {
              acc[event.uid] = `/events-images/${event.uid}.png`;
              return acc;
            },
            {} as Record<string, string>
          );
          setImageMap(newImageMap);

          const today = new Date();
          const todayEvents = [...fetchedCreatedEvents, ...fetchedJoinedEvents].filter(
            (event) => new Date(event.date).toDateString() === today.toDateString()
          );
          setSelectedEvents(todayEvents);
        }
      } catch (error) {
        console.error("Error fetching user events:", error);
      }
    };

    if (isOpen) {
      fetchUserEvents();
    }
  }, [isOpen, userEmail]);

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      const eventsOnDate = [...createdEvents, ...joinedEvents].filter(
        (event) => new Date(event.date).toDateString() === date.toDateString()
      );
      setSelectedEvents(eventsOnDate);
    } else {
      setSelectedEvents([]);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] bg-white rounded-2xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-[#40514E]">Your Event Calendar</DialogTitle>
        </DialogHeader>
        <div className="flex gap-6 p-4">
          <div className="flex-1">
            <Calendar
              selected={selectedDate}
              onSelect={handleDateSelect}
              mode="single"
              className="rounded-md border-2 border-[#30E3CA] p-3"
              classNames={{
                day_today: "bg-[#E4F9F5] text-[#40514E]",
                day_selected: "bg-[#11999E] text-white hover:bg-[#11999E] hover:text-white",
              }}
              components={{
                Day: ({ date }) => {
                  const hasEvent = [...createdEvents, ...joinedEvents].some(
                    (event) => new Date(event.date).toDateString() === date.toDateString()
                  );
                  return (
                    <div
                      className={`relative ${hasEvent ? "cursor-pointer" : ""}`}
                      onClick={() => hasEvent && handleDateSelect(date)}
                    >
                      <div>{date.getDate()}</div>
                      {hasEvent && (
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
                          <div className="h-1 w-1 bg-[#11999E] rounded-full"></div>
                        </div>
                      )}
                    </div>
                  );
                },
              }}
            />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold mb-4 text-[#40514E]">
              Events on {selectedDate ? selectedDate.toLocaleDateString() : "Selected Date"}
            </h3>
            <ScrollArea className="h-[400px] pr-4">
              {selectedEvents.length > 0 ? (
                selectedEvents.map((event) => (
                  <div
                    key={event.uid}
                    className={`mb-4 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow ${
                      createdEvents.some((e) => e.uid === event.uid) ? "bg-[#E4F9F5]" : "bg-[#FCE4EC]"
                    }`}
                  >
                    <img
                      src={imageMap[event.uid] || "/events-images/default.png"}
                      alt={`Image for ${event.name}`}
                      onError={(e) => {
                        e.currentTarget.src = "/events-images/default.png";
                      }}
                      className="w-full h-32 object-cover rounded-lg mb-3"
                    />
                    <h4 className="font-semibold text-lg text-[#40514E] mb-2">{event.name}</h4>
                    <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                    <div className="flex items-center gap-2 mb-1">
                      <CalendarDays className="h-4 w-4 text-[#11999E]" />
                      <span>{new Date(event.date).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      <MapPin className="h-4 w-4 text-[#11999E]" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      <Users className="h-4 w-4 text-[#11999E]" />
                      <span>{event.organizer}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <Award className="h-4 w-4 text-[#11999E]" />
                      <span>{event.points} points</span>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="secondary" className="bg-[#30E3CA] text-[#40514E]">
                        {event.category}
                      </Badge>
                      <Badge variant="outline" className="text-[#40514E] border-[#40514E]">
                        {event.subcategory}
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 italic">No events on the selected date</p>
              )}
            </ScrollArea>
          </div>
        </div>
        <div className="flex justify-end mt-4 px-4 pb-4">
          <Button onClick={onClose} variant="outline" className="text-[#11999E] border-[#11999E]">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
