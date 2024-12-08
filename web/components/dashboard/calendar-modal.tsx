"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { db } from "@/lib/firebaseConfig"; // Firestore config
import { Button } from "@/components/ui/button"; // Import Button component
import { collection, query, where, getDocs } from "firebase/firestore";

interface CalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail: string;
}

export function CalendarModal({ isOpen, onClose, userEmail }: CalendarModalProps) {
  const [eventDates, setEventDates] = useState<Date[]>([]);

  useEffect(() => {
    const fetchUserEvents = async () => {
      if (!userEmail) return;

      try {
        const usersRef = collection(db, "users");
        const userQuery = query(usersRef, where("email", "==", userEmail));
        const userSnapshot = await getDocs(userQuery);

        if (!userSnapshot.empty) {
          const userData = userSnapshot.docs[0].data();
          const createdEvents = userData.createdEvents || [];

          const eventsRef = collection(db, "events");
          const eventsQuery = query(eventsRef, where("uid", "in", createdEvents));
          const eventSnapshot = await getDocs(eventsQuery);

          const dates = eventSnapshot.docs.map((doc) => {
            const eventDate = doc.data().date;
            return new Date(eventDate);
          });

          setEventDates(dates);
        }
      } catch (error) {
        console.error("Error fetching user events:", error);
      }
    };

    if (isOpen) {
      fetchUserEvents();
    }
  }, [isOpen, userEmail]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-gray-100 rounded-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#40514E]">Your Event Calendar</DialogTitle>
        </DialogHeader>
        <div className="p-4">
          <Calendar
            selected={eventDates}
            mode="multiple"
            disabled={(date) =>
              !eventDates.some((eventDate) => eventDate.toDateString() === date.toDateString())
            }
            className="border border-[#30E3CA] rounded-lg"
          />
        </div>
        <div className="flex justify-end mt-4">
          <Button onClick={onClose} variant="outline">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
