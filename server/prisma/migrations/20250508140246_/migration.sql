-- AlterTable
ALTER TABLE "Medication" ADD COLUMN     "visitTypeId" TEXT;

-- CreateIndex
CREATE INDEX "Medication_visitTypeId_idx" ON "Medication"("visitTypeId");

-- AddForeignKey
ALTER TABLE "Medication" ADD CONSTRAINT "Medication_visitTypeId_fkey" FOREIGN KEY ("visitTypeId") REFERENCES "VisitType"("id") ON DELETE SET NULL ON UPDATE CASCADE;
