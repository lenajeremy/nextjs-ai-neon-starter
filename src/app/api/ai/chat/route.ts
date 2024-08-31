import { streamText, convertToCoreMessages } from 'ai'
import { createAnthropic } from '@ai-sdk/anthropic'
import { prisma } from '@/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/auth'
import { NextResponse } from 'next/server'

const anthropic = createAnthropic({
    apiKey: process.env.LLM_KEY
})

type Message = {
    content: string,
    role: "assistant" | "user" | "system"
}

export async function POST(request: Request) {

    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
        return NextResponse.json({ message: "Unathenticated "})
    }
    
    const { messages, conversationId } = await request.json() as { conversationId: string, messages: Message[] };

    console.log(messages, conversationId)

    if (!conversationId || messages.length === 0) {
        return Response.json({ error: true, message: "Bad request" }, { status: 400 });
    }

    // Save the conversation messages
    await prisma.conversation.update({
        where: { id: conversationId },
        data: { messages: messages },
    });

    const result = await streamText({
        model: anthropic("claude-3-5-sonnet-20240620", { cacheControl: true }),
        messages: convertToCoreMessages(messages)
    })

    return result.toDataStreamResponse()
}