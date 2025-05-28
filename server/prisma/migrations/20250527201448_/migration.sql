/*
  Warnings:

  - You are about to drop the `ReportAlert` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "AlertType" ADD VALUE 'ACCIDENT';
ALTER TYPE "AlertType" ADD VALUE 'LATE_VISIT';
ALTER TYPE "AlertType" ADD VALUE 'LOCATION';
ALTER TYPE "AlertType" ADD VALUE 'HEALTH_CONCERN';
ALTER TYPE "AlertType" ADD VALUE 'SAFEGUARDING_CONCERN';
ALTER TYPE "AlertType" ADD VALUE 'CHALLENGING_BEHAVIOUR';

-- DropForeignKey
ALTER TABLE "ReportAlert" DROP CONSTRAINT "ReportAlert_reportId_fkey";

-- DropTable
DROP TABLE "ReportAlert";

-- DropEnum
DROP TYPE "AlertSeverity";

-- CreateTable
CREATE TABLE "Alert" (
    "id" TEXT NOT NULL,
    "type" "AlertType" NOT NULL,
    "description" TEXT NOT NULL,
    "reportId" TEXT,
    "clientId" TEXT,
    "careworkerId" TEXT,
    "agencyId" TEXT NOT NULL,
    "resolvedById" TEXT,
    "resolvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Alert_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Alert" ADD CONSTRAINT "Alert_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alert" ADD CONSTRAINT "Alert_careworkerId_fkey" FOREIGN KEY ("careworkerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alert" ADD CONSTRAINT "Alert_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Report"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alert" ADD CONSTRAINT "Alert_agencyId_fkey" FOREIGN KEY ("agencyId") REFERENCES "Agency"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alert" ADD CONSTRAINT "Alert_resolvedById_fkey" FOREIGN KEY ("resolvedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
