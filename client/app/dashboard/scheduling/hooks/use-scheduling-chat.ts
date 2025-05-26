import { useChat } from 'ai/react'
import { useCallback } from 'react'

interface StaffMember {
  id: string
  name: string
  qualifications: string[]
  availability: {
    [key: string]: {
      start: string
      end: string
    }[]
  }
}

interface Client {
  id: string
  name: string
  location: string
  careNeeds: string[]
  preferredStaff?: string[]
}

interface ScheduleData {
  staff: StaffMember[]
  clients: Client[]
  dateRange: {
    start: string
    end: string
  }
  preferences?: {
    continuityOfCare: boolean
    minimizeTravel: boolean
    balanceWorkload: boolean
  }
}

export function useSchedulingChat() {
  const { handleSubmit, messages, isLoading } = useChat({
    api: '/api/chat/scheduling',
    onFinish: (message) => {
      return message.content
    }
  })

  const generateSchedule = useCallback(async (data: ScheduleData): Promise<string> => {
    await handleSubmit({
      scheduleData: data
    } as any)
    // The schedule will be available in the messages array
    const lastMessage = messages[messages.length - 1]
    return lastMessage?.content || ''
  }, [handleSubmit, messages])

  return {
    generateSchedule,
    messages,
    isLoading
  }
} 