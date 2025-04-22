-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_visitTypeId_fkey";

-- AddForeignKey
ALTER TABLE "VisitType" ADD CONSTRAINT "VisitType_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
