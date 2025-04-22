-- CreateEnum
CREATE TYPE "NotificationFrequency" AS ENUM ('DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY');

-- CreateEnum
CREATE TYPE "PreferredNotificationMethod" AS ENUM ('EMAIL', 'SMS', 'PHONE');

-- AlterTable
ALTER TABLE "Agency" ADD COLUMN     "allowCareWorkersEditCheckIn" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "allowFamilyReviews" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "careWorkerVisitAlerts" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "clientAndCareWorkerReminders" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "clientBirthdayReminders" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "distanceAlerts" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "distanceThreshold" TEXT NOT NULL DEFAULT '10',
ADD COLUMN     "enableDistanceAlerts" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "enableFamilySchedule" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "enableWeek1And2Scheduling" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lateVisitAlerts" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "lateVisitThreshold" TEXT NOT NULL DEFAULT '15',
ADD COLUMN     "missedMedicationAlerts" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "notificationFrequency" "NotificationFrequency" NOT NULL DEFAULT 'DAILY',
ADD COLUMN     "preferredNotificationMethod" "PreferredNotificationMethod" NOT NULL DEFAULT 'EMAIL',
ADD COLUMN     "reviewNotifications" BOOLEAN NOT NULL DEFAULT true;
