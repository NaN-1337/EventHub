"use client"

import { useState } from "react"
import { CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { X } from "lucide-react"

type PreferencesCategory = 
  | "music"
  | "sports"
  | "travel"
  | "culture"
  | "community_involvement"
  | "entertainment"

interface User {
  name: string
  email: string
  username: string
  location: string
  gender: string
  preferences: Record<PreferencesCategory, string[]>
  xpPoints: number
  donationPoints: number
  level: number
}

const initialUser: User = {
  name: "ANDREI",
  email: "andrei@gmail.com",
  username: "andrei89",
  location: "New York, USA",
  gender: "Male",
  preferences: {
    music: ["Rock", "Pop", "Jazz", "Rap", "Classical"],
    sports: ["Football", "Basket", "Tennis", "Running", "Yoga"],
    travel: ["Hiking", "Holiday", "Road Trip"],
    culture: ["Arts", "Theater", "Museum", "Literature"],
    community_involvement: ["Environmental Conservation", "Animal Welfare", "Charity Fundraising", "Youth Programs"],
    entertainment: ["Movies", "Stand-Up", "Gaming"],
  },
  xpPoints: 2500,
  donationPoints: 150,
  level: 1,
}

const availableSubcategories: Record<PreferencesCategory, string[]> = {
  music: ["Rock", "Pop", "Jazz", "Rap", "Classical"],
  sports: ["Football", "Basket", "Tennis", "Running", "Yoga"],
  travel: ["Hiking", "Holiday", "Road Trip"],
  culture: ["Arts", "Theater", "Museum", "Literature"],
  community_involvement: ["Environmental Conservation", "Animal Welfare", "Charity Fundraising", "Youth Programs"],
  entertainment: ["Movies", "Stand-Up", "Gaming"],
}

export default function ProfileContent() {
  const [user, setUser] = useState<User>(initialUser)
  const [selectedCategory, setSelectedCategory] = useState<PreferencesCategory>("music")
  const [newPreference, setNewPreference] = useState<string>("")

  const handleAddPreference = () => {
    if (newPreference && !user.preferences[selectedCategory].includes(newPreference)) {
      setUser(prevUser => ({
        ...prevUser,
        preferences: {
          ...prevUser.preferences,
          [selectedCategory]: [...prevUser.preferences[selectedCategory], newPreference],
        },
      }))
      setNewPreference("")
    }
  }

  const handleRemovePreference = (category: PreferencesCategory, item: string) => {
    setUser(prevUser => ({
      ...prevUser,
      preferences: {
        ...prevUser.preferences,
        [category]: prevUser.preferences[category].filter(pref => pref !== item),
      },
    }))
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 h-full w-full p-8 bg-gray-100">

      {/* Left Column: Profile Information */}
      <div className="flex-1 flex flex-col bg-white rounded-2xl shadow-md p-6 min-h-screen">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-[#40514E] mb-4">Profile Information</CardTitle>
        </CardHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {["name", "email", "username", "location"].map((field) => (
              <div key={field} className="space-y-2">
                <Label htmlFor={field} className="text-[#40514E] capitalize">
                  {field}
                </Label>
                <Input
                  id={field}
                  value={user[field as keyof User]}
                  onChange={(e) => setUser({ ...user, [field]: e.target.value })}
                  className="bg-white border-[#30E3CA] focus:ring-[#11999E]"
                />
              </div>
            ))}

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="gender" className="text-[#40514E]">Gender</Label>
              <Select value={user.gender} onValueChange={(value) => setUser({ ...user, gender: value })}>
                <SelectTrigger className="bg-white border-[#30E3CA] focus:ring-[#11999E]">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Preferences and Progress */}
      <div className="flex-1 flex flex-col bg-white rounded-2xl shadow-md p-6 min-h-screen">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-[#40514E] mb-4">Preferences</CardTitle>
        </CardHeader>

        <div className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4">
            <Select value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as PreferencesCategory)}>
              <SelectTrigger className="bg-white border-[#30E3CA] focus:ring-[#11999E]">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {Object.keys(user.preferences).map((category) => (
                  <SelectItem key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={newPreference} onValueChange={setNewPreference}>
              <SelectTrigger className="bg-white border-[#30E3CA] focus:ring-[#11999E]">
                <SelectValue placeholder="Select subcategory" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {availableSubcategories[selectedCategory].map((sub) => (
                  <SelectItem key={sub} value={sub}>
                    {sub}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button onClick={handleAddPreference} className="bg-[#11999E] hover:bg-[#11999E]/90 text-white">
              Add
            </Button>
          </div>

          <div className="space-y-4">
            {Object.entries(user.preferences).map(([category, items]) => (
              <div key={category} className="space-y-2">
                <h3 className="font-semibold text-[#40514E] capitalize">{category}</h3>
                <div className="flex flex-wrap gap-2">
                  {items.map((item) => (
                    <Badge key={item} className="bg-[#30E3CA] text-[#40514E] pl-2 pr-1 py-1 flex items-center">
                      {item}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-1 ml-1"
                        onClick={() => handleRemovePreference(category as PreferencesCategory, item)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
