import { useChat } from 'ai/react'
import { useCallback } from 'react'

type BillingSection = 'revenue' | 'payments' | 'retention'

interface BillingChatMessage {
  section: BillingSection
  data: any
}

export function useBillingChat() {
  const { handleSubmit, messages, isLoading } = useChat({
    api: '/api/chat/billing',
    onFinish: (message) => {
      try {
        const parsedInsights = JSON.parse(message.content)
        return parsedInsights
      } catch (error) {
        console.error('Error parsing insights:', error)
        return []
      }
    }
  })

  const getInsights = useCallback(async (section: BillingSection, data: any): Promise<string[]> => {
    const message: BillingChatMessage = {
      section,
      data
    }
    await handleSubmit(message as any)
    // The insights will be available in the messages array
    const lastMessage = messages[messages.length - 1]
    if (lastMessage && lastMessage.content) {
      try {
        return JSON.parse(lastMessage.content)
      } catch (error) {
        console.error('Error parsing insights:', error)
        return []
      }
    }
    return []
  }, [handleSubmit, messages])

  return {
    getInsights,
    messages,
    isLoading
  }
} 