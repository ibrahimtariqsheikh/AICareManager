/*
  Warnings:

  - You are about to drop the column `agencyId` on the `VisitType` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[visitTypeId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `VisitType` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `VisitType` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Schedule" DROP CONSTRAINT "Schedule_visitTypeId_fkey";

-- DropForeignKey
ALTER TABLE "VisitType" DROP CONSTRAINT "VisitType_agencyId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "visitTypeId" TEXT;

-- AlterTable
ALTER TABLE "VisitType" DROP COLUMN "agencyId",
ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Task" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "careworkerNotes" TEXT,
    "visitTypeId" TEXT NOT NULL,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_visitTypeId_key" ON "User"("visitTypeId");

-- CreateIndex
CREATE UNIQUE INDEX "VisitType_userId_key" ON "VisitType"("userId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_visitTypeId_fkey" FOREIGN KEY ("visitTypeId") REFERENCES "VisitType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_visitTypeId_fkey" FOREIGN KEY ("visitTypeId") REFERENCES "VisitType"("id") ON DELETE CASCADE ON UPDATE CASCADE;
