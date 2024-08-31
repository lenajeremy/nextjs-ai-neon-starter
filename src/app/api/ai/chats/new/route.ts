import { prisma } from "@/prisma";
import { NextResponse } from "next/server";


export async function POST() {
    try {
        const newConversation = await prisma.conversation.create({
            data: {
                messages: [],
                title: "New Conversation"
            },
        });

        return NextResponse.json(newConversation);
    } catch (error) {
        console.error('Error creating conversation:', error);
        return NextResponse.json({ error: 'Failed to create conversation' }, { status: 500 });
    }
}