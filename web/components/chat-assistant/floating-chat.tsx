'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MessageSquare, X, Save, Star } from 'lucide-react';
import { decisionTree } from '@/lib/decision-tree';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';

interface ChatMessage {
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [currentNode, setCurrentNode] = useState(decisionTree);
  const [isTyping, setIsTyping] = useState(false);
  const [isChatEnded, setIsChatEnded] = useState(false);
  const [rating, setRating] = useState(0);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && chatHistory.length === 0) {
      const welcomeMessage: ChatMessage = {
        type: 'assistant',
        content: currentNode.response,
        timestamp: new Date(),
      };
      setChatHistory([welcomeMessage]);
    }
  }, [isOpen, currentNode]);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleOptionClick = (option: string) => {
    const userMessage: ChatMessage = {
      type: 'user',
      content: option,
      timestamp: new Date(),
    };

    setChatHistory((prev) => [...prev, userMessage]);
    setIsTyping(true);

    setTimeout(() => {
      const nextNode = currentNode.children?.find(
        (child) => child.question === option
      );

      if (nextNode) {
        const assistantMessage: ChatMessage = {
          type: 'assistant',
          content: nextNode.response,
          timestamp: new Date(),
        };
        setChatHistory((prev) => [...prev, assistantMessage]);
        setCurrentNode(nextNode);
      } else {
        const noOptionMessage: ChatMessage = {
          type: 'assistant',
          content: "I'm sorry, I don't have further options for that.",
          timestamp: new Date(),
        };
        setChatHistory((prev) => [...prev, noOptionMessage]);
      }

      setIsTyping(false);
    }, 1500);
  };

  const resetChat = () => {
    setCurrentNode(decisionTree);
    setChatHistory([]);
    setIsChatEnded(false);
    setRating(0);
  };

  const endChat = () => {
    setIsChatEnded(true);
  };

  return (
    <div className="fixed bottom-4 right-4 z-[9999]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="mb-4"
          >
            <Card className="w-[350px] shadow-lg bg-white">
              <div className="flex items-center justify-between bg-[#11999E] p-4 text-white rounded-t-lg">
                <h3 className="font-semibold">Chat Assistant</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:text-white/80"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="p-4 bg-white">
                <div
                  ref={chatRef}
                  className="max-h-[400px] overflow-y-auto space-y-4 mb-4"
                >
                  {chatHistory.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${
                        message.type === 'user'
                          ? 'justify-end'
                          : 'justify-start'
                      }`}
                    >
                      <div
                        className={`rounded-lg p-2 max-w-[80%] ${
                          message.type === 'user'
                            ? 'bg-[#11999E] text-white'
                            : 'bg-gray-100'
                        }`}
                      >
                        {message.content}
                        <div className="text-xs text-gray-500 mt-1">
                          {format(message.timestamp, 'HH:mm')}
                        </div>
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 rounded-lg p-2 max-w-[80%]">
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{
                            repeat: Infinity,
                            duration: 0.8,
                            ease: 'easeInOut',
                          }}
                        >
                          ...
                        </motion.div>
                      </div>
                    </div>
                  )}
                </div>
                {!isChatEnded ? (
                  <div>
                    {currentNode.children && (
                      <div className="space-y-2">
                        {currentNode.children.map((child, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            onClick={() => handleOptionClick(child.question)}
                            className="w-full text-left justify-start h-auto whitespace-normal"
                          >
                            {child.question}
                          </Button>
                        ))}
                      </div>
                    )}
                    <div className="flex justify-between mt-2">
                      <Button
                        variant="outline"
                        onClick={endChat}
                        className="text-[#11999E] border-[#11999E] hover:bg-[#11999E]/10"
                      >
                        End Chat
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-center">
                      Thank you for using our chat support. How would you rate
                      this conversation?
                    </p>
                    <div className="flex justify-center space-x-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Button
                          key={star}
                          variant="ghost"
                          onClick={() => setRating(star)}
                          className={`p-1 ${
                            rating >= star
                              ? 'text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        >
                          <Star className="h-6 w-6 fill-current" />
                        </Button>
                      ))}
                    </div>
                    <Button
                      onClick={resetChat}
                      className="w-full bg-[#11999E] hover:bg-[#11999E]/90"
                    >
                      Start New Chat
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-full w-12 h-12 bg-[#11999E] hover:bg-[#11999E]/90 shadow-lg"
      >
        <MessageSquare className="h-6 w-6" />
      </Button>
    </div>
  );
}
