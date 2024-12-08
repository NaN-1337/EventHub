"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { auth, db } from "@/lib/firebaseConfig"
import { onAuthStateChanged } from "firebase/auth"
import { collection, query, where, onSnapshot, getDocs, addDoc, serverTimestamp, doc, getDoc } from "firebase/firestore"
import { ChatArea } from "./chat-area"
import { UsersList } from "./users-list"
import { GroupsList } from "./groups-list"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { NewGroupDialog } from "./new-group-dialog"
import { Button } from "@/components/ui/button"
import { NonFriendsModal } from "./non-friends-modal"
import { ViewUserModal } from "./view-user-modal"
import { UserPlus } from 'lucide-react'

interface User {
  uid: string
  name: string
  email: string
  avatar: string
  friends?: string[]
}

interface Group {
  id: string
  name: string
  participants: string[]
  avatar?: string
}

interface Message {
  id: string
  conversationId: string
  senderId: string
  content: string
  timestamp: any
}

function getPrivateConversationId(uid1: string, uid2: string): string {
  return [uid1, uid2].sort().join("_");
}

export function ChatInterface() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [currentUserDocId, setCurrentUserDocId] = useState<string | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [groups, setGroups] = useState<Group[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null)

  const [isNewGroupOpen, setIsNewGroupOpen] = useState(false)

  // New state for non-friend functionality
  const [isNonFriendsOpen, setIsNonFriendsOpen] = useState(false)
  const [selectedNonFriendUser, setSelectedNonFriendUser] = useState<User | null>(null)
  const [isViewUserOpen, setIsViewUserOpen] = useState(false)

  // Load current user
  const loadCurrentUser = async (authUser: any) => {
    if (authUser) {
      const usersRef = collection(db, "users")
      const q = query(usersRef, where("email", "==", authUser.email))
      const querySnapshot = await getDocs(q)
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0]
        const userData = userDoc.data() as User
        setCurrentUser(userData)
        setCurrentUserDocId(userDoc.id)
      }
    } else {
      setCurrentUser(null)
      setCurrentUserDocId(null)
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      await loadCurrentUser(authUser)
    })
    return () => unsubscribe()
  }, [])

  useEffect(() => {
    const fetchUsers = async () => {
      const usersRef = collection(db, "users")
      const snapshot = await getDocs(usersRef)
      const allUsers = snapshot.docs.map(doc => doc.data() as User)
      setUsers(allUsers)
    }
    fetchUsers()
  }, [currentUser]) // refetch if currentUser changes to update lists

  const loadGroups = async () => {
    const groupsRef = collection(db, "groups")
    const snapshot = await getDocs(groupsRef)
    const allGroups = snapshot.docs.map(doc => {
      const data = doc.data() as Omit<Group, 'id'>
      return { id: doc.id, ...data }
    })
    setGroups(allGroups)
  }

  useEffect(() => {
    loadGroups()
  }, [])

  useEffect(() => {
    if (!selectedConversationId) {
      setMessages([])
      return
    }

    const q = query(
      collection(db, "messages"),
      where("conversationId", "==", selectedConversationId)
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      let msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Message[]

      // Sort messages by timestamp on the client side
      msgs = msgs.sort((a, b) => {
        if (!a.timestamp || !b.timestamp) return 0
        return a.timestamp.toMillis() - b.timestamp.toMillis()
      })

      setMessages(msgs)
    })

    return () => unsubscribe()
  }, [selectedConversationId])

  const handleSelectUser = (user: User) => {
    if (!currentUser) return
    const conversationId = getPrivateConversationId(currentUser.uid, user.uid)
    setSelectedConversationId(conversationId)
    setSelectedUser(user)
    setSelectedGroup(null)
  }

  const handleSelectGroup = (group: Group) => {
    setSelectedConversationId(group.id)
    setSelectedGroup(group)
    setSelectedUser(null)
  }

  const sendMessage = async (content: string) => {
    if (!currentUser || !selectedConversationId) return

    await addDoc(collection(db, "messages"), {
      conversationId: selectedConversationId,
      senderId: currentUser.uid,
      content,
      timestamp: serverTimestamp(),
    })
  }

  const handleCreateGroup = async (name: string, participantUids: string[]) => {
    const groupData = {
      name,
      participants: participantUids,
      avatar: "",
    }

    const docRef = await addDoc(collection(db, "groups"), groupData)
    await loadGroups()
    setSelectedConversationId(docRef.id)
    setSelectedUser(null)
    const newGroup = { id: docRef.id, ...groupData }
    setSelectedGroup(newGroup)
  }

  // Separate friends and non-friends
  const friendUsers = currentUser?.friends
    ? users.filter(u => currentUser.friends?.includes(u.email))
    : []
  const nonFriendUsers = users.filter(u =>
    u.uid !== currentUser?.uid && !currentUser?.friends?.includes(u.email)
  )

  const handleViewDetails = (user: User) => {
    setSelectedNonFriendUser(user)
    setIsViewUserOpen(true)
  }

  const handleFriendAdded = async () => {
    // After adding a friend, re-fetch currentUser
    if (currentUserDocId) {
      const userRef = doc(db, "users", currentUserDocId)
      const userSnap = await getDoc(userRef)
      if (userSnap.exists()) {
        setCurrentUser(userSnap.data() as User)
      }
    }
  }

  return (
    <Card className="h-[calc(100vh-9rem)] bg-gradient-to-br from-[#E4F9F5] to-[#30E3CA] rounded-2xl shadow-lg overflow-hidden">
      <div className="flex h-full">
        <div className="w-80 border-r border-gray-200 bg-white flex flex-col">
          <Tabs defaultValue="users" className="flex flex-col h-full">
            <TabsList className="flex-shrink-0 p-2 bg-white">
              <TabsTrigger value="users" className="data-[state=active]:bg-[#11999E] data-[state=active]:text-white">Co-Workers</TabsTrigger>
              <TabsTrigger value="groups" className="data-[state=active]:bg-[#11999E] data-[state=active]:text-white">Groups</TabsTrigger>
            </TabsList>
            <TabsContent value="users" className="flex-1 p-0 overflow-hidden">
              <div className="p-2">
                <Button 
                  variant="outline" 
                  onClick={() => setIsNonFriendsOpen(true)}
                  className="w-full bg-white hover:bg-[#30E3CA] text-[#40514E] hover:text-white transition-colors"
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add New Co-Workers
                </Button>
              </div>
              <UsersList
                users={friendUsers}
                currentUser={currentUser}
                selectedConversationId={selectedConversationId}
                onSelectUser={handleSelectUser}
              />
            </TabsContent>
            <TabsContent value="groups" className="flex-1 p-0 overflow-hidden">
              <GroupsList
                groups={groups}
                selectedConversationId={selectedConversationId}
                onSelectGroup={handleSelectGroup}
                onNewGroup={() => setIsNewGroupOpen(true)}
              />
            </TabsContent>
          </Tabs>
        </div>
        <ChatArea
          currentUser={currentUser}
          selectedUser={selectedUser}
          selectedGroup={selectedGroup}
          messages={messages}
          onSendMessage={sendMessage}
        />
      </div>
      <NewGroupDialog
        open={isNewGroupOpen}
        onOpenChange={setIsNewGroupOpen}
        onCreateGroup={handleCreateGroup}
        currentUser={currentUser}
        users={friendUsers}
      />
      <NonFriendsModal
        open={isNonFriendsOpen}
        onOpenChange={setIsNonFriendsOpen}
        nonFriendUsers={nonFriendUsers}
        onViewDetails={handleViewDetails}
      />
      <ViewUserModal
        open={isViewUserOpen}
        onOpenChange={setIsViewUserOpen}
        user={selectedNonFriendUser}
        currentUserDocId={currentUserDocId}
        currentUser={currentUser}
        onFriendAdded={handleFriendAdded}
      />
    </Card>
  )
}
