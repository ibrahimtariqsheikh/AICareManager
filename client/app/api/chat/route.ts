import { handleChat } from './routes'

export async function POST(req: Request) {
  return handleChat(req)
}