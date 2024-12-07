"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Users, Award } from 'lucide-react'
import { Badge } from "@/components/ui/badge"

interface ViewEventModalProps {
  event: {
    id: string
    name: string
    description: string
    location: string
    date: string
    organizer: string
    points: number
    category: string
    subcategory: string
  }
  isOpen: boolean
  onClose: () => void
  onEdit: () => void
}

export function ViewEventModal({ event, isOpen, onClose, onEdit }: ViewEventModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-gray-100 rounded-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#40514E]">{event.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <img
            src={`https://source.unsplash.com/random/800x400?${event.category}`}
            alt={event.name}
            className="w-full h-48 object-cover rounded-lg"
          />
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
          <div className="flex justify-end gap-2">
            <Button onClick={onClose} variant="outline">Close</Button>
            <Button onClick={onEdit} className="bg-[#11999E] hover:bg-[#11999E]/90 text-white">Edit Event</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

