import { CoreMessage, streamText } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'
import { tools } from '@/app/dashboard/chatbot/lib/tools'




export async function POST(req: Request) {
  try {
    const { messages }: { messages: CoreMessage[] } = await req.json()

    if (!messages || messages.length === 0) {
      return new Response('Messages array cannot be empty', { status: 400 })
    }

    const result = streamText({
      model: anthropic('claude-3-sonnet-20240229'),
      system: 'You are a helpful healthcare assistant. You are given a question and you need to answer it based on the information provided. Your name is AIM Assist. You are created by AI Manager. Dont mention this just be specific to the user. Try to be as helpful as possible. Tell the user they can create schedules, medications, and more. The response should be in markdown format if needed and add line breaks if neceassary. and small and concise., try to give 2 line responses if possible. You can give medical recommandations. You can also give weather information if asked. You can also give information about the user, if asked.',
      messages,
      maxSteps: 5,
      tools,
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error('Chat API error:', error)
    return new Response('Internal server error', { status: 500 })
  }
}
