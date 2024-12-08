"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { auth, db } from "@/lib/firebaseConfig"
import { onAuthStateChanged } from "firebase/auth"
import { collection, query, where, onSnapshot, getDocs, addDoc, serverTimestamp } from "firebase/firestore"
import { UsersList } from "./users-list"
import { ChatArea } from "./chat-area"

interface User {
  uid: string
  name: string
  email: string
  avatar: string
}

interface Message {
  id: string
  senderId: string
  receiverId: string
  content: string
  timestamp: any
}

export function ChatInterface() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [messages, setMessages] = useState<Message[]>([])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        // Fetch the current user doc
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
    // Fetch all users
    const fetchUsers = async () => {
      const usersRef = collection(db, "users")
      const snapshot = await getDocs(usersRef)
      const allUsers = snapshot.docs.map(doc => doc.data() as User)
      setUsers(allUsers)
    }
    fetchUsers()
  }, [])

  useEffect(() => {
    if (!currentUser || !selectedUser) {
      setMessages([])
      return
    }

    // Query 1: Messages sent by currentUser to selectedUser
    const q1 = query(
      collection(db, "messages"),
      where("senderId", "==", currentUser.uid),
      where("receiverId", "==", selectedUser.uid)
    )

    // Query 2: Messages sent by selectedUser to currentUser
    const q2 = query(
      collection(db, "messages"),
      where("senderId", "==", selectedUser.uid),
      where("receiverId", "==", currentUser.uid)
    )

    let sentMessages: Message[] = []
    let receivedMessages: Message[] = []

    // Listen for changes in messages sent by currentUser
    const unsubscribe1 = onSnapshot(q1, (snapshot) => {
      sentMessages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Message[]

      // Combine and sort after both sets are known
      const combined = [...sentMessages, ...receivedMessages].sort((a, b) => {
        if (!a.timestamp || !b.timestamp) return 0
        return a.timestamp.toMillis() - b.timestamp.toMillis()
      })
      setMessages(combined)
    })

    // Listen for changes in messages sent by selectedUser
    const unsubscribe2 = onSnapshot(q2, (snapshot) => {
      receivedMessages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Message[]

      // Combine and sort after both sets are known
      const combined = [...sentMessages, ...receivedMessages].sort((a, b) => {
        if (!a.timestamp || !b.timestamp) return 0
        return a.timestamp.toMillis() - b.timestamp.toMillis()
      })
      setMessages(combined)
    })

    return () => {
      unsubscribe1()
      unsubscribe2()
    }
  }, [currentUser, selectedUser])

  const handleSelectUser = (user: User) => {
    setSelectedUser(user)
  }

  const sendMessage = async (content: string) => {
    if (!currentUser || !selectedUser) return

    const messageData = {
      senderId: currentUser.uid,
      receiverId: selectedUser.uid,
      content,
      timestamp: serverTimestamp(),
    }

    await addDoc(collection(db, "messages"), messageData)
  }

  return (
    <Card className="h-[calc(100vh-9rem)] bg-gradient-to-br from-[#E4F9F5] to-[#30E3CA] rounded-2xl shadow-lg overflow-hidden">
      <div className="flex h-full">
        <UsersList
          users={users}
          currentUser={currentUser}
          selectedUser={selectedUser}
          onSelectUser={handleSelectUser}
        />
        <ChatArea
          currentUser={currentUser}
          selectedUser={selectedUser}
          messages={messages}
          onSendMessage={sendMessage}
        />
      </div>
    </Card>
  )
}
