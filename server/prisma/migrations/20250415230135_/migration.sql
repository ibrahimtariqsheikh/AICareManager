/*
  Warnings:

  - A unique constraint covering the columns `[userId,clientId,date,startTime,endTime]` on the table `Schedule` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "CustomTaskCategory" AS ENUM ('HEALTH_MONITORING', 'PERSONAL_CARE', 'MEDICATION', 'MEAL_PREPARATION', 'OTHER');

-- CreateEnum
CREATE TYPE "CustomTaskFrequency" AS ENUM ('DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY');

-- CreateEnum
CREATE TYPE "CustomTaskPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- DropIndex
DROP INDEX "Schedule_clientId_idx";

-- DropIndex
DROP INDEX "Schedule_userId_idx";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "groupId" TEXT;

-- CreateTable
CREATE TABLE "Group" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "agencyId" TEXT,

    CONSTRAINT "Group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RateSheet" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "hourlyRate" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "agencyId" TEXT,

    CONSTRAINT "RateSheet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomTask" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "placeholder" TEXT NOT NULL,
    "category" "CustomTaskCategory" NOT NULL,
    "frequency" "CustomTaskFrequency" NOT NULL,
    "priority" "CustomTaskPriority" NOT NULL,
    "icon" TEXT,
    "agencyId" TEXT,

    CONSTRAINT "CustomTask_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Schedule_userId_date_idx" ON "Schedule"("userId", "date");

-- CreateIndex
CREATE INDEX "Schedule_clientId_date_idx" ON "Schedule"("clientId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "Schedule_userId_clientId_date_startTime_endTime_key" ON "Schedule"("userId", "clientId", "date", "startTime", "endTime");

-- AddForeignKey
ALTER TABLE "Group" ADD CONSTRAINT "Group_agencyId_fkey" FOREIGN KEY ("agencyId") REFERENCES "Agency"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RateSheet" ADD CONSTRAINT "RateSheet_agencyId_fkey" FOREIGN KEY ("agencyId") REFERENCES "Agency"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomTask" ADD CONSTRAINT "CustomTask_agencyId_fkey" FOREIGN KEY ("agencyId") REFERENCES "Agency"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE SET NULL ON UPDATE CASCADE;
