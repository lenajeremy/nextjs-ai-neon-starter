import { NextResponse } from 'next/server';
import { prisma } from '@/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const conversation = await prisma.conversation.findUnique({
      where: { id: params.id },
    });

    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    return NextResponse.json(conversation);
  } catch (error) {
    console.error('Error retrieving conversation messages:', error);
    return NextResponse.json({ error: 'Failed to retrieve conversation messages' }, { status: 500 });
  }
}


export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { messages } = await request.json();

    const updatedConversation = await prisma.conversation.update({
      where: { id: params.id },
      data: { messages },
    });

    return NextResponse.json(updatedConversation);
  } catch (error) {
    console.error('Error saving conversation messages:', error);
    return NextResponse.json({ error: 'Failed to save conversation messages' }, { status: 500 });
  }
}