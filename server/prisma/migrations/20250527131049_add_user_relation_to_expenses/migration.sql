/*
  Warnings:

  - Added the required column `userId` to the `Expenses` table without a default value. This is not possible if the table is not empty.

*/
-- First, add the column as nullable
ALTER TABLE "Expenses" ADD COLUMN "userId" TEXT;

-- Update existing records (you'll need to specify a valid user ID)
UPDATE "Expenses" SET "userId" = (SELECT id FROM "User" LIMIT 1);

-- Make the column required
ALTER TABLE "Expenses" ALTER COLUMN "userId" SET NOT NULL;

-- Add the foreign key constraint
ALTER TABLE "Expenses" ADD CONSTRAINT "Expenses_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
