import { handleStaffScheduling } from '../routes'

export async function POST(req: Request) {
  return handleStaffScheduling(req)
} 