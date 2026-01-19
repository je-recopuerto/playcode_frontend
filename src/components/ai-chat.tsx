import React, { useState, useRef, useEffect } from 'react'
import { IoSend, IoClose, IoTrashOutline } from 'react-icons/io5'
import { FaMagic } from 'react-icons/fa'
import { useAIChat } from '../module/ai-chat'
import { useRunner } from '../module'
import clsx from 'clsx'


const API_BASE_URL = 'http://localhost:8000'

export default function AIChat() {
  const { messages, addMessage, clearMessages, isOpen, toggleChat } = useAIChat()
  const { codeMap, language } = useRunner(({ codeMap, language }) => ({ codeMap, language }))
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage = {
      id: Date.now().toString(),
      role: 'user' as const,
      content: input.trim(),
      timestamp: new Date(),
    }

    addMessage(userMessage)
    const instruction = input.trim()
    setInput('')
    setIsLoading(true)

    try {
      // Send request to backend
      const response = await fetch(`${API_BASE_URL}/api/ai/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          language,
          instruction,
          code: codeMap[language],
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      // Add AI response to messages
      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant' as const,
        content: data.response || data.message || 'No response from AI',
        timestamp: new Date(),
      }
      addMessage(assistantMessage)
    } catch (error) {
      console.error('Error sending message to backend:', error)
      
      // Show error message to user
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant' as const,
        content: `Error: ${error instanceof Error ? error.message : 'Failed to connect to backend. Please make sure the backend server is running on port 8000.'}`,
        timestamp: new Date(),
      }
      addMessage(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={toggleChat}
        className="fixed bottom-4 right-4 z-50 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all flex items-center gap-2 group"
        title="Open AI Chat"
      >
        <FaMagic className="w-5 h-5 group-hover:scale-110 transition-transform" />
        {messages.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {messages.length}
          </span>
        )}
      </button>
    )
  }

  return (
    <div className="h-full flex flex-col bg-white border-l border-gray-200">
      {/* Header */}
      <div className="h-[50px] flex items-center justify-between px-4 border-b border-gray-200 flex-shrink-0 bg-gray-50">
        <div className="flex items-center gap-2">
          <FaMagic className="w-5 h-5 text-blue-600" />
          <span className="font-medium text-sm text-gray-700">AI Assistant</span>
        </div>
        <div className="flex items-center gap-1">
          {messages.length > 0 && (
            <button
              onClick={clearMessages}
              className="p-1.5 hover:bg-gray-200 rounded transition-colors"
              title="Clear chat history"
            >
              <IoTrashOutline className="w-4 h-4 text-gray-500" />
            </button>
          )}
          <button
            onClick={toggleChat}
            className="p-1.5 hover:bg-gray-200 rounded transition-colors"
            title="Close Chat"
          >
            <IoClose className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-white">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 px-4">
            <div className="bg-blue-50 rounded-full p-4 mb-4">
              <FaMagic className="w-10 h-10 text-blue-600" />
            </div>
            <p className="text-sm font-medium text-gray-700">Start a conversation with AI</p>
            <p className="text-xs mt-2 text-gray-400 max-w-xs">
              Ask me to generate code, add features, or fix errors. I can help you build amazing things!
            </p>
            <div className="mt-6 space-y-2 text-left w-full max-w-xs">
              <p className="text-xs font-medium text-gray-600 mb-2">Try asking:</p>
              <div className="text-xs text-gray-500 space-y-1">
                <p>• "Generate a function to sort an array"</p>
                <p>• "Add error handling to this code"</p>
                <p>• "Fix the syntax errors"</p>
              </div>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={clsx('flex gap-2', message.role === 'user' ? 'justify-end' : 'justify-start')}
            >
              {message.role === 'assistant' && (
                <div className="flex-shrink-0 mt-1">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                    <FaMagic className="w-3.5 h-3.5 text-blue-600" />
                  </div>
                </div>
              )}
              <div
                className={clsx(
                  'max-w-[85%] rounded-lg px-4 py-2.5 text-sm shadow-sm',
                  message.role === 'user'
                    ? 'bg-blue-600 text-white rounded-br-sm'
                    : 'bg-gray-50 text-gray-800 border border-gray-200 rounded-bl-sm'
                )}
              >
                <div className="whitespace-pre-wrap break-words leading-relaxed">{message.content}</div>
                <div
                  className={clsx(
                    'text-xs mt-2',
                    message.role === 'user' ? 'text-blue-100' : 'text-gray-400'
                  )}
                >
                  {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
              {message.role === 'user' && (
                <div className="flex-shrink-0 mt-1">
                  <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center">
                    <span className="text-white text-xs font-medium">U</span>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg px-4 py-2 text-sm text-gray-600 border border-gray-200">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span>Thinking...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 p-4 flex-shrink-0 bg-gray-50">
        <div className="flex items-end gap-2">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask AI to generate code, add features, or fix errors..."
              className="w-full resize-none border border-gray-300 rounded-lg px-4 py-2.5 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
              rows={1}
              style={{
                minHeight: '44px',
                maxHeight: '120px',
              }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement
                target.style.height = 'auto'
                target.style.height = `${Math.min(target.scrollHeight, 120)}px`
              }}
            />
          </div>
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className={clsx(
              'p-2.5 rounded-lg transition-all flex-shrink-0 shadow-sm',
              input.trim() && !isLoading
                ? 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-md'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            )}
            title="Send message (Enter)"
          >
            <IoSend className="w-5 h-5" />
          </button>
        </div>
        <div className="flex items-center justify-between mt-2">
          <p className="text-xs text-gray-400">Press Enter to send, Shift+Enter for new line</p>
          {isLoading && (
            <div className="flex items-center gap-1 text-xs text-blue-600">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
              <span>AI is thinking...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
