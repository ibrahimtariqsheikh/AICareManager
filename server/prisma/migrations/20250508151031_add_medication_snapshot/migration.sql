-- CreateTable
CREATE TABLE "MedicationSnapshot" (
    "id" TEXT NOT NULL,
    "reportId" TEXT NOT NULL,
    "medicationId" TEXT NOT NULL,

    CONSTRAINT "MedicationSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MedicationSnapshot_reportId_key" ON "MedicationSnapshot"("reportId");

-- AddForeignKey
ALTER TABLE "MedicationSnapshot" ADD CONSTRAINT "MedicationSnapshot_medicationId_fkey" FOREIGN KEY ("medicationId") REFERENCES "Medication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicationSnapshot" ADD CONSTRAINT "MedicationSnapshot_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Report"("id") ON DELETE CASCADE ON UPDATE CASCADE;
