/*
  Warnings:

  - You are about to drop the column `visitTypeId` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "User_visitTypeId_key";

-- DropIndex
DROP INDEX "VisitType_userId_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "visitTypeId";
