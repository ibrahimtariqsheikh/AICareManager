import { useChat } from 'ai/react'
import { useCallback } from 'react'

interface Medication {
  id: string
  name: string
  dosage: string
  frequency: string
  startDate: string
  endDate?: string
  instructions: string
  sideEffects?: string[]
  interactions?: string[]
}

interface Client {
  id: string
  name: string
  age: number
  weight: number
  allergies: string[]
  currentMedications: Medication[]
  medicalConditions: string[]
}

interface MedicationData {
  client: Client
  newMedication?: Medication
  action: 'review' | 'add' | 'update' | 'remove'
}

export function useMedicationChat() {
  const { handleSubmit, messages, isLoading } = useChat({
    api: '/api/chat/medications',
    onFinish: (message) => {
      return message.content
    }
  })

  const handleMedicationAction = useCallback(async (data: MedicationData): Promise<string> => {
    await handleSubmit({
      medicationData: data
    } as any)
    // The response will be available in the messages array
    const lastMessage = messages[messages.length - 1]
    return lastMessage?.content || ''
  }, [handleSubmit, messages])

  return {
    handleMedicationAction,
    messages,
    isLoading
  }
} 