-- AlterTable
ALTER TABLE "Conversation" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "messages" SET DEFAULT '[]',
ALTER COLUMN "title" SET DEFAULT 'New Conversation';
