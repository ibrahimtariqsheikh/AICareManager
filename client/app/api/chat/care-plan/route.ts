import { handleCarePlanGeneration } from '../routes'

export async function POST(req: Request) {
  return handleCarePlanGeneration(req)
} 