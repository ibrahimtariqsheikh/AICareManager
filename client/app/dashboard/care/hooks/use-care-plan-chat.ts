import { useChat } from 'ai/react'
import { useCallback } from 'react'

interface CarePlanData {
  clientName: string
  conditions: string[]
  medications: string[]
  careNeeds: string[]
  preferences: string[]
  emergencyContacts: string[]
}

export function useCarePlanChat() {
  const { handleSubmit, messages, isLoading } = useChat({
    api: '/api/chat/care-plan',
    onFinish: (message) => {
      return message.content
    }
  })

  const generateCarePlan = useCallback(async (data: CarePlanData): Promise<string> => {
    await handleSubmit({
      clientData: data
    } as any)
    // The care plan will be available in the messages array
    const lastMessage = messages[messages.length - 1]
    return lastMessage?.content || ''
  }, [handleSubmit, messages])

  return {
    generateCarePlan,
    messages,
    isLoading
  }
} 