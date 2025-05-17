/*
  Warnings:

  - A unique constraint covering the columns `[receiverId,senderId]` on the table `Conversation` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Conversation_receiverId_senderId_key" ON "Conversation"("receiverId", "senderId");
