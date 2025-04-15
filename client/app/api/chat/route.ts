import { NextResponse } from 'next/server';
import { Message } from 'ai';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Invalid request format' },
        { status: 400 }
      );
    }

    // Here you would typically call your AI service or backend
    // For now, we'll just echo back the last message
    const lastMessage = messages[messages.length - 1];
    
    const responseMessage: Message = {
      id: Date.now().toString(),
      content: `You said: ${lastMessage.content}`,
      role: 'assistant',
    };

    return NextResponse.json({ message: responseMessage });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 