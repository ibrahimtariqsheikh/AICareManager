-- CreateEnum
CREATE TYPE "ShiftReviewStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "ShiftType" AS ENUM ('REGULAR', 'OVERTIME', 'HOLIDAY', 'NIGHT_SHIFT');

-- CreateEnum
CREATE TYPE "ExceptionSeverity" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateTable
CREATE TABLE "ShiftReview" (
    "id" TEXT NOT NULL,
    "agencyId" TEXT NOT NULL,
    "careWorkerId" TEXT NOT NULL,
    "supervisorId" TEXT,
    "approvedById" TEXT,
    "shiftDate" TIMESTAMP(3) NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "totalHours" DOUBLE PRECISION NOT NULL,
    "shiftType" "ShiftType" NOT NULL DEFAULT 'REGULAR',
    "hourlyRate" DOUBLE PRECISION NOT NULL,
    "totalPay" DOUBLE PRECISION NOT NULL,
    "status" "ShiftReviewStatus" NOT NULL DEFAULT 'PENDING',
    "reviewNotes" TEXT,
    "approvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT,

    CONSTRAINT "ShiftReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShiftException" (
    "id" TEXT NOT NULL,
    "shiftReviewId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "severity" "ExceptionSeverity" NOT NULL DEFAULT 'MEDIUM',
    "detectedBy" TEXT,
    "detectedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isResolved" BOOLEAN NOT NULL DEFAULT false,
    "resolvedAt" TIMESTAMP(3),
    "resolvedBy" TEXT,
    "resolutionNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ShiftException_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ShiftReview_agencyId_idx" ON "ShiftReview"("agencyId");

-- CreateIndex
CREATE INDEX "ShiftReview_careWorkerId_idx" ON "ShiftReview"("careWorkerId");

-- CreateIndex
CREATE INDEX "ShiftReview_shiftDate_idx" ON "ShiftReview"("shiftDate");

-- CreateIndex
CREATE INDEX "ShiftReview_status_idx" ON "ShiftReview"("status");

-- CreateIndex
CREATE INDEX "ShiftException_shiftReviewId_idx" ON "ShiftException"("shiftReviewId");

-- CreateIndex
CREATE INDEX "ShiftException_severity_idx" ON "ShiftException"("severity");

-- CreateIndex
CREATE INDEX "ShiftException_isResolved_idx" ON "ShiftException"("isResolved");

-- AddForeignKey
ALTER TABLE "ShiftReview" ADD CONSTRAINT "ShiftReview_agencyId_fkey" FOREIGN KEY ("agencyId") REFERENCES "Agency"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShiftReview" ADD CONSTRAINT "ShiftReview_careWorkerId_fkey" FOREIGN KEY ("careWorkerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShiftReview" ADD CONSTRAINT "ShiftReview_supervisorId_fkey" FOREIGN KEY ("supervisorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShiftReview" ADD CONSTRAINT "ShiftReview_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShiftReview" ADD CONSTRAINT "ShiftReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShiftException" ADD CONSTRAINT "ShiftException_shiftReviewId_fkey" FOREIGN KEY ("shiftReviewId") REFERENCES "ShiftReview"("id") ON DELETE CASCADE ON UPDATE CASCADE;
