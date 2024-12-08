"use client";

import { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";

type PreferencesCategory =
  | "music"
  | "sports"
  | "travel"
  | "culture"
  | "community_involvement"
  | "entertainment";

interface User {
  email: string;
  name: string;
  username: string;
  location: string;
  gender: string;
  preferences: Record<PreferencesCategory, string[]>;
  xpPoints: number;
  donationPoints: number;
  level: number;
  friends: string[];
  joinedEvents: string[];
  createdEvents: string[];
  tickets: Record<string, number>;
}

const availableSubcategories: Record<PreferencesCategory, string[]> = {
  music: ["Rock", "Pop", "Jazz", "Rap", "Classical"],
  sports: ["Football", "Basket", "Tennis", "Running", "Yoga"],
  travel: ["Hiking", "Holiday", "Road Trip"],
  culture: ["Arts", "Theater", "Museum", "Literature"],
  community_involvement: [
    "Environmental Conservation",
    "Animal Welfare",
    "Charity Fundraising",
    "Youth Programs",
  ],
  entertainment: ["Movies", "Stand-Up", "Gaming"],
};

export default function ProfileContent() {
  const [user, setUser] = useState<User | null>(null);
  const [userDocId, setUserDocId] = useState<string | null>(null);
  const [editing, setEditing] = useState<boolean>(false); // State for editing mode
  const [selectedCategory, setSelectedCategory] =
    useState<PreferencesCategory>("music");
  const [newPreference, setNewPreference] = useState<string>("");

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("email", "==", authUser.email));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const docData = querySnapshot.docs[0].data() as User;
          const docId = querySnapshot.docs[0].id;
          setUser(docData);
          setUserDocId(docId);

          const unsubscribeSnapshot = onSnapshot(
            doc(db, "users", docId),
            (snapshot) => {
              if (snapshot.exists()) {
                setUser(snapshot.data() as User);
              }
            }
          );

          return () => unsubscribeSnapshot();
        } else {
          console.error("User document does not exist for email:", authUser.email);
        }
      } else {
        setUser(null);
        setUserDocId(null);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const handleSaveProfile = async () => {
    if (user) {
      try {
        await updateDoc(doc(db, "users", userDocId!), {
          name: user.name,
          email: user.email,
          username: user.username,
          location: user.location,
          gender: user.gender,
        });
        setEditing(false); // Exit editing mode after saving
      } catch (error) {
        console.error("Error saving profile:", error);
      }
    }
  };

  const handleAddPreference = async () => {
    if (user && newPreference && !user.preferences[selectedCategory].includes(newPreference)) {
      const updatedPreferences = {
        ...user.preferences,
        [selectedCategory]: [...user.preferences[selectedCategory], newPreference],
      };

      try {
        await updateDoc(doc(db, "users", userDocId!), {
          preferences: updatedPreferences,
        });
        setUser({ ...user, preferences: updatedPreferences });
      } catch (error) {
        console.error("Error updating preferences:", error);
      }

      setNewPreference("");
    }
  };

  const handleRemovePreference = async (category: PreferencesCategory, item: string) => {
    if (user) {
      const updatedPreferences = {
        ...user.preferences,
        [category]: user.preferences[category].filter((pref) => pref !== item),
      };

      try {
        await updateDoc(doc(db, "users", userDocId!), {
          preferences: updatedPreferences,
        });
        setUser({ ...user, preferences: updatedPreferences });
      } catch (error) {
        console.error("Error updating preferences:", error);
      }
    }
  };

  if (!user) {
    return <div className="flex justify-center items-center h-full">Loading user data...</div>;
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 h-full w-full p-8 bg-gray-100">
      {/* Left Column: Profile Information */}
      <div className="flex-1 flex flex-col bg-white rounded-2xl shadow-md p-6 min-h-screen">
        <CardHeader className="flex flex-row justify-between items-center mb-4">
          <CardTitle className="text-2xl font-bold text-[#40514E]">
            Profile Information
          </CardTitle>
          {editing ? (
            <Button
              onClick={handleSaveProfile}
              className="bg-[#11999E] hover:bg-[#11999E]/90 text-white"
            >
              Save
            </Button>
          ) : (
            <Button
              onClick={() => setEditing(true)}
              className="bg-[#30E3CA] hover:bg-[#30E3CA]/90 text-white"
            >
              Edit
            </Button>
          )}
        </CardHeader>

        <div className="space-y-6 mt-4">
          {["name", "email", "username", "location"].map((field) => (
            <div key={field} className="space-y-2">
              <Label htmlFor={field} className="text-[#40514E] capitalize">
                {field}
              </Label>
              <Input
                id={field}
                value={user[field as keyof User] || ""}
                readOnly={!editing} // Make fields read-only unless in editing mode
                onChange={(e) =>
                  setUser((prevUser) =>
                    prevUser ? { ...prevUser, [field]: e.target.value } : prevUser
                  )
                }
                className={`${
                  editing ? "bg-white" : "bg-gray-100"
                } border-[#30E3CA] focus:ring-[#11999E]`}
              />
            </div>
          ))}

          <div className="space-y-2">
            <Label htmlFor="gender" className="text-[#40514E]">
              Gender
            </Label>
            <Select
              value={user.gender}
              disabled={!editing} // Disable dropdown unless in editing mode
              onValueChange={(value) =>
                setUser((prevUser) =>
                  prevUser ? { ...prevUser, gender: value } : prevUser
                )
              }
            >
              <SelectTrigger
                className={`${
                  editing ? "bg-white" : "bg-gray-100"
                } border-[#30E3CA] focus:ring-[#11999E]`}
              >
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Level and XP Points */}
          <div className="mt-6">
            <h3 className="text-lg font-bold text-[#40514E] mb-2">Progress</h3>
            <div className="flex items-center justify-between">
              <span className="text-md font-semibold text-[#40514E]">
                Level {user.level}
              </span>
              <span className="text-md text-[#30E3CA]">{user.xpPoints} XP</span>
            </div>
            <div className="relative w-full bg-gray-200 rounded-full h-4 mt-2">
              <div
                className="absolute top-0 left-0 h-4 bg-[#30E3CA] rounded-full"
                style={{ width: `${Math.min((user.xpPoints % 1000) / 10, 100)}%` }} // Progress for current level
              />
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Preferences and Progress */}
      <div className="flex-1 flex flex-col bg-white rounded-2xl shadow-md p-6 min-h-screen">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-[#40514E] mb-4">
            Preferences
          </CardTitle>
        </CardHeader>

        <div className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4">
            <Select
              value={selectedCategory}
              onValueChange={(value) => setSelectedCategory(value as PreferencesCategory)}
            >
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

            <Select
              value={newPreference}
              onValueChange={setNewPreference}
            >
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

            <Button
              onClick={handleAddPreference}
              className="bg-[#11999E] hover:bg-[#11999E]/90 text-white"
            >
              Add
            </Button>
          </div>

          <div className="space-y-4">
            {Object.entries(user.preferences).map(([category, items]) => (
              <div key={category} className="space-y-2">
                <h3 className="font-semibold text-[#40514E] capitalize">{category}</h3>
                <div className="flex flex-wrap gap-2">
                  {items.map((item) => (
                    <Badge
                      key={item}
                      className="bg-[#30E3CA] text-[#40514E] pl-2 pr-1 py-1 flex items-center"
                    >
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
  );
}
