import { prisma } from "@/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/auth";


export async function POST() {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const newConversation = await prisma.conversation.create({
            data: {
                messages: [],
                title: "New Conversation",
                userEmail: session.user.email != null ? session.user.email : ""
            },
        });

        return NextResponse.json(newConversation);
    } catch (error) {
        console.error('Error creating conversation:', error);
        return NextResponse.json({ error: 'Failed to create conversation' }, { status: 500 });
    }
}