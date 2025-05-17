-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_visitTypeId_fkey" FOREIGN KEY ("visitTypeId") REFERENCES "VisitType"("id") ON DELETE SET NULL ON UPDATE CASCADE;
