import create from 'zustand'
import { persist } from 'zustand/middleware'

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string // Store as ISO string for persistence
}

interface AIChatState {
  messages: Message[]
  isOpen: boolean
  addMessage: (message: Omit<Message, 'timestamp'> & { timestamp?: Date }) => void
  clearMessages: () => void
  toggleChat: () => void
  setChatOpen: (open: boolean) => void
}

export const useAIChat = create<AIChatState>(
  persist(
    (set) => ({
      messages: [],
      isOpen: false,
      addMessage: (message) =>
        set((state) => ({
          messages: [
            ...state.messages,
            {
              ...message,
              timestamp: message.timestamp?.toISOString() || new Date().toISOString(),
            },
          ],
        })),
      clearMessages: () =>
        set({
          messages: [],
        }),
      toggleChat: () =>
        set((state) => ({
          isOpen: !state.isOpen,
        })),
      setChatOpen: (open) =>
        set({
          isOpen: open,
        }),
    }),
    {
      name: 'ai-chat-store',
      version: 1,
    }
  )
)
