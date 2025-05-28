/*
  Warnings:

  - You are about to drop the column `chargeRate` on the `Schedule` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Schedule" DROP COLUMN "chargeRate",
ADD COLUMN     "rateSheetId" TEXT;

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_rateSheetId_fkey" FOREIGN KEY ("rateSheetId") REFERENCES "RateSheet"("id") ON DELETE SET NULL ON UPDATE CASCADE;
