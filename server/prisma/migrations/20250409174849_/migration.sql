/*
  Warnings:

  - Made the column `agencyId` on table `Report` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('DRAFT', 'COMPLETED', 'EDITED', 'FLAGGED', 'REVIEWED');

-- CreateEnum
CREATE TYPE "AlertType" AS ENUM ('MEDICATION', 'INCIDENT', 'HEALTH_CHANGE', 'BEHAVIOR', 'MISSED_TASK', 'OTHER');

-- CreateEnum
CREATE TYPE "AlertSeverity" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- AlterTable
ALTER TABLE "MedicationAdministration" ADD COLUMN     "reportId" TEXT;

-- AlterTable
ALTER TABLE "Report" ADD COLUMN     "checkInLocation" TEXT,
ADD COLUMN     "checkOutLocation" TEXT,
ADD COLUMN     "hasSignature" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lastEditReason" TEXT,
ADD COLUMN     "lastEditedAt" TIMESTAMP(3),
ADD COLUMN     "lastEditedBy" TEXT,
ADD COLUMN     "signatureImageUrl" TEXT,
ADD COLUMN     "status" "ReportStatus" NOT NULL DEFAULT 'COMPLETED',
ALTER COLUMN "agencyId" SET NOT NULL;

-- AlterTable
ALTER TABLE "ReportTask" ADD COLUMN     "completedAt" TIMESTAMP(3),
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "taskIcon" TEXT,
ADD COLUMN     "taskType" TEXT;

-- CreateTable
CREATE TABLE "ReportAlert" (
    "id" TEXT NOT NULL,
    "reportId" TEXT NOT NULL,
    "type" "AlertType" NOT NULL,
    "message" TEXT NOT NULL,
    "severity" "AlertSeverity" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolved" BOOLEAN NOT NULL DEFAULT false,
    "resolvedAt" TIMESTAMP(3),
    "resolvedBy" TEXT,

    CONSTRAINT "ReportAlert_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BodyMapObservation" (
    "id" TEXT NOT NULL,
    "reportId" TEXT NOT NULL,
    "bodyPart" TEXT NOT NULL,
    "condition" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BodyMapObservation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReportEdit" (
    "id" TEXT NOT NULL,
    "reportId" TEXT NOT NULL,
    "editedBy" TEXT NOT NULL,
    "editedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reason" TEXT NOT NULL,
    "changesJson" TEXT NOT NULL,

    CONSTRAINT "ReportEdit_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ReportAlert" ADD CONSTRAINT "ReportAlert_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Report"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BodyMapObservation" ADD CONSTRAINT "BodyMapObservation_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Report"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportEdit" ADD CONSTRAINT "ReportEdit_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Report"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportEdit" ADD CONSTRAINT "ReportEdit_editedBy_fkey" FOREIGN KEY ("editedBy") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicationAdministration" ADD CONSTRAINT "MedicationAdministration_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Report"("id") ON DELETE SET NULL ON UPDATE CASCADE;
