/*
  Warnings:

  - The values [HEALTH_WORKER] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('SOFTWARE_OWNER', 'ADMIN', 'CARE_WORKER', 'OFFICE_STAFF', 'CLIENT', 'FAMILY');
ALTER TABLE "Invitation" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TABLE "User" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "Role_old";
COMMIT;

-- AlterTable
ALTER TABLE "Client" ADD COLUMN     "chargeRate" DOUBLE PRECISION DEFAULT 25.0;

-- AlterTable
ALTER TABLE "Schedule" ADD COLUMN     "chargeRate" DOUBLE PRECISION,
ADD COLUMN     "notes" TEXT;
