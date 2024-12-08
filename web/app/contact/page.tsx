'use client'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { useState } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"

const reviews = [
  {
    id: 1,
    name: "Sarah Johnson",
    message: "Amazing platform! The interface is intuitive and the features are exactly what I needed.",
    rating: 5,
    avatar: "/avatars/sarah.jpg"
  },
  {
    id: 2,
    name: "Michael Chen",
    message: "Great experience overall. The support team is very responsive and helpful.",
    rating: 4,
    avatar: "/avatars/michael.jpg"
  },
  {
    id: 3,
    name: "Emma Wilson",
    message: "I love how easy it is to use. Definitely recommend it to anyone looking for a reliable solution.",
    rating: 5,
    avatar: "/avatars/emma.jpg"
  }
]

export default function ContactsPage() {
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [name, setName] = useState("")
  const [message, setMessage] = useState("")
  const [captchaChecked, setCaptchaChecked] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log({ name, message, isAnonymous })
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-8 bg-white">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-[#40514E]">Contact Us</h1>
        </div>

        <div className="grid grid-cols-2 gap-8">
          {/* Contact Form */}
          <Card className="shadow-xl rounded-2xl">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-[#40514E]">
                Send us a message
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-[#40514E]">Name</Label>
                  <Input
                    id="name"
                    placeholder="Your name"
                    disabled={isAnonymous}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="anonymous"
                    checked={isAnonymous}
                    onCheckedChange={(checked) => {
                      setIsAnonymous(checked as boolean)
                      if (checked) setName("")
                    }}
                  />
                  <label
                    htmlFor="anonymous"
                    className="text-sm font-medium text-[#40514E]"
                  >
                    Send anonymously
                  </label>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-[#40514E]">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Type your message here"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="captcha"
                    checked={captchaChecked}
                    onCheckedChange={(checked) => setCaptchaChecked(checked as boolean)}
                  />
                  <label
                    htmlFor="captcha"
                    className="text-sm font-medium text-[#40514E]"
                  >
                    I'm not a robot
                  </label>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#30E3CA] text-[#40514E] hover:bg-[#30E3CA]/90"
                  disabled={!captchaChecked || (!name && !isAnonymous) || !message}
                >
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Reviews */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-[#40514E]">What our users say</h2>
            {reviews.map((review) => (
              <Card key={review.id} className="shadow-xl rounded-2xl">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <Avatar>
                      <AvatarImage src={review.avatar} />
                      <AvatarFallback>{review.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-semibold text-[#40514E]">{review.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">{review.message}</p>
                      <div className="flex items-center mt-2">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <span key={i} className="text-yellow-400">★</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-8 text-center text-sm text-[#40514E]/70">
          <p>© 2024 Team 1337. HackITall - LSAC & Deutsche Bank</p>
        </footer>
      </div>
    </div>
  )
}
