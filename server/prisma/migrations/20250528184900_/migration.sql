/*
  Warnings:

  - The values [HEALTH_CHANGE,BEHAVIOR,MISSED_TASK] on the enum `AlertType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "AlertType_new" AS ENUM ('INCIDENT', 'ACCIDENT', 'MEDICATION', 'LATE_VISIT', 'LOCATION', 'HEALTH_CONCERN', 'SAFEGUARDING_CONCERN', 'CHALLENGING_BEHAVIOUR', 'OTHER');
ALTER TABLE "Alert" ALTER COLUMN "type" TYPE "AlertType_new" USING ("type"::text::"AlertType_new");
ALTER TYPE "AlertType" RENAME TO "AlertType_old";
ALTER TYPE "AlertType_new" RENAME TO "AlertType";
DROP TYPE "AlertType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Report" DROP CONSTRAINT "Report_userId_fkey";

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
