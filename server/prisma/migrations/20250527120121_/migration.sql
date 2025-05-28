-- CreateEnum
CREATE TYPE "InvoicePaymentMethod" AS ENUM ('CASH', 'CHEQUE', 'CARD', 'BANK_TRANSFER', 'OTHER');

-- AlterEnum
ALTER TYPE "InvoiceStatus" ADD VALUE 'CANCELLED';

-- AlterTable
ALTER TABLE "Invoice" ADD COLUMN     "paymentMethod" "InvoicePaymentMethod",
ALTER COLUMN "status" SET DEFAULT 'PENDING';
