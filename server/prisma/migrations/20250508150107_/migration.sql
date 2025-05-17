/*
  Warnings:

  - You are about to drop the column `hasSignature` on the `Report` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Report" DROP COLUMN "hasSignature",
ADD COLUMN     "visitTypeId" TEXT;

-- AlterTable
ALTER TABLE "ReportTask" ADD COLUMN     "taskId" TEXT;

-- CreateTable
CREATE TABLE "VisitSnapshot" (
    "id" TEXT NOT NULL,
    "reportId" TEXT NOT NULL,
    "visitTypeName" TEXT NOT NULL,
    "visitTypeDescription" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VisitSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaskSnapshot" (
    "id" TEXT NOT NULL,
    "visitSnapshotId" TEXT NOT NULL,
    "originalTaskId" TEXT,
    "taskType" "TaskType" NOT NULL,
    "taskName" TEXT NOT NULL,
    "careworkerNotes" TEXT,

    CONSTRAINT "TaskSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "VisitSnapshot_reportId_key" ON "VisitSnapshot"("reportId");

-- CreateIndex
CREATE INDEX "TaskSnapshot_visitSnapshotId_idx" ON "TaskSnapshot"("visitSnapshotId");

-- CreateIndex
CREATE INDEX "TaskSnapshot_originalTaskId_idx" ON "TaskSnapshot"("originalTaskId");

-- CreateIndex
CREATE INDEX "ReportTask_taskId_idx" ON "ReportTask"("taskId");

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_visitTypeId_fkey" FOREIGN KEY ("visitTypeId") REFERENCES "VisitType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VisitSnapshot" ADD CONSTRAINT "VisitSnapshot_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Report"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskSnapshot" ADD CONSTRAINT "TaskSnapshot_visitSnapshotId_fkey" FOREIGN KEY ("visitSnapshotId") REFERENCES "VisitSnapshot"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportTask" ADD CONSTRAINT "ReportTask_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE SET NULL ON UPDATE CASCADE;
