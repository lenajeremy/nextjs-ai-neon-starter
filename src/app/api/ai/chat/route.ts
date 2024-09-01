import { streamText, convertToCoreMessages } from 'ai'
import anthropic from '../setup'
import { prisma } from '@/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/auth'
import { NextResponse } from 'next/server'


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