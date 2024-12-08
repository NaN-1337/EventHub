"use client"

import { useEffect, useRef, useCallback } from 'react'
import { db } from "@/lib/firebaseConfig"
import { doc, updateDoc, arrayUnion, serverTimestamp } from "firebase/firestore"

export function useWebSocket() {
  const socket = useRef<WebSocket | null>(null)

  const sendMessage = useCallback(async (conversationId: string, message: any) => {
    if (socket.current?.readyState === WebSocket.OPEN) {
      socket.current.send(JSON.stringify({
        type: 'chat_message',
        conversationId,
        message
      }))
    }

    // Update Firestore
    const conversationRef = doc(db, "conversations", conversationId)
    await updateDoc(conversationRef, {
      messages: arrayUnion({
        ...message,
        timestamp: serverTimestamp()
      }),
      lastMessage: message.content,
      timestamp: serverTimestamp()
    })
  }, [])

  useEffect(() => {
    // Replace with your WebSocket server URL
    socket.current = new WebSocket('ws://your-websocket-server.com')

    socket.current.onopen = () => {
      console.log('WebSocket connected')
    }

    socket.current.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data.type === 'chat_message') {
        // Handle incoming messages (e.g., update UI)
        console.log('Received message:', data.message)
      }
    }

    return () => {
      if (socket.current) {
        socket.current.close()
      }
    }
  }, [])

  return { sendMessage }
}

