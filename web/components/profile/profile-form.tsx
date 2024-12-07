'use client'

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import { auth } from "@/lib/firebaseConfig"
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore"
import { Shield } from 'lucide-react'

const profileSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  username: z.string().optional(),
  gender: z.string(),
  country: z.string(),
  language: z.string(),
  interests: z.string(),
  email: z.string().email("Invalid email address"),
})

type ProfileFormValues = z.infer<typeof profileSchema>

export function ProfileForm() {
  const [isEditing, setIsEditing] = useState(false)
  const [userData, setUserData] = useState<any>(null)
  const db = getFirestore()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
  })

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser
      if (user) {
        const userDocRef = doc(db, "users", user.email!)
        const userDoc = await getDoc(userDocRef)
        if (userDoc.exists()) {
          const data = userDoc.data()
          setUserData(data)
          reset({
            fullName: data.fullName,
            email: user.email!,
            username: data.nickname || "",
            gender: data.gender || "prefer-not-to-say",
            country: data.country || "united-states",
            language: data.language || "english",
            interests: data.interests || "Photography",
          })
        }
      }
    }

    fetchUserData()
  }, [db, reset])

  const onSubmit = async (data: ProfileFormValues) => {
    const user = auth.currentUser
    if (user) {
      const userDocRef = doc(db, "users", user.email!)
      await updateDoc(userDocRef, data)
      setIsEditing(false)
    }
  }

  if (!userData) {
    return <div>Loading...</div>
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div/>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? "Save Changes" : "Edit Profile"}
            </Button>
            <Button variant="outline">
              <Shield className="mr-2 h-4 w-4" />
              Enable 2FA
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Profile Photo Section */}
          <div className="flex flex-col items-center gap-2">
            <Avatar className="h-16 w-16"> {/* Reduced height and width */}
              <AvatarImage src="/avatar.svg" />
              <AvatarFallback>
                {userData.fullName?.split(" ").map((n: string) => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <div className="text-center">
              <h3 className="font-semibold text-lg">{userData.fullName}</h3>
              <p className="text-sm text-gray-500">{userData.email}</p>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                {...register("fullName")}
                disabled={!isEditing}
              />
              {errors.fullName && (
                <p className="text-sm text-red-500">{errors.fullName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                {...register("username")}
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select
                disabled={!isEditing}
                onValueChange={(value) => {
                  if (isEditing) {
                    reset({ ...userData, gender: value })
                  }
                }}
                defaultValue={userData.gender || "prefer-not-to-say"}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent className="bg-white"> {/* Added bg-white */}
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Select
                disabled={!isEditing}
                onValueChange={(value) => {
                  if (isEditing) {
                    reset({ ...userData, country: value })
                  }
                }}
                defaultValue={userData.country || "united-states"}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent className="bg-white"> {/* Added bg-white */}
                  <SelectItem value="united-states">United States</SelectItem>
                  <SelectItem value="united-kingdom">United Kingdom</SelectItem>
                  <SelectItem value="canada">Canada</SelectItem>
                  <SelectItem value="australia">Australia</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Select
                disabled={!isEditing}
                onValueChange={(value) => {
                  if (isEditing) {
                    reset({ ...userData, language: value })
                  }
                }}
                defaultValue={userData.language || "english"}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent className="bg-white"> {/* Added bg-white */}
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="spanish">Spanish</SelectItem>
                  <SelectItem value="french">French</SelectItem>
                  <SelectItem value="german">German</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timezone">Interests</Label>
              <Select
                disabled={!isEditing}
                onValueChange={(value) => {
                  if (isEditing) {
                    reset({ ...userData, timezone: value })
                  }
                }}
                defaultValue={userData.timezone || "Photography"}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent className="bg-white"> {/* Added bg-white */}
                  <SelectItem value="Photography">Photography</SelectItem>
                  <SelectItem value="Travel">Travel</SelectItem>
                  <SelectItem value="Cooking">Cooking</SelectItem>
                  <SelectItem value="Sports">Sports</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-2 space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                disabled
              />
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
