"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { db } from "@/lib/firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";

interface ViewEventModalProps {
  eventUid: string; // Event UID to fetch details
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  imageMap: Record<string, string>; // Mapping from Event UIDs to Image URLs
}

export function ViewEventModal({ eventUid, isOpen, onClose, onEdit, imageMap }: ViewEventModalProps) {
  const [event, setEvent] = useState<{
    name: string;
    description: string;
    location: string;
    date: string;
    organizer: string;
    points: number;
    category: string;
    subcategory: string;
  } | null>(null);
  const [eventImage, setEventImage] = useState<string>("/events-images/default.png");

  useEffect(() => {
    const fetchEvent = async () => {
      if (!eventUid) return;

      try {
        const eventsRef = collection(db, "events");
        const q = query(eventsRef, where("uid", "==", eventUid));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const eventData = querySnapshot.docs[0].data();
          setEvent(eventData);

          const imagePath = imageMap[eventUid] || "/events-images/default.png";
          setEventImage(imagePath);
        } else {
          console.error(`No event found with UID: ${eventUid}`);
        }
      } catch (error) {
        console.error("Error fetching event by UID:", error);
      }
    };

    if (isOpen) fetchEvent();
  }, [eventUid, isOpen, imageMap]);

  if (!event) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[600px] bg-gray-100 rounded-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-[#40514E]">Loading Event...</DialogTitle>
          </DialogHeader>
          <p className="text-center text-[#40514E]">Please wait while the event is loaded.</p>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-gray-100 rounded-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#40514E]">{event.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Event Image */}
          <img
            src={eventImage}
            alt={`Image for ${event.name}`}
            onError={(e) => {
              console.error(
                `Image load failed for event UID ${eventUid}. Falling back to default image.`
              );
              e.currentTarget.src = "/events-images/default.png"; // Fallback to default
            }}
            className="w-full h-48 object-cover rounded-lg"
          />
          {/* Event Details */}
          <p className="text-[#40514E]">{event.description}</p>
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-[#11999E]" />
            <span>{new Date(event.date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-[#11999E]" />
            <span>{event.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-[#11999E]" />
            <span>{event.organizer}</span>
          </div>
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-[#11999E]" />
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
          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button onClick={onClose} variant="outline">
              Close
            </Button>
            <Button onClick={onEdit} className="bg-[#11999E] hover:bg-[#11999E]/90 text-white">
              Edit Event
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
