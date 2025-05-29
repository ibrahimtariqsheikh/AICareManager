/*
  Warnings:

  - You are about to drop the column `affectedParties` on the `RiskAssessment` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `RiskAssessment` table. All the data in the column will be lost.
  - You are about to drop the column `likelihood` on the `RiskAssessment` table. All the data in the column will be lost.
  - You are about to drop the column `mitigationStrategy` on the `RiskAssessment` table. All the data in the column will be lost.
  - You are about to drop the column `riskScore` on the `RiskAssessment` table. All the data in the column will be lost.
  - You are about to drop the column `severity` on the `RiskAssessment` table. All the data in the column will be lost.
  - Added the required column `agencyId` to the `RiskAssessment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `assessorName` to the `RiskAssessment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clientName` to the `RiskAssessment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateOfAssessment` to the `RiskAssessment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `location` to the `RiskAssessment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nextReviewDate` to the `RiskAssessment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `serviceType` to the `RiskAssessment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `category` to the `RiskCategory` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "RiskAssessmentServiceType" AS ENUM ('DOMICILIARY_CARE', 'SUPPORTED_LIVING', 'HOME_HEALTH', 'RESPITE_CARE', 'LIVE_IN_CARE', 'PERSONAL_CARE', 'OTHER');

-- CreateEnum
CREATE TYPE "RiskAssessmentStatus" AS ENUM ('DRAFT', 'IN_PROGRESS', 'PENDING_REVIEW', 'COMPLETED', 'APPROVED', 'EXPIRED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "RiskCategoryType" AS ENUM ('PHYSICAL_HEALTH', 'MENTAL_HEALTH', 'MEDICATION', 'ENVIRONMENTAL', 'BEHAVIOURAL', 'SAFEGUARDING', 'SOCIAL');

-- CreateEnum
CREATE TYPE "RiskLevel" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateEnum
CREATE TYPE "PersonAtRiskType" AS ENUM ('CLIENT', 'STAFF', 'VISITORS', 'FAMILY_MEMBERS', 'OTHER_RESIDENTS', 'GENERAL_PUBLIC');

-- CreateEnum
CREATE TYPE "ReviewStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'APPROVED', 'REQUIRES_ACTION');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY');

-- CreateEnum
CREATE TYPE "CarePlanStatus" AS ENUM ('DRAFT', 'PENDING_REVIEW', 'APPROVED', 'ACTIVE', 'EXPIRED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "CustomQuestionType" AS ENUM ('TEXT', 'RADIO', 'CHECKBOX', 'SELECT', 'TEXTAREA', 'DATE', 'NUMBER', 'BOOLEAN');

-- CreateEnum
CREATE TYPE "ConsentType" AS ENUM ('PERSONAL_CARE', 'MEDICATION_ASSISTANCE', 'SHARING_INFORMATION', 'EMERGENCY_RESPONSE', 'DIGITAL_RECORDS', 'PHOTOS_MEDIA_USE');

-- CreateEnum
CREATE TYPE "MedicalConditionType" AS ENUM ('DEMENTIA', 'STROKE', 'DIABETES', 'PARKINSONS', 'ARTHRITIS', 'COPD_ASTHMA', 'CANCER', 'HIGH_LOW_BLOOD_PRESSURE', 'HEART_CONDITION', 'EPILEPSY', 'LEARNING_DISABILITY', 'OTHER');

-- CreateEnum
CREATE TYPE "MentalHealthConditionType" AS ENUM ('DEPRESSION', 'ANXIETY', 'BIPOLAR', 'SCHIZOPHRENIA', 'PTSD', 'NONE', 'OTHER');

-- CreateEnum
CREATE TYPE "AllergyType" AS ENUM ('NONE', 'MEDICATION', 'FOOD', 'MATERIALS', 'OTHER');

-- CreateEnum
CREATE TYPE "AllergySeverity" AS ENUM ('MILD', 'MODERATE', 'SEVERE', 'LIFE_THREATENING');

-- CreateEnum
CREATE TYPE "DocumentCategory" AS ENUM ('ID', 'LPA', 'DOLS', 'MEDICAL', 'LEGAL', 'OTHER');

-- CreateEnum
CREATE TYPE "RevisionType" AS ENUM ('CREATE', 'UPDATE', 'DELETE', 'STATUS_CHANGE', 'SIGNATURE_ADDED');

-- DropForeignKey
ALTER TABLE "RiskAssessment" DROP CONSTRAINT "RiskAssessment_riskCategoryId_fkey";

-- AlterTable
ALTER TABLE "RiskAssessment" DROP COLUMN "affectedParties",
DROP COLUMN "description",
DROP COLUMN "likelihood",
DROP COLUMN "mitigationStrategy",
DROP COLUMN "riskScore",
DROP COLUMN "severity",
ADD COLUMN     "agencyId" TEXT NOT NULL,
ADD COLUMN     "assessedById" TEXT,
ADD COLUMN     "assessorName" TEXT NOT NULL,
ADD COLUMN     "clientName" TEXT NOT NULL,
ADD COLUMN     "completedAt" TIMESTAMP(3),
ADD COLUMN     "dateOfAssessment" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "highRiskCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "highestRiskScore" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "location" TEXT NOT NULL,
ADD COLUMN     "lowRiskCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "mediumRiskCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "nextReviewDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "serviceType" "RiskAssessmentServiceType" NOT NULL,
ADD COLUMN     "status" "RiskAssessmentStatus" NOT NULL DEFAULT 'DRAFT',
ADD COLUMN     "totalRisks" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "version" INTEGER NOT NULL DEFAULT 1,
ALTER COLUMN "riskCategoryId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "RiskCategory" ADD COLUMN     "category" "RiskCategoryType" NOT NULL,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE "Risk" (
    "id" TEXT NOT NULL,
    "riskAssessmentId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "customTitle" TEXT,
    "description" TEXT NOT NULL,
    "likelihood" INTEGER NOT NULL,
    "severity" INTEGER NOT NULL,
    "riskScore" INTEGER NOT NULL,
    "existingControls" TEXT,
    "additionalActions" TEXT,
    "responsiblePerson" TEXT,
    "actionDeadline" TIMESTAMP(3),
    "idealOutcome" TEXT NOT NULL,
    "measurableGoals" TEXT,
    "reviewNotes" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isResolved" BOOLEAN NOT NULL DEFAULT false,
    "resolvedAt" TIMESTAMP(3),
    "resolvedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "riskCategoryId" TEXT NOT NULL,

    CONSTRAINT "Risk_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RiskPersonAtRisk" (
    "id" TEXT NOT NULL,
    "riskId" TEXT NOT NULL,
    "personType" "PersonAtRiskType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RiskPersonAtRisk_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RiskAssessmentReview" (
    "id" TEXT NOT NULL,
    "riskAssessmentId" TEXT NOT NULL,
    "reviewDate" TIMESTAMP(3) NOT NULL,
    "reviewedBy" TEXT NOT NULL,
    "reviewerRole" TEXT,
    "changesRequired" BOOLEAN NOT NULL DEFAULT false,
    "reviewNotes" TEXT,
    "outcomeAssessment" TEXT,
    "recommendations" TEXT,
    "managerSignOff" TEXT,
    "managerName" TEXT,
    "signOffDate" TIMESTAMP(3),
    "status" "ReviewStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RiskAssessmentReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RiskTemplate" (
    "id" TEXT NOT NULL,
    "agencyId" TEXT,
    "category" "RiskCategoryType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "commonLikelihood" INTEGER,
    "commonSeverity" INTEGER,
    "suggestedControls" TEXT,
    "suggestedActions" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "usageCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RiskTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CarePlan" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "agencyId" TEXT NOT NULL,
    "createdById" TEXT,
    "fullName" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "gender" "Gender" NOT NULL,
    "nhsNumber" TEXT,
    "contactNumber" TEXT,
    "keySafeCode" TEXT,
    "address" TEXT,
    "accessInstructions" TEXT,
    "nextOfKin" TEXT,
    "emergencyContact" TEXT,
    "gpDetails" TEXT,
    "socialWorker" TEXT,
    "hasMentalCapacity" BOOLEAN NOT NULL DEFAULT false,
    "hasGivenConsent" BOOLEAN NOT NULL DEFAULT false,
    "hasLpaConsent" BOOLEAN NOT NULL DEFAULT false,
    "consentNotes" TEXT,
    "consentSignatureName" TEXT,
    "consentSignatureRelationship" TEXT,
    "consentSignatureDate" TIMESTAMP(3),
    "consentSignatureWitness" TEXT,
    "otherMedicalConditions" TEXT,
    "otherMentalHealthConditions" TEXT,
    "otherAllergies" TEXT,
    "hasInfectionRisk" BOOLEAN NOT NULL DEFAULT false,
    "infectionRiskDetails" TEXT,
    "healthDescription" TEXT,
    "emergencyPlanMissedVisit" BOOLEAN NOT NULL DEFAULT false,
    "emergencyPlanNoAnswer" BOOLEAN NOT NULL DEFAULT false,
    "emergencyPlanEmergency" BOOLEAN NOT NULL DEFAULT false,
    "otherNotes" TEXT,
    "summary" TEXT,
    "hasConsentSignature" BOOLEAN NOT NULL DEFAULT false,
    "hasClientSignature" BOOLEAN NOT NULL DEFAULT false,
    "hasStaffSignature" BOOLEAN NOT NULL DEFAULT false,
    "hasCoordinatorSignature" BOOLEAN NOT NULL DEFAULT false,
    "staffSignatureName" TEXT,
    "staffSignatureDate" TIMESTAMP(3),
    "coordinatorSignatureName" TEXT,
    "coordinatorSignatureDate" TIMESTAMP(3),
    "status" "CarePlanStatus" NOT NULL DEFAULT 'DRAFT',
    "version" INTEGER NOT NULL DEFAULT 1,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "completedAt" TIMESTAMP(3),
    "reviewDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CarePlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CarePlanConsent" (
    "id" TEXT NOT NULL,
    "carePlanId" TEXT NOT NULL,
    "consentType" "ConsentType" NOT NULL,
    "granted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CarePlanConsent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CarePlanMedicalCondition" (
    "id" TEXT NOT NULL,
    "carePlanId" TEXT NOT NULL,
    "condition" "MedicalConditionType" NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CarePlanMedicalCondition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CarePlanMentalHealthCondition" (
    "id" TEXT NOT NULL,
    "carePlanId" TEXT NOT NULL,
    "condition" "MentalHealthConditionType" NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CarePlanMentalHealthCondition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CarePlanAllergy" (
    "id" TEXT NOT NULL,
    "carePlanId" TEXT NOT NULL,
    "allergyType" "AllergyType" NOT NULL,
    "description" TEXT,
    "severity" "AllergySeverity" NOT NULL DEFAULT 'MILD',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CarePlanAllergy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CarePlanCustomQuestion" (
    "id" TEXT NOT NULL,
    "carePlanId" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "type" "CustomQuestionType" NOT NULL,
    "section" TEXT NOT NULL,
    "required" BOOLEAN NOT NULL DEFAULT false,
    "textAnswer" TEXT,
    "booleanAnswer" BOOLEAN,
    "dateAnswer" TIMESTAMP(3),
    "numberAnswer" DOUBLE PRECISION,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CarePlanCustomQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CarePlanQuestionOption" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "optionText" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CarePlanQuestionOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CarePlanQuestionAnswer" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "selectedValue" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CarePlanQuestionAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CarePlanDocument" (
    "id" TEXT NOT NULL,
    "carePlanId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "fileType" TEXT,
    "fileSize" INTEGER,
    "category" "DocumentCategory" NOT NULL DEFAULT 'OTHER',
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uploadedBy" TEXT,

    CONSTRAINT "CarePlanDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CarePlanRevision" (
    "id" TEXT NOT NULL,
    "carePlanId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "changeType" "RevisionType" NOT NULL,
    "fieldChanged" TEXT,
    "oldValue" TEXT,
    "newValue" TEXT,
    "reason" TEXT,
    "revisedBy" TEXT NOT NULL,
    "revisedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CarePlanRevision_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Risk_riskAssessmentId_idx" ON "Risk"("riskAssessmentId");

-- CreateIndex
CREATE INDEX "Risk_riskScore_idx" ON "Risk"("riskScore");

-- CreateIndex
CREATE INDEX "RiskPersonAtRisk_riskId_idx" ON "RiskPersonAtRisk"("riskId");

-- CreateIndex
CREATE UNIQUE INDEX "RiskPersonAtRisk_riskId_personType_key" ON "RiskPersonAtRisk"("riskId", "personType");

-- CreateIndex
CREATE INDEX "RiskAssessmentReview_riskAssessmentId_idx" ON "RiskAssessmentReview"("riskAssessmentId");

-- CreateIndex
CREATE INDEX "RiskAssessmentReview_reviewDate_idx" ON "RiskAssessmentReview"("reviewDate");

-- CreateIndex
CREATE INDEX "RiskAssessmentReview_status_idx" ON "RiskAssessmentReview"("status");

-- CreateIndex
CREATE INDEX "RiskTemplate_category_idx" ON "RiskTemplate"("category");

-- CreateIndex
CREATE INDEX "RiskTemplate_agencyId_idx" ON "RiskTemplate"("agencyId");

-- CreateIndex
CREATE INDEX "RiskTemplate_isActive_idx" ON "RiskTemplate"("isActive");

-- CreateIndex
CREATE INDEX "CarePlan_clientId_idx" ON "CarePlan"("clientId");

-- CreateIndex
CREATE INDEX "CarePlan_agencyId_idx" ON "CarePlan"("agencyId");

-- CreateIndex
CREATE INDEX "CarePlan_status_idx" ON "CarePlan"("status");

-- CreateIndex
CREATE INDEX "CarePlan_createdAt_idx" ON "CarePlan"("createdAt");

-- CreateIndex
CREATE INDEX "CarePlanConsent_carePlanId_idx" ON "CarePlanConsent"("carePlanId");

-- CreateIndex
CREATE UNIQUE INDEX "CarePlanConsent_carePlanId_consentType_key" ON "CarePlanConsent"("carePlanId", "consentType");

-- CreateIndex
CREATE INDEX "CarePlanMedicalCondition_carePlanId_idx" ON "CarePlanMedicalCondition"("carePlanId");

-- CreateIndex
CREATE UNIQUE INDEX "CarePlanMedicalCondition_carePlanId_condition_key" ON "CarePlanMedicalCondition"("carePlanId", "condition");

-- CreateIndex
CREATE INDEX "CarePlanMentalHealthCondition_carePlanId_idx" ON "CarePlanMentalHealthCondition"("carePlanId");

-- CreateIndex
CREATE UNIQUE INDEX "CarePlanMentalHealthCondition_carePlanId_condition_key" ON "CarePlanMentalHealthCondition"("carePlanId", "condition");

-- CreateIndex
CREATE INDEX "CarePlanAllergy_carePlanId_idx" ON "CarePlanAllergy"("carePlanId");

-- CreateIndex
CREATE UNIQUE INDEX "CarePlanAllergy_carePlanId_allergyType_key" ON "CarePlanAllergy"("carePlanId", "allergyType");

-- CreateIndex
CREATE INDEX "CarePlanCustomQuestion_carePlanId_idx" ON "CarePlanCustomQuestion"("carePlanId");

-- CreateIndex
CREATE INDEX "CarePlanCustomQuestion_section_idx" ON "CarePlanCustomQuestion"("section");

-- CreateIndex
CREATE INDEX "CarePlanQuestionOption_questionId_idx" ON "CarePlanQuestionOption"("questionId");

-- CreateIndex
CREATE INDEX "CarePlanQuestionAnswer_questionId_idx" ON "CarePlanQuestionAnswer"("questionId");

-- CreateIndex
CREATE INDEX "CarePlanDocument_carePlanId_idx" ON "CarePlanDocument"("carePlanId");

-- CreateIndex
CREATE INDEX "CarePlanRevision_carePlanId_idx" ON "CarePlanRevision"("carePlanId");

-- CreateIndex
CREATE INDEX "CarePlanRevision_version_idx" ON "CarePlanRevision"("version");

-- CreateIndex
CREATE INDEX "RiskAssessment_clientId_idx" ON "RiskAssessment"("clientId");

-- CreateIndex
CREATE INDEX "RiskAssessment_agencyId_idx" ON "RiskAssessment"("agencyId");

-- CreateIndex
CREATE INDEX "RiskAssessment_status_idx" ON "RiskAssessment"("status");

-- CreateIndex
CREATE INDEX "RiskAssessment_dateOfAssessment_idx" ON "RiskAssessment"("dateOfAssessment");

-- CreateIndex
CREATE INDEX "RiskCategory_agencyId_idx" ON "RiskCategory"("agencyId");

-- CreateIndex
CREATE INDEX "RiskCategory_category_idx" ON "RiskCategory"("category");

-- AddForeignKey
ALTER TABLE "RiskAssessment" ADD CONSTRAINT "RiskAssessment_agencyId_fkey" FOREIGN KEY ("agencyId") REFERENCES "Agency"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiskAssessment" ADD CONSTRAINT "RiskAssessment_assessedById_fkey" FOREIGN KEY ("assessedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiskAssessment" ADD CONSTRAINT "RiskAssessment_riskCategoryId_fkey" FOREIGN KEY ("riskCategoryId") REFERENCES "RiskCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Risk" ADD CONSTRAINT "Risk_riskAssessmentId_fkey" FOREIGN KEY ("riskAssessmentId") REFERENCES "RiskAssessment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Risk" ADD CONSTRAINT "Risk_riskCategoryId_fkey" FOREIGN KEY ("riskCategoryId") REFERENCES "RiskCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiskPersonAtRisk" ADD CONSTRAINT "RiskPersonAtRisk_riskId_fkey" FOREIGN KEY ("riskId") REFERENCES "Risk"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiskAssessmentReview" ADD CONSTRAINT "RiskAssessmentReview_riskAssessmentId_fkey" FOREIGN KEY ("riskAssessmentId") REFERENCES "RiskAssessment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiskTemplate" ADD CONSTRAINT "RiskTemplate_agencyId_fkey" FOREIGN KEY ("agencyId") REFERENCES "Agency"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarePlan" ADD CONSTRAINT "CarePlan_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarePlan" ADD CONSTRAINT "CarePlan_agencyId_fkey" FOREIGN KEY ("agencyId") REFERENCES "Agency"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarePlan" ADD CONSTRAINT "CarePlan_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarePlanConsent" ADD CONSTRAINT "CarePlanConsent_carePlanId_fkey" FOREIGN KEY ("carePlanId") REFERENCES "CarePlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarePlanMedicalCondition" ADD CONSTRAINT "CarePlanMedicalCondition_carePlanId_fkey" FOREIGN KEY ("carePlanId") REFERENCES "CarePlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarePlanMentalHealthCondition" ADD CONSTRAINT "CarePlanMentalHealthCondition_carePlanId_fkey" FOREIGN KEY ("carePlanId") REFERENCES "CarePlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarePlanAllergy" ADD CONSTRAINT "CarePlanAllergy_carePlanId_fkey" FOREIGN KEY ("carePlanId") REFERENCES "CarePlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarePlanCustomQuestion" ADD CONSTRAINT "CarePlanCustomQuestion_carePlanId_fkey" FOREIGN KEY ("carePlanId") REFERENCES "CarePlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarePlanQuestionOption" ADD CONSTRAINT "CarePlanQuestionOption_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "CarePlanCustomQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarePlanQuestionAnswer" ADD CONSTRAINT "CarePlanQuestionAnswer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "CarePlanCustomQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarePlanDocument" ADD CONSTRAINT "CarePlanDocument_carePlanId_fkey" FOREIGN KEY ("carePlanId") REFERENCES "CarePlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarePlanRevision" ADD CONSTRAINT "CarePlanRevision_carePlanId_fkey" FOREIGN KEY ("carePlanId") REFERENCES "CarePlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;
