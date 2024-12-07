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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

interface EditEventModalProps {
  event: {
    id: string
    name: string
    description: string
    location: string
    date: string
    category: string
    subcategory: string
  }
  isOpen: boolean
  onClose: () => void
}

const categories = {
  music: ["Rock", "Pop", "Jazz", "Rap", "Classical", "None"],
  sports: ["Football", "Basket", "Tennis", "Running", "Yoga", "None"],
  travel: ["Hiking", "Holiday", "Road Trip", "None"],
  culture: ["Arts", "Theater", "Museum", "Literature", "None"],
  community_involvement: ["Environmental Conservation", "Animal Welfare", "Charity Fundraising", "Youth Programs", "None"],
  entertainment: ["Movies", "Stand-Up", "Gaming", "None"]
}

export function EditEventModal({ event, isOpen, onClose }: EditEventModalProps) {
  const [date, setDate] = useState<Date | undefined>(new Date(event.date))
  const [category, setCategory] = useState<keyof typeof categories>(event.category as keyof typeof categories)
  const [subcategory, setSubcategory] = useState(event.subcategory)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Handle form submission here
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-gray-100 rounded-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#40514E]">Edit Event</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-[#40514E]">Event Name</Label>
            <Input id="name" defaultValue={event.name} className="bg-white border-[#30E3CA] focus:ring-[#11999E]" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description" className="text-[#40514E]">Description</Label>
            <Textarea id="description" defaultValue={event.description} className="bg-white border-[#30E3CA] focus:ring-[#11999E]" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location" className="text-[#40514E]">Location</Label>
            <Input id="location" defaultValue={event.location} className="bg-white border-[#30E3CA] focus:ring-[#11999E]" />
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
            <Label htmlFor="category" className="text-[#40514E]">Category</Label>
            <Select value={category} onValueChange={(value) => setCategory(value as keyof typeof categories)}>
              <SelectTrigger className="bg-white border-[#30E3CA] focus:ring-[#11999E]">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {Object.keys(categories).map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="subcategory" className="text-[#40514E]">Subcategory</Label>
            <Select value={subcategory} onValueChange={setSubcategory}>
              <SelectTrigger className="bg-white border-[#30E3CA] focus:ring-[#11999E]">
                <SelectValue placeholder="Select a subcategory" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {categories[category].map((subcat) => (
                  <SelectItem key={subcat} value={subcat}>{subcat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="submit" className="bg-[#11999E] hover:bg-[#11999E]/90 text-white">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

