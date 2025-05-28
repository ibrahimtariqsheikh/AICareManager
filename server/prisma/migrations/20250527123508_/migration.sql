-- CreateEnum
CREATE TYPE "ExpenseType" AS ENUM ('COMPANY', 'CLIENT', 'CARE_WORKER', 'OFFICE_STAFF');

-- CreateEnum
CREATE TYPE "ExpenseAssociatedEntity" AS ENUM ('CLIENT', 'CARE_WORKER', 'OFFICE_STAFF');

-- CreateEnum
CREATE TYPE "ExpenseCategory" AS ENUM ('TRAVEL', 'MEALS', 'LODGING', 'OTHER');

-- CreateTable
CREATE TABLE "Expenses" (
    "id" TEXT NOT NULL,
    "type" "ExpenseType" NOT NULL,
    "associatedEntity" "ExpenseAssociatedEntity" NOT NULL,
    "category" "ExpenseCategory" NOT NULL,
    "description" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "agencyId" TEXT NOT NULL,

    CONSTRAINT "Expenses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payroll" (
    "id" TEXT NOT NULL,
    "payrollNumber" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "agencyId" TEXT NOT NULL,
    "expensesFromDate" TIMESTAMP(3) NOT NULL,
    "expensesToDate" TIMESTAMP(3) NOT NULL,
    "scheduleFromDate" TIMESTAMP(3) NOT NULL,
    "scheduleToDate" TIMESTAMP(3) NOT NULL,
    "calculatedScheduleHours" DOUBLE PRECISION NOT NULL,
    "calculatedExpenses" DOUBLE PRECISION NOT NULL,
    "totalEarnings" DOUBLE PRECISION NOT NULL,
    "totalDeductions" DOUBLE PRECISION NOT NULL,
    "netPay" DOUBLE PRECISION NOT NULL,
    "taxRate" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payroll_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Expenses" ADD CONSTRAINT "Expenses_agencyId_fkey" FOREIGN KEY ("agencyId") REFERENCES "Agency"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payroll" ADD CONSTRAINT "Payroll_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payroll" ADD CONSTRAINT "Payroll_agencyId_fkey" FOREIGN KEY ("agencyId") REFERENCES "Agency"("id") ON DELETE CASCADE ON UPDATE CASCADE;
