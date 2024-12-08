"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { auth, db } from "@/lib/firebaseConfig"
import { onAuthStateChanged } from "firebase/auth"
import { collection, query, where, onSnapshot, getDocs, addDoc, serverTimestamp } from "firebase/firestore"
import { ChatArea } from "./chat-area"
import { UsersList } from "./users-list"
import { GroupsList } from "./groups-list"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { NewGroupDialog } from "./new-group-dialog"

interface User {
  uid: string
  name: string
  email: string
  avatar: string
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
  const [users, setUsers] = useState<User[]>([])
  const [groups, setGroups] = useState<Group[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null)

  const [isNewGroupOpen, setIsNewGroupOpen] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        const usersRef = collection(db, "users")
        const q = query(usersRef, where("email", "==", authUser.email))
        const querySnapshot = await getDocs(q)
        if (!querySnapshot.empty) {
          const userData = querySnapshot.docs[0].data() as User
          setCurrentUser(userData)
        }
      } else {
        setCurrentUser(null)
      }
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
  }, [])

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

    // Removed orderBy here to avoid needing a composite index
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

  return (
    <Card className="h-[calc(100vh-9rem)] bg-gradient-to-br from-[#E4F9F5] to-[#30E3CA] rounded-2xl shadow-lg overflow-hidden">
      <div className="flex h-full">
        <div className="w-80 border-r border-gray-200 bg-white flex flex-col">
          <Tabs defaultValue="users" className="flex flex-col h-full">
            <TabsList className="flex-shrink-0 p-2">
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="groups">Groups</TabsTrigger>
            </TabsList>
            <TabsContent value="users" className="flex-1 p-0">
              <UsersList
                users={users}
                currentUser={currentUser}
                selectedConversationId={selectedConversationId}
                onSelectUser={handleSelectUser}
              />
            </TabsContent>
            <TabsContent value="groups" className="flex-1 p-0">
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
        users={users}
      />
    </Card>
  )
}
