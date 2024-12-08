"use client";

import React from "react";
import { db } from "@/lib/firebaseConfig";
import { collection, onSnapshot } from "firebase/firestore";
import { ChevronDown, Calendar, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ViewEventModal } from "./view-event-modal";

export function EventList() {
  const [events, setEvents] = React.useState<any[]>([]);
  const [filteredEvents, setFilteredEvents] = React.useState<any[]>([]);
  const [imageMap, setImageMap] = React.useState<Record<string, string>>({});
  const [sortOption, setSortOption] = React.useState<string>("Date: Recent first");
  const [viewingEventUid, setViewingEventUid] = React.useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = React.useState<string | null>(null);

  // Real-time listener for Firestore events
  React.useEffect(() => {
    const eventsRef = collection(db, "events");

    const unsubscribe = onSnapshot(eventsRef, (snapshot) => {
      const fetchedEvents = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id, // Firestore document ID
          ...data,
        };
      });

      // Map event UIDs to their image paths
      const uidToImageMap = fetchedEvents.reduce((map, event) => {
        map[event.uid] = `/events-images/${event.uid}.png`; // Images mapped by UID
        return map;
      }, {} as Record<string, string>);

      setEvents(fetchedEvents);
      setFilteredEvents(fetchedEvents); // Initially show all events
      setImageMap(uidToImageMap);
    });

    return () => unsubscribe(); // Clean up listener on component unmount
  }, []);

  const handleSort = (option: string) => {
    setSortOption(option);

    const sortedEvents = [...filteredEvents];
    switch (option) {
      case "Date: Later first":
        sortedEvents.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        break;
      case "Date: Recent first":
        sortedEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        break;
      case "Points: High to low":
        sortedEvents.sort((a, b) => b.points - a.points);
        break;
      case "Points: Low to high":
        sortedEvents.sort((a, b) => a.points - b.points);
        break;
      default:
        break;
    }
    setFilteredEvents(sortedEvents);
  };

  const handleFilterByCategory = (category: string | null) => {
    setCategoryFilter(category);
    if (category) {
      setFilteredEvents(events.filter((event) => event.category === category));
    } else {
      setFilteredEvents(events); // Show all events if no category is selected
    }
  };

  const allCategories = Array.from(new Set(events.map((event) => event.category)));

  // Calculate dynamic container height based on the number of filtered events
  const rowHeight = 72; // Height of a single table row in pixels (approximate)
  const containerHeight = Math.min(
    filteredEvents.length * rowHeight,
    600 // Maximum height in pixels
  );

  return (
    <>
      <Card className="rounded-2xl shadow-lg bg-white h-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center gap-4">
            <CardTitle className="text-xl font-bold text-[#40514E]">All Events</CardTitle>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="bg-white rounded-xl">
                  {categoryFilter || "Filter by Category"}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-xl bg-white">
                <DropdownMenuItem onClick={() => handleFilterByCategory(null)}>
                  Show All
                </DropdownMenuItem>
                {allCategories.map((category) => (
                  <DropdownMenuItem key={category} onClick={() => handleFilterByCategory(category)}>
                    {category}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="bg-white rounded-xl">
                {sortOption}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-xl bg-white">
              {["Date: Later first", "Date: Recent first", "Points: High to low", "Points: Low to high"].map(
                (option) => (
                  <DropdownMenuItem key={option} onClick={() => handleSort(option)}>
                    {option}
                  </DropdownMenuItem>
                )
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent className="p-0">
          <div
            className="overflow-auto"
            style={{
              height: `${containerHeight}px`,
            }}
          >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Points</TableHead>
                  <TableHead className="w-[70px]">Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEvents.map((event) => {
                  const eventImage =
                    imageMap[event.uid] || "/events-images/default.png"; // Default image fallback
                  return (
                    <TableRow key={event.id} className="hover:bg-[#E4F9F5]/50">
                      <TableCell>
                        <img
                          src={eventImage}
                          alt={event.name}
                          onError={(e) => {
                            const img = e.currentTarget;
                            img.src = "/events-images/default.png"; // Fallback to default
                          }}
                          className="h-12 w-12 rounded-lg object-cover"
                        />
                      </TableCell>
                      <TableCell className="font-medium">{event.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Calendar className="mr-2 h-4 w-4 text-[#11999E]" />
                          {new Date(event.date).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <MapPin className="mr-2 h-4 w-4 text-[#11999E]" />
                          {event.location}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="bg-[#30E3CA] text-[#40514E]">
                          {event.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium">{event.points}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-full"
                          onClick={() => setViewingEventUid(event.uid)}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      {viewingEventUid && (
        <ViewEventModal
          eventUid={viewingEventUid}
          isOpen={!!viewingEventUid}
          onClose={() => setViewingEventUid(null)}
          onEdit={() => setViewingEventUid(null)}
          imageMap={imageMap}
        />
      )}
    </>
  );
}
