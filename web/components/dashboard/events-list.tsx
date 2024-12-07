"use client";

import * as React from "react";
import { db } from "@/lib/firebaseConfig"; // Import Firestore from your config
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
  const [events, setEvents] = React.useState<any[]>([]); // State to hold events

  const fetchAllEvents = React.useCallback(async () => {
    try {
      const eventsRef = collection(db, "events");
      const querySnapshot = await getDocs(eventsRef);
      const fetchedEvents = querySnapshot.docs.map((doc) => ({
        id: doc.id, // Firestore document ID
        ...doc.data(), // Event data
      }));
      setEvents(fetchedEvents);
    } catch (error) {
      console.error("Error fetching all events:", error);
    }
  }, []);

  React.useEffect(() => {
    fetchAllEvents();
  }, [fetchAllEvents]);

  return (
    <Card className="rounded-2xl shadow-lg bg-white">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold text-[#40514E]">Event List</CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="bg-white rounded-xl">
              Sort by
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="rounded-xl bg-white">
            <DropdownMenuItem>Date: Newest first</DropdownMenuItem>
            <DropdownMenuItem>Date: Oldest first</DropdownMenuItem>
            <DropdownMenuItem>Points: High to low</DropdownMenuItem>
            <DropdownMenuItem>Points: Low to high</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
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
            {events.map((event) => (
              <TableRow key={event.uid} className="hover:bg-[#E4F9F5]/50">
                <TableCell>
                  <img
                    src={`https://source.unsplash.com/random/100x100?${event.category}`}
                    alt={event.name}
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
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
