-- CreateEnum
CREATE TYPE "AlertStatus" AS ENUM ('UNRESOLVED', 'RESOLVED');

-- AlterTable
ALTER TABLE "Alert" ADD COLUMN     "status" "AlertStatus" NOT NULL DEFAULT 'UNRESOLVED';

-- AlterTable
ALTER TABLE "Report" ALTER COLUMN "status" SET DEFAULT 'UNRESOLVED';
