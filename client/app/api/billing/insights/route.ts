import { CoreMessage, streamText } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'

export async function POST(req: Request) {
  try {
    const { section, data }: { section: string; data: any } = await req.json()

    if (!section || !data) {
      return new Response('Section and data are required', { status: 400 })
    }

    const systemPrompt = `You are an AI financial analyst for a care management platform. Your role is to analyze billing data and provide concise, actionable insights.

Focus on:
- Revenue trends and growth
- Expense patterns and optimization opportunities
- Payment method preferences and changes
- Client retention and satisfaction
- Profit margins and financial health

Format your response as a JSON array of 4 insights, each as a string. Keep insights clear, specific, and actionable.`

    const messages: CoreMessage[] = [
      {
        role: 'system',
        content: systemPrompt,
      },
      {
        role: 'user',
        content: `Analyze the following ${section} data and provide 4 key insights:\n${JSON.stringify(data, null, 2)}`,
      },
    ]

    const result = streamText({
      model: anthropic('claude-3-sonnet-20240229'),
      system: systemPrompt,
      messages,
      maxSteps: 1,
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error('Billing insights API error:', error)
    return new Response('Internal server error', { status: 500 })
  }
} 