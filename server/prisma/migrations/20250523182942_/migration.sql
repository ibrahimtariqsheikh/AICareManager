-- CreateEnum
CREATE TYPE "LeaveEventType" AS ENUM ('ANNUAL_LEAVE', 'SICK_LEAVE', 'PUBLIC_HOLIDAY', 'UNPAID_LEAVE', 'MATERNITY_LEAVE', 'PATERNITY_LEAVE', 'BEREAVEMENT_LEAVE', 'EMERGENCY_LEAVE', 'MEDICAL_APPOINTMENT', 'TOIL', 'OTHER');

-- CreateTable
CREATE TABLE "LeaveEvent" (
    "id" TEXT NOT NULL,
    "eventType" "LeaveEventType" NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,
    "payRate" DOUBLE PRECISION,
    "color" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT,
    "agencyId" TEXT,

    CONSTRAINT "LeaveEvent_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "LeaveEvent" ADD CONSTRAINT "LeaveEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeaveEvent" ADD CONSTRAINT "LeaveEvent_agencyId_fkey" FOREIGN KEY ("agencyId") REFERENCES "Agency"("id") ON DELETE SET NULL ON UPDATE CASCADE;
