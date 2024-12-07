"use client"

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { CalendarIcon } from 'lucide-react'
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

interface CreateEventModalProps {
  isOpen: boolean
  onClose: () => void
}

export function CreateEventModal({ isOpen, onClose }: CreateEventModalProps) {
  const [date, setDate] = useState<Date>()

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    // Handle form submission here
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-[#E4F9F5] rounded-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#40514E]">Create New Event</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-[#40514E]">Event Name</Label>
            <Input id="name" placeholder="Enter event name" className="bg-white border-[#30E3CA] focus:ring-[#11999E]" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description" className="text-[#40514E]">Description</Label>
            <Textarea id="description" placeholder="Enter event description" className="bg-white border-[#30E3CA] focus:ring-[#11999E]" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location" className="text-[#40514E]">Location</Label>
            <Input id="location" placeholder="Enter event location" className="bg-white border-[#30E3CA] focus:ring-[#11999E]" />
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
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar className='bg-white'
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="space-y-2">
            <Label htmlFor="organizer" className="text-[#40514E]">Organizer</Label>
            <Input id="organizer" placeholder="Enter organizer name" className="bg-white border-[#30E3CA] focus:ring-[#11999E]" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="points" className="text-[#40514E]">Points</Label>
            <Input id="points" type="number" placeholder="Enter points" className="bg-white border-[#30E3CA] focus:ring-[#11999E]" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category" className="text-[#40514E]">Category</Label>
            <Input id="category" placeholder="Enter event category" className="bg-white border-[#30E3CA] focus:ring-[#11999E]" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="subcategory" className="text-[#40514E]">Subcategory</Label>
            <Input id="subcategory" placeholder="Enter event subcategory" className="bg-white border-[#30E3CA] focus:ring-[#11999E]" />
          </div>
          <DialogFooter>
            <Button type="submit" className="bg-[#11999E] hover:bg-[#11999E]/90 text-white">Create Event</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
