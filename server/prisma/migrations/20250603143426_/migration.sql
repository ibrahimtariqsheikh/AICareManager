/*
  Warnings:

  - You are about to drop the column `totalMiles` on the `MileageRecord` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `MileageRecord` table. All the data in the column will be lost.
  - Added the required column `amount` to the `MileageRecord` table without a default value. This is not possible if the table is not empty.
  - Added the required column `careWorkerId` to the `MileageRecord` table without a default value. This is not possible if the table is not empty.
  - Added the required column `costPerMile` to the `MileageRecord` table without a default value. This is not possible if the table is not empty.
  - Added the required column `distanceInMiles` to the `MileageRecord` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fromLocation` to the `MileageRecord` table without a default value. This is not possible if the table is not empty.
  - Added the required column `toLocation` to the `MileageRecord` table without a default value. This is not possible if the table is not empty.
  - Added the required column `travelTime` to the `MileageRecord` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "MileageStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- DropForeignKey
ALTER TABLE "MileageRecord" DROP CONSTRAINT "MileageRecord_care_worker_fkey";

-- DropIndex
DROP INDEX "MileageRecord_userId_idx";

-- AlterTable
ALTER TABLE "MileageRecord" DROP COLUMN "totalMiles",
DROP COLUMN "userId",
ADD COLUMN     "amount" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "careWorkerId" TEXT NOT NULL,
ADD COLUMN     "costPerMile" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "distanceInMiles" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "fromLocation" TEXT NOT NULL,
ADD COLUMN     "status" "MileageStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "toLocation" TEXT NOT NULL,
ADD COLUMN     "travelTime" DOUBLE PRECISION NOT NULL;

-- CreateIndex
CREATE INDEX "MileageRecord_careWorkerId_idx" ON "MileageRecord"("careWorkerId");

-- AddForeignKey
ALTER TABLE "MileageRecord" ADD CONSTRAINT "MileageRecord_care_worker_fkey" FOREIGN KEY ("careWorkerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
