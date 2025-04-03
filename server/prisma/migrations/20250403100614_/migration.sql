/*
  Warnings:

  - You are about to drop the column `administeredAt` on the `MedicationRecord` table. All the data in the column will be lost.
  - You are about to drop the column `medication` on the `MedicationRecord` table. All the data in the column will be lost.
  - You are about to drop the column `distance` on the `MileageRecord` table. All the data in the column will be lost.
  - You are about to drop the column `shiftEnd` on the `Schedule` table. All the data in the column will be lost.
  - You are about to drop the column `shiftStart` on the `Schedule` table. All the data in the column will be lost.
  - The `status` column on the `Schedule` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `type` column on the `Schedule` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `Client` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `medicationId` to the `MedicationRecord` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `MedicationRecord` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `MedicationRecord` table without a default value. This is not possible if the table is not empty.
  - Made the column `clientId` on table `MedicationRecord` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `endMileage` to the `MileageRecord` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startMileage` to the `MileageRecord` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalMiles` to the `MileageRecord` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `MileageRecord` table without a default value. This is not possible if the table is not empty.
  - Made the column `clientId` on table `MileageRecord` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `endTime` to the `Schedule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startTime` to the `Schedule` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CareOutcome" DROP CONSTRAINT "CareOutcome_clientId_fkey";

-- DropForeignKey
ALTER TABLE "Client" DROP CONSTRAINT "Client_agencyId_fkey";

-- DropForeignKey
ALTER TABLE "ClientCareAssignment" DROP CONSTRAINT "ClientCareAssignment_clientId_fkey";

-- DropForeignKey
ALTER TABLE "Document" DROP CONSTRAINT "Document_clientId_fkey";

-- DropForeignKey
ALTER TABLE "Invoice" DROP CONSTRAINT "Invoice_clientId_fkey";

-- DropForeignKey
ALTER TABLE "KeyContact" DROP CONSTRAINT "KeyContact_clientId_fkey";

-- DropForeignKey
ALTER TABLE "MedicationRecord" DROP CONSTRAINT "MedicationRecord_clientId_fkey";

-- DropForeignKey
ALTER TABLE "MileageRecord" DROP CONSTRAINT "MileageRecord_clientId_fkey";

-- DropForeignKey
ALTER TABLE "Report" DROP CONSTRAINT "Report_clientId_fkey";

-- DropForeignKey
ALTER TABLE "Schedule" DROP CONSTRAINT "Schedule_clientId_fkey";

-- AlterTable
ALTER TABLE "MedicationRecord" DROP COLUMN "administeredAt",
DROP COLUMN "medication",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "endDate" TIMESTAMP(3),
ADD COLUMN     "medicationId" TEXT NOT NULL,
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "clientId" SET NOT NULL;

-- AlterTable
ALTER TABLE "MileageRecord" DROP COLUMN "distance",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "endMileage" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "startMileage" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "totalMiles" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "clientId" SET NOT NULL,
ALTER COLUMN "date" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Schedule" DROP COLUMN "shiftEnd",
DROP COLUMN "shiftStart",
ADD COLUMN     "endTime" TEXT NOT NULL,
ADD COLUMN     "startTime" TEXT NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'PENDING',
DROP COLUMN "type",
ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'APPOINTMENT';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "addressLine1" TEXT,
ADD COLUMN     "addressLine2" TEXT,
ADD COLUMN     "allergies" TEXT,
ADD COLUMN     "chargeRate" DOUBLE PRECISION DEFAULT 25.0,
ADD COLUMN     "county" TEXT,
ADD COLUMN     "dateOfBirth" TIMESTAMP(3),
ADD COLUMN     "dnraOrder" BOOLEAN DEFAULT false,
ADD COLUMN     "history" TEXT,
ADD COLUMN     "interests" TEXT,
ADD COLUMN     "languages" TEXT,
ADD COLUMN     "likesDislikes" TEXT,
ADD COLUMN     "mobility" TEXT,
ADD COLUMN     "nhsNumber" TEXT,
ADD COLUMN     "phoneNumber" TEXT,
ADD COLUMN     "postalCode" TEXT,
ADD COLUMN     "propertyAccess" TEXT,
ADD COLUMN     "title" TEXT,
ADD COLUMN     "townOrCity" TEXT;

-- DropTable
DROP TABLE "Client";

-- CreateIndex
CREATE INDEX "MedicationRecord_medicationId_idx" ON "MedicationRecord"("medicationId");

-- CreateIndex
CREATE INDEX "MedicationRecord_clientId_idx" ON "MedicationRecord"("clientId");

-- CreateIndex
CREATE INDEX "MedicationRecord_userId_idx" ON "MedicationRecord"("userId");

-- CreateIndex
CREATE INDEX "MileageRecord_agencyId_idx" ON "MileageRecord"("agencyId");

-- CreateIndex
CREATE INDEX "MileageRecord_clientId_idx" ON "MileageRecord"("clientId");

-- CreateIndex
CREATE INDEX "MileageRecord_userId_idx" ON "MileageRecord"("userId");

-- CreateIndex
CREATE INDEX "Schedule_agencyId_idx" ON "Schedule"("agencyId");

-- CreateIndex
CREATE INDEX "Schedule_clientId_idx" ON "Schedule"("clientId");

-- CreateIndex
CREATE INDEX "Schedule_userId_idx" ON "Schedule"("userId");

-- RenameForeignKey
ALTER TABLE "MedicationRecord" RENAME CONSTRAINT "MedicationRecord_userId_fkey" TO "MedicationRecord_care_worker_fkey";

-- RenameForeignKey
ALTER TABLE "MileageRecord" RENAME CONSTRAINT "MileageRecord_userId_fkey" TO "MileageRecord_care_worker_fkey";

-- AddForeignKey
ALTER TABLE "ClientCareAssignment" ADD CONSTRAINT "ClientCareAssignment_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicationRecord" ADD CONSTRAINT "MedicationRecord_medicationId_fkey" FOREIGN KEY ("medicationId") REFERENCES "MedicationDatabaseLink"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicationRecord" ADD CONSTRAINT "MedicationRecord_client_fkey" FOREIGN KEY ("clientId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicationRecord" ADD CONSTRAINT "MedicationRecord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MileageRecord" ADD CONSTRAINT "MileageRecord_client_fkey" FOREIGN KEY ("clientId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MileageRecord" ADD CONSTRAINT "MileageRecord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KeyContact" ADD CONSTRAINT "KeyContact_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CareOutcome" ADD CONSTRAINT "CareOutcome_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
