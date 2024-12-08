"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { db, auth } from "@/lib/firebaseConfig";
import { collection, getDocs, addDoc, query, where, doc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const categories = {
  music: ["Rock", "Pop", "Jazz", "Rap", "Classical", "None"],
  sports: ["Football", "Basket", "Tennis", "Running", "Yoga", "None"],
  travel: ["Hiking", "Holiday", "Road Trip", "None"],
  culture: ["Arts", "Theater", "Museum", "Literature", "None"],
  community_involvement: [
    "Environmental Conservation",
    "Animal Welfare",
    "Charity Fundraising",
    "Youth Programs",
    "None",
  ],
  entertainment: ["Movies", "Stand-Up", "Gaming", "None"],
};

export function CreateEventModal({ isOpen, onClose }: CreateEventModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState<Date>();
  const [category, setCategory] = useState<keyof typeof categories | "">("");
  const [subcategory, setSubcategory] = useState("");
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);
  const [currentUserName, setCurrentUserName] = useState<string>("Admin");

  // Fetch the current user's info on mount
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        setCurrentUserEmail(authUser.email);

        const usersRef = collection(db, "users");
        const q = query(usersRef, where("email", "==", authUser.email));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0];
          const userData = userDoc.data();
          setCurrentUserName(userData.name || "Admin");
        }
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!currentUserEmail) {
      alert("No authenticated user found. Please log in again.");
      return;
    }

    try {
      const eventsRef = collection(db, "events");

      // Fetch existing UIDs and calculate the next available UID
      const querySnapshot = await getDocs(eventsRef);
      const existingUids = querySnapshot.docs
        .map((doc) => parseInt(doc.data().uid, 10))
        .filter((uid) => !isNaN(uid))
        .sort((a, b) => a - b);

      let nextUid = 1;
      for (let i = 0; i < existingUids.length; i++) {
        if (existingUids[i] !== nextUid) break;
        nextUid++;
      }

      // Prepare new event data
      const newEvent = {
        uid: nextUid.toString(),
        name,
        description,
        location,
        date: date ? format(date, "yyyy-MM-dd") : "",
        category,
        subcategory,
        organizer: "community",
        points: 3,
        organizer_name: "admin", // Replace with the current user's name dynamically if available
        participants: [],
        price: "0", // Add price as "0"
        feelings: {}, // Add feelings as an empty map
      };

      // Add the new event to Firestore
      await addDoc(eventsRef, newEvent);

      // Update the current user's createdEvents field using the event UID
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", currentUserEmail));
      const userSnapshot = await getDocs(q);

      if (!userSnapshot.empty) {
        const userDoc = userSnapshot.docs[0];
        const userDocRef = doc(db, "users", userDoc.id);

        const userData = userDoc.data();
        const updatedCreatedEvents = [...(userData.createdEvents || []), nextUid.toString()];

        await updateDoc(userDocRef, { createdEvents: updatedCreatedEvents });
      }

      // alert(`Event created successfully with UID ${nextUid}`);
      onClose(); // Close the modal after successful submission
    } catch (error) {
      console.error("Error creating event:", error);
      alert("Failed to create event. Please try again.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-gray-100 rounded-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#40514E]">
            Create New Event
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-[#40514E]">
              Event Name
            </Label>
            <Input
              id="name"
              placeholder="Enter event name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-white border-[#30E3CA] focus:ring-[#11999E]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description" className="text-[#40514E]">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Enter event description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-white border-[#30E3CA] focus:ring-[#11999E]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location" className="text-[#40514E]">
              Location
            </Label>
            <Input
              id="location"
              placeholder="Enter event location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="bg-white border-[#30E3CA] focus:ring-[#11999E]"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-[#40514E]">Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal bg-white border-[#30E3CA] focus:ring-[#11999E]",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-white" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="space-y-2">
            <Label htmlFor="category" className="text-[#40514E]">
              Category
            </Label>
            <Select
              value={category}
              onValueChange={(value) => setCategory(value as keyof typeof categories)}
            >
              <SelectTrigger className="bg-white border-[#30E3CA] focus:ring-[#11999E]">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {Object.keys(categories).map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {category && (
            <div className="space-y-2">
              <Label htmlFor="subcategory" className="text-[#40514E]">
                Subcategory
              </Label>
              <Select value={subcategory} onValueChange={setSubcategory}>
                <SelectTrigger className="bg-white border-[#30E3CA] focus:ring-[#11999E]">
                  <SelectValue placeholder="Select a subcategory" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {categories[category].map((subcat) => (
                    <SelectItem key={subcat} value={subcat}>
                      {subcat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <DialogFooter>
            <Button
              type="submit"
              className="bg-[#11999E] hover:bg-[#11999E]/90 text-white"
            >
              Create Event
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
