/*
  Warnings:

  - Added the required column `staffType` to the `RateSheet` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "RateSheetType" AS ENUM ('CLIENT', 'CARE_WORKER', 'OFFICE_STAFF');

-- AlterTable
ALTER TABLE "RateSheet" ADD COLUMN     "staffType" "RateSheetType" NOT NULL;
