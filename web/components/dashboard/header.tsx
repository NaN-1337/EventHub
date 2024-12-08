"use client";

import { useState, useEffect } from "react";
import { Bell, MessageSquare, Calendar, Star, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { auth, db } from "@/lib/firebaseConfig"; // Ensure Firebase Auth and Firestore are initialized
import { Progress } from "@/components/ui/progress"; // Import the Progress component
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs, onSnapshot } from "firebase/firestore";
import { CalendarModal } from "./calendar-modal"; // Import the new modal

interface User {
  name: string;
  email: string;
  username: string;
  photoURL?: string;
  xpPoints?: number; // Ensure your Firestore user document has this field
  level?: number;    // Ensure your Firestore user document has this field
}

export function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [userDocId, setUserDocId] = useState<string | null>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false); // State for calendar modal

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

          const unsubscribeSnapshot = onSnapshot(doc(db, "users", docId), (snapshot) => {
            if (snapshot.exists()) {
              setUser(snapshot.data() as User);
            }
          });

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

  // Example logic for progress:
  const xpValue = user?.xpPoints ?? 0;
  const xpMax = 100;
  const levelValue = user?.level ?? 1;

  return (
    <header className="h-auto bg-gray-100 px-8 py-4">
      <div className="flex items-center justify-between">
        {/* Welcome Message */}
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-[#40514E]">
            Welcome{user?.name ? `, ${user.name}` : "!"}
          </h1>
          <p className="text-sm text-[#40514E]/70 mt-1">
            Ready to explore exciting events?
          </p>
        </div>

        <div className="flex items-center gap-6">
          {/* Calendar Button */}
          <Button
            variant="ghost"
            size="icon"
            className="rounded-xl text-[#40514E] hover:bg-[#E4F9F5]"
            onClick={() => setIsCalendarOpen(true)}
          >
            <Calendar className="h-5 w-5" />
          </Button>

          {/* XP and Level Displays */}
          <div className="flex flex-col items-start">
            <div className="flex items-center gap-2 text-[#40514E] font-medium">
              <Star className="h-5 w-5 text-[#11999E]" />
              <span>XP Points</span>
            </div>
            <div className="w-32">
              <Progress value={(xpValue / xpMax) * 100} />
            </div>
            <div className="text-sm text-gray-600">{xpValue}</div>
          </div>

          <div className="flex flex-col items-start">
            <div className="flex items-center gap-2 text-[#40514E] font-medium">
              <Award className="h-5 w-5 text-[#11999E]" />
              <span>Level</span>
            </div>
            <div className="w-32">
              <Progress value={levelValue * 10} />
            </div>
            <div className="text-sm text-gray-600">Level {levelValue}</div>
          </div>

          {/* User Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="h-10 w-10 cursor-pointer">
                <AvatarImage
                  src={user?.photoURL || "https://github.com/shadcn.png"}
                  alt={user?.name || "User"}
                />
                <AvatarFallback>
                  {user?.name?.[0]?.toUpperCase() || "?"}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 rounded-xl bg-white">
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Sign out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Calendar Modal */}
      <CalendarModal
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        userEmail={user?.email || ""}
      />
    </header>
  );
}
