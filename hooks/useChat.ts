import { useState, useCallback } from 'react'
import { Message } from 'ai'
import { ask } from 'functions/ai'
import QuickCrypto from 'react-native-quick-crypto'
import { useMMKVStorage } from 'react-native-mmkv-storage'
import storage from 'utils/storage'

interface UseChatResult {
  messages: Message[]
  error: Error | null
  input: string
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void
  handleSubmit: (e: React.FormEvent) => Promise<void>
}

export function useChat(): UseChatResult {
  const [messages, setMessages] = useMMKVStorage<Message[]>('messages', storage, [])
  const [error, setError] = useState<Error | null>(null)
  const [input, setInput] = useState('')

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setInput(e.target.value)
    },
    []
  )

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()

      if (!input.trim()) return

      // Add user message to the chat
      const userMessage: Message = {
        role: 'user',
        content: input,
        id: QuickCrypto.randomUUID(),
      }

      setMessages((prevMessages) => [...prevMessages, userMessage])
      setInput('')
      setError(null)

      try {
        // Get response from the AI
        const response = await ask([...messages, userMessage])

        // Add AI response to the chat
        const assistantMessage: Message = {
          role: 'assistant',
          content: response,
          id: QuickCrypto.randomUUID(),
        }

        setMessages((prevMessages) => [...prevMessages, assistantMessage])
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An error occurred'))
      }
    },
    [input, messages]
  )

  return {
    messages,
    error,
    input,
    handleInputChange,
    handleSubmit,
  }
}
