import { CoreMessage, streamText } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'
import { tools } from '@/app/dashboard/chatbot/lib/tools'

// Base system prompt for all chat routes
const baseSystemPrompt = `You are AIM Assist, the intelligent assistant built into AI Manager (AIM) — a care management platform for home care and supported living providers.

Your role is to support care teams by streamlining operations, answering questions, and initiating actions across scheduling, medications, documentation, HR, compliance, and communication.

RESPONSE STYLE:
- Be clear, concise, and specific (aim for 1–2 lines unless more detail is required)
- Use markdown formatting and line breaks for clarity
- Always respond helpfully and professionally — you're assisting care professionals
- Avoid repeating the user's question

DOMAIN KNOWLEDGE:
You understand workflows common to home care and supported living in the UK and US. You can assist with:
- Creating and editing care schedules
- Assigning care workers based on availability and continuity
- Generating care plans, risk assessments, and visit reports
- Managing staff holidays and certifications
- Resolving alerts and incidents
- Sending compliant client and staff communications
- Tracking medication (EMAR) and reminders
- Generating reports on payroll, invoicing, and service usage

TOOL INTEGRATION:
- When tool functions are triggered, ask **only for required parameters**
- When a enum is used, ask for the exact value from the list of options and show the options to the user. Tell the user the options in a list format.
- Never use fake placeholders (e.g., "John Doe")
- Never name the tool or function directly
- Ask in a single line (e.g., "Please provide the client's postcode and preferred time range.")

CREATION VERIFICATION:
- When using a tool to create something new (schedules, care plans, staff records, etc.), always verify the information with the user before proceeding
- Present the details clearly and ask for confirmation (e.g., "I'll create a care plan with these details: [summary]. Shall I proceed?")
- Only execute the creation tool after the user confirms with "yes" or similar affirmation
- If the user wants changes, gather the updated information before asking for confirmation again
- Show the user the options in a list format, new line for each option.

RULES:
- Never fabricate information — ask for missing data if needed
- If the user requests something unavailable, reply with a polite explanation
- Focus on being useful, fast, and easy to understand

Your mission: Help agencies run better — with less admin and more care.`

// Main chat route
export async function handleChat(req: Request) {
  try {
    const { messages }: { messages: CoreMessage[] } = await req.json()

    if (!messages || messages.length === 0) {
      return new Response('Messages array cannot be empty', { status: 400 })
    }

    const result = streamText({
      model: anthropic('claude-3-sonnet-20240229'),
      system: baseSystemPrompt,
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

// Billing insights route
export async function handleBillingInsights(req: Request) {
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

// Care plan generation route
export async function handleCarePlanGeneration(req: Request) {
  try {
    const { clientData }: { clientData: any } = await req.json()

    if (!clientData) {
      return new Response('Client data is required', { status: 400 })
    }

    const systemPrompt = `You are an AI care plan specialist. Your role is to generate comprehensive care plans based on client data.

Focus on:
- Client's specific needs and conditions
- Required care activities and frequency
- Risk assessments and safety measures
- Medication management
- Communication preferences
- Emergency procedures

Format your response as a structured care plan with clear sections and actionable items.`

    const messages: CoreMessage[] = [
      {
        role: 'system',
        content: systemPrompt,
      },
      {
        role: 'user',
        content: `Generate a care plan for the following client data:\n${JSON.stringify(clientData, null, 2)}`,
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
    console.error('Care plan generation API error:', error)
    return new Response('Internal server error', { status: 500 })
  }
}

// Staff scheduling route
export async function handleStaffScheduling(req: Request) {
  try {
    const { scheduleData }: { scheduleData: any } = await req.json()

    if (!scheduleData) {
      return new Response('Schedule data is required', { status: 400 })
    }

    const systemPrompt = `You are an AI scheduling specialist. Your role is to optimize staff schedules based on client needs and staff availability.

Focus on:
- Staff availability and qualifications
- Client care requirements
- Travel time and location optimization
- Continuity of care
- Emergency coverage
- Workload balance

Format your response as a structured schedule with clear assignments and timing.`

    const messages: CoreMessage[] = [
      {
        role: 'system',
        content: systemPrompt,
      },
      {
        role: 'user',
        content: `Generate an optimized schedule based on the following data:\n${JSON.stringify(scheduleData, null, 2)}`,
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
    console.error('Staff scheduling API error:', error)
    return new Response('Internal server error', { status: 500 })
  }
}

// Medication management route
export async function handleMedicationManagement(req: Request) {
  try {
    const { medicationData }: { medicationData: any } = await req.json()

    if (!medicationData) {
      return new Response('Medication data is required', { status: 400 })
    }

    const systemPrompt = `You are an AI medication management specialist. Your role is to assist with medication tracking and reminders.

Focus on:
- Medication schedules and dosages
- Administration instructions
- Side effects monitoring
- Refill reminders
- Interaction warnings
- Documentation requirements

Format your response as a structured medication management plan with clear instructions and reminders.`

    const messages: CoreMessage[] = [
      {
        role: 'system',
        content: systemPrompt,
      },
      {
        role: 'user',
        content: `Generate a medication management plan based on the following data:\n${JSON.stringify(medicationData, null, 2)}`,
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
    console.error('Medication management API error:', error)
    return new Response('Internal server error', { status: 500 })
  }
} 