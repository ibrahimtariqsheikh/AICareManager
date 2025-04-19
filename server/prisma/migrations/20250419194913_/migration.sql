/*
  Warnings:

  - You are about to drop the column `addressLine1` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `addressLine2` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `chargeRate` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `county` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `firstName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `groupId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `townOrCity` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_groupId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "addressLine1",
DROP COLUMN "addressLine2",
DROP COLUMN "chargeRate",
DROP COLUMN "county",
DROP COLUMN "firstName",
DROP COLUMN "groupId",
DROP COLUMN "lastName",
DROP COLUMN "title",
DROP COLUMN "townOrCity",
ADD COLUMN     "address" TEXT,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "fullName" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "province" TEXT;

-- CreateTable
CREATE TABLE "_GroupUsers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_GroupUsers_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_GroupUsers_B_index" ON "_GroupUsers"("B");

-- AddForeignKey
ALTER TABLE "_GroupUsers" ADD CONSTRAINT "_GroupUsers_A_fkey" FOREIGN KEY ("A") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GroupUsers" ADD CONSTRAINT "_GroupUsers_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
