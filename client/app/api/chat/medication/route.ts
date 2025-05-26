import { handleMedicationManagement } from '../routes'

export async function POST(req: Request) {
  return handleMedicationManagement(req)
} 