"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { db } from "@/lib/firebaseConfig"
import { doc, updateDoc, arrayUnion } from "firebase/firestore"

interface User {
  uid: string
  name: string
  email: string
  avatar: string
  friends?: string[]
  gender?: string
  location?: string
  preferences?: {
    music?: string[]
    sports?: string[]
    travel?: string[]
    culture?: string[]
    community_involvement?: string[]
    entertainment?: string[]
  }
  [key: string]: any
}

interface ViewUserModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: User | null
  currentUserDocId: string | null
  currentUser: User | null
  onFriendAdded: () => void
}

export function ViewUserModal({
    open,
    onOpenChange,
    user,
    currentUserDocId,
    currentUser,
    onFriendAdded
  }: ViewUserModalProps) {
  
    const handleAddFriend = async () => {
      if (!currentUserDocId || !user || !currentUser) return;
      const userRef = doc(db, "users", currentUserDocId);
      await updateDoc(userRef, {
        friends: arrayUnion(user.email)
      });
      onFriendAdded();
      onOpenChange(false);
    }
  
    if (!user) {
      return null;
    }
  
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px] bg-white rounded-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-[#40514E]">
              {user.name}'s Profile
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="p-4 space-y-4">
            <div className="space-y-2">
              <div className="font-semibold text-[#40514E]">Email:</div>
              <div className="text-gray-700">{user.email}</div>
            </div>
            <div className="space-y-2">
              <div className="font-semibold text-[#40514E]">Location:</div>
              <div className="text-gray-700">{user.location || "N/A"}</div>
            </div>
            <div className="space-y-2">
              <div className="font-semibold text-[#40514E]">Gender:</div>
              <div className="text-gray-700">{user.gender || "N/A"}</div>
            </div>
  
            {/* Preferences */}
            <div className="space-y-2">
              <div className="font-semibold text-[#40514E]">Preferences:</div>
              {user.preferences ? (
                <div className="text-gray-700 space-y-2">
                  {Object.entries(user.preferences).map(([prefCategory, prefValues]) => (
                    <div key={prefCategory}>
                      <div className="font-medium capitalize">{prefCategory.replace("_", " ")}:</div>
                      <div className="ml-4">
                        {(prefValues as string[]).join(", ")}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div>No preferences available.</div>
              )}
            </div>
          </ScrollArea>
          <DialogFooter>
            <Button
              onClick={handleAddFriend}
              className="bg-[#11999E] hover:bg-[#11999E]/90 text-white"
            >
              Add Co-Worker
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
}
