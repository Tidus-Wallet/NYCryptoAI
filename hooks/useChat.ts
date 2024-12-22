import { useState, useCallback, useEffect } from 'react'
import type { Message } from 'ai'
import { ask } from 'functions/ai'
import QuickCrypto from 'react-native-quick-crypto'
import { useMMKVStorage } from 'react-native-mmkv-storage'
import storage from 'utils/storage'

interface UseChatResult {
  messages: Message[]
  error: Error | null
  input: string
  isLoading: boolean
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void
  handleSubmit: (e?: React.FormEvent) => Promise<void>
}

export function useChat(): UseChatResult {
  const [messages, setMessages] = useMMKVStorage<Message[]>('messages', storage, [])
  const [error, setError] = useState<Error | null>(null)
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setInput(e.target.value)
    },
    []
  )

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault()

      if (!input.trim() || isLoading) return

      const userMessage: Message = {
        role: 'user',
        content: input,
        id: QuickCrypto.randomUUID(),
      }

      // delete old messages if more than 50
      if (messages.length > 50) {
        setMessages((prevMessages) => prevMessages.slice(1))
      }

      setMessages((prevMessages) => [...prevMessages, userMessage])
      setInput('')
      setError(null)
      setIsLoading(true)

      try {
        const response = await ask([...messages, userMessage])

        const assistantMessage: Message = {
          role: 'assistant',
          content: response,
          id: QuickCrypto.randomUUID(),
        }

        setMessages((prevMessages) => [...prevMessages, assistantMessage])
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An error occurred'))
      } finally {
        setIsLoading(false)
      }
    },
    [input, messages, isLoading]
  )

  return {
    messages,
    error,
    input,
    isLoading,
    handleInputChange,
    handleSubmit,
  }
}
