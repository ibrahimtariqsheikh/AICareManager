/*
  Warnings:

  - You are about to drop the column `name` on the `Task` table. All the data in the column will be lost.
  - Added the required column `type` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TaskType" AS ENUM ('MEDICATION', 'BODYMAP', 'FOOD', 'DRINKS', 'PERSONALCARE', 'HYGIENE', 'TOILET_ASSISTANCE', 'REPOSITIONING', 'COMPANIONSHIP', 'LAUNDRY', 'GROCERIES', 'HOUSEWORK', 'CHORES', 'INCIDENT_RESPONSE', 'FIRE_SAFETY', 'BLOOD_PRESSURE', 'VITALS', 'OTHER');

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "name",
ADD COLUMN     "type" "TaskType" NOT NULL;
