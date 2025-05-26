import { handleBillingInsights } from '../routes'

export async function POST(req: Request) {
  return handleBillingInsights(req)
} 