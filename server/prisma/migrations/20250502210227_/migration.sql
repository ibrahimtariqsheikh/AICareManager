/*
  Warnings:

  - You are about to drop the `MedicationAdministration` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MedicationDatabaseLink` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MedicationRecord` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "MedicationTime" AS ENUM ('MORNING', 'AFTERNOON', 'EVENING', 'BEDTIME', 'AS_NEEDED');

-- CreateEnum
CREATE TYPE "MedicationStatus" AS ENUM ('TAKEN', 'NOT_TAKEN', 'NOT_REPORTED', 'NOT_SCHEDULED');

-- DropForeignKey
ALTER TABLE "MedicationAdministration" DROP CONSTRAINT "MedicationAdministration_administeredById_fkey";

-- DropForeignKey
ALTER TABLE "MedicationAdministration" DROP CONSTRAINT "MedicationAdministration_medicationRecordId_fkey";

-- DropForeignKey
ALTER TABLE "MedicationAdministration" DROP CONSTRAINT "MedicationAdministration_reportId_fkey";

-- DropForeignKey
ALTER TABLE "MedicationDatabaseLink" DROP CONSTRAINT "MedicationDatabaseLink_agencyId_fkey";

-- DropForeignKey
ALTER TABLE "MedicationRecord" DROP CONSTRAINT "MedicationRecord_care_worker_fkey";

-- DropForeignKey
ALTER TABLE "MedicationRecord" DROP CONSTRAINT "MedicationRecord_client_fkey";

-- DropForeignKey
ALTER TABLE "MedicationRecord" DROP CONSTRAINT "MedicationRecord_medicationId_fkey";

-- DropTable
DROP TABLE "MedicationAdministration";

-- DropTable
DROP TABLE "MedicationDatabaseLink";

-- DropTable
DROP TABLE "MedicationRecord";

-- CreateTable
CREATE TABLE "Medication" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "dosage" TEXT NOT NULL,
    "frequency" TEXT NOT NULL,
    "instructions" TEXT,
    "morning" BOOLEAN NOT NULL DEFAULT false,
    "afternoon" BOOLEAN NOT NULL DEFAULT false,
    "evening" BOOLEAN NOT NULL DEFAULT false,
    "bedtime" BOOLEAN NOT NULL DEFAULT false,
    "asNeeded" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Medication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MedicationLog" (
    "id" TEXT NOT NULL,
    "medicationId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "status" "MedicationStatus" NOT NULL,
    "time" "MedicationTime" NOT NULL,
    "careworkerId" TEXT,
    "notes" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MedicationLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Medication_userId_idx" ON "Medication"("userId");

-- CreateIndex
CREATE INDEX "MedicationLog_medicationId_idx" ON "MedicationLog"("medicationId");

-- CreateIndex
CREATE INDEX "MedicationLog_userId_idx" ON "MedicationLog"("userId");

-- CreateIndex
CREATE INDEX "MedicationLog_date_idx" ON "MedicationLog"("date");

-- AddForeignKey
ALTER TABLE "Medication" ADD CONSTRAINT "Medication_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicationLog" ADD CONSTRAINT "MedicationLog_medicationId_fkey" FOREIGN KEY ("medicationId") REFERENCES "Medication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicationLog" ADD CONSTRAINT "MedicationLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
