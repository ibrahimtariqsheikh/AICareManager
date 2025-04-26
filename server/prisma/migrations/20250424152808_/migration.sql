-- CreateEnum
CREATE TYPE "TemplateVisitDay" AS ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY');

-- CreateEnum
CREATE TYPE "TemplateVisitEndStatus" AS ENUM ('SAME_DAY', 'NEXT_DAY');

-- AlterTable
ALTER TABLE "Agency" ALTER COLUMN "extension" SET DATA TYPE TEXT,
ALTER COLUMN "mobileNumber" SET DATA TYPE TEXT,
ALTER COLUMN "landlineNumber" SET DATA TYPE TEXT;

-- CreateTable
CREATE TABLE "TemplateVisit" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "day" "TemplateVisitDay" NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "endStatus" "TemplateVisitEndStatus" NOT NULL,
    "isAllDayVisit" BOOLEAN NOT NULL DEFAULT false,
    "rateSheetId" TEXT,
    "clientVisitTypeId" TEXT,
    "careWorkerId" TEXT NOT NULL,
    "careWorker2Id" TEXT,
    "careWorker3Id" TEXT,
    "templateId" TEXT NOT NULL,

    CONSTRAINT "TemplateVisit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScheduleTemplate" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "userId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "agencyId" TEXT NOT NULL,

    CONSTRAINT "ScheduleTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ScheduleTemplate_userId_idx" ON "ScheduleTemplate"("userId");

-- CreateIndex
CREATE INDEX "ScheduleTemplate_agencyId_idx" ON "ScheduleTemplate"("agencyId");

-- AddForeignKey
ALTER TABLE "TemplateVisit" ADD CONSTRAINT "TemplateVisit_rateSheetId_fkey" FOREIGN KEY ("rateSheetId") REFERENCES "RateSheet"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TemplateVisit" ADD CONSTRAINT "TemplateVisit_clientVisitTypeId_fkey" FOREIGN KEY ("clientVisitTypeId") REFERENCES "VisitType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TemplateVisit" ADD CONSTRAINT "TemplateVisit_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "ScheduleTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduleTemplate" ADD CONSTRAINT "ScheduleTemplate_agencyId_fkey" FOREIGN KEY ("agencyId") REFERENCES "Agency"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduleTemplate" ADD CONSTRAINT "ScheduleTemplate_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
