import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: Request) {
    try {
        const formData = await request.formData()
        const file = formData.get('file') as File

        if (!file) {
            return NextResponse.json(
                { error: 'No file provided' },
                { status: 400 }
            )
        }

        // Create a transcription using OpenAI's Whisper API
        const transcription = await openai.audio.transcriptions.create({
            file: file,
            model: 'whisper-1',
            language: 'en',
        })

        return NextResponse.json({ text: transcription.text })
    } catch (error) {
        console.error('Transcription error:', error)
        return NextResponse.json(
            { error: 'Failed to transcribe audio' },
            { status: 500 }
        )
    }
} 