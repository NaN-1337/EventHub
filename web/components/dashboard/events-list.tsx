"use client";

import React from "react";
import { db } from "@/lib/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { ChevronDown, MoreHorizontal, Calendar, MapPin } from "lucide-react";
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

export function EventList() {
  const [events, setEvents] = React.useState<any[]>([]);
  const [imageMap, setImageMap] = React.useState<Record<string, string>>({});
  const [sortOption, setSortOption] = React.useState<string>("Date: Newest first");

  const fetchAllEvents = React.useCallback(async () => {
    try {
      const eventsRef = collection(db, "events");
      const querySnapshot = await getDocs(eventsRef);
      const fetchedEvents = querySnapshot.docs.map((doc, index) => {
        const uuid = doc.id;
        const imageFile = `${index + 1}.png`;
        return {
          id: uuid,
          image: imageFile,
          ...doc.data(),
        };
      });

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

  const handleSort = (option: string) => {
    setSortOption(option);

    const sortedEvents = [...events];
    switch (option) {
      case "Date: Newest first":
        sortedEvents.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        break;
      case "Date: Oldest first":
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
    setEvents(sortedEvents);
  };

  React.useEffect(() => {
    fetchAllEvents();
  }, [fetchAllEvents]);

  return (
    <Card className="rounded-2xl shadow-lg bg-white h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold text-[#40514E]">All Events</CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="bg-white rounded-xl">
              {sortOption}
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="rounded-xl bg-white">
            {["Date: Newest first", "Date: Oldest first", "Points: High to low", "Points: Low to high"].map(
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
        <div className="overflow-auto h-[calc(100vh-12rem)]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Points</TableHead>
                <TableHead className="w-[70px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.map((event) => {
                const eventImage =
                  imageMap[event.id] || "/events-images/default.png";
                return (
                  <TableRow key={event.id} className="hover:bg-[#E4F9F5]/50">
                    <TableCell>
                      <img
                        src={eventImage}
                        alt={event.name}
                        onError={(e) => {
                          const img = e.currentTarget;
                          img.src = "/events-images/default.png";
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
                      <Button variant="ghost" size="icon" className="rounded-full">
                        <MoreHorizontal className="h-4 w-4" />
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
  );
}
