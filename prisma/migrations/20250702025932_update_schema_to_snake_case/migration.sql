/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Answer` table. All the data in the column will be lost.
  - You are about to drop the column `numericOrder` on the `Answer` table. All the data in the column will be lost.
  - You are about to drop the column `questionId` on the `Answer` table. All the data in the column will be lost.
  - You are about to drop the column `skiptoQuestionId` on the `Answer` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Answer` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `categoryId` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `communityId` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `companyId` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `endDate` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `languageId` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `projectTypeId` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `sampleSize` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `sampleSourceId` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the column `questionTypeId` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the column `questionnaireId` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Questionnaire` table. All the data in the column will be lost.
  - You are about to drop the column `filterId` on the `Questionnaire` table. All the data in the column will be lost.
  - You are about to drop the column `projectId` on the `Questionnaire` table. All the data in the column will be lost.
  - You are about to drop the column `randomizedAnswers` on the `Questionnaire` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Questionnaire` table. All the data in the column will be lost.
  - Added the required column `numeric_order` to the `Answer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `question_id` to the `Answer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Answer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `category_id` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `community_id` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `company_id` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `end_date` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `language_id` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `project_type_id` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sample_size` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sample_source_id` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start_date` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `question_type_id` to the `Question` table without a default value. This is not possible if the table is not empty.
  - Added the required column `questionnaire_id` to the `Question` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Question` table without a default value. This is not possible if the table is not empty.
  - Added the required column `filter_id` to the `Questionnaire` table without a default value. This is not possible if the table is not empty.
  - Added the required column `project_id` to the `Questionnaire` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Questionnaire` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Answer" DROP CONSTRAINT "Answer_questionId_fkey";

-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_companyId_fkey";

-- DropForeignKey
ALTER TABLE "Question" DROP CONSTRAINT "Question_questionnaireId_fkey";

-- DropForeignKey
ALTER TABLE "Questionnaire" DROP CONSTRAINT "Questionnaire_projectId_fkey";

-- AlterTable - Company: Adicionar novas colunas e copiar dados
ALTER TABLE "Company" ADD COLUMN "created_at" TIMESTAMP(3);
ALTER TABLE "Company" ADD COLUMN "updated_at" TIMESTAMP(3);

-- Copiar dados das colunas antigas para as novas
UPDATE "Company" SET 
  "created_at" = "createdAt",
  "updated_at" = "updatedAt";

-- Remover colunas antigas e tornar as novas NOT NULL
ALTER TABLE "Company" ALTER COLUMN "created_at" SET NOT NULL;
ALTER TABLE "Company" ALTER COLUMN "updated_at" SET NOT NULL;
ALTER TABLE "Company" DROP COLUMN "createdAt";
ALTER TABLE "Company" DROP COLUMN "updatedAt";

-- AlterTable - Project: Adicionar novas colunas e copiar dados
ALTER TABLE "Project" ADD COLUMN "category_id" INTEGER;
ALTER TABLE "Project" ADD COLUMN "community_id" INTEGER;
ALTER TABLE "Project" ADD COLUMN "company_id" INTEGER;
ALTER TABLE "Project" ADD COLUMN "created_at" TIMESTAMP(3);
ALTER TABLE "Project" ADD COLUMN "end_date" TIMESTAMP(3);
ALTER TABLE "Project" ADD COLUMN "language_id" INTEGER;
ALTER TABLE "Project" ADD COLUMN "project_type_id" INTEGER;
ALTER TABLE "Project" ADD COLUMN "sample_size" INTEGER;
ALTER TABLE "Project" ADD COLUMN "sample_source_id" INTEGER;
ALTER TABLE "Project" ADD COLUMN "start_date" TIMESTAMP(3);
ALTER TABLE "Project" ADD COLUMN "updated_at" TIMESTAMP(3);

-- Copiar dados das colunas antigas para as novas
UPDATE "Project" SET 
  "category_id" = "categoryId",
  "community_id" = "communityId",
  "company_id" = "companyId",
  "created_at" = "createdAt",
  "end_date" = "endDate",
  "language_id" = "languageId",
  "project_type_id" = "projectTypeId",
  "sample_size" = "sampleSize",
  "sample_source_id" = "sampleSourceId",
  "start_date" = "startDate",
  "updated_at" = "updatedAt";

-- Remover colunas antigas e tornar as novas NOT NULL
ALTER TABLE "Project" ALTER COLUMN "category_id" SET NOT NULL;
ALTER TABLE "Project" ALTER COLUMN "community_id" SET NOT NULL;
ALTER TABLE "Project" ALTER COLUMN "company_id" SET NOT NULL;
ALTER TABLE "Project" ALTER COLUMN "created_at" SET NOT NULL;
ALTER TABLE "Project" ALTER COLUMN "end_date" SET NOT NULL;
ALTER TABLE "Project" ALTER COLUMN "language_id" SET NOT NULL;
ALTER TABLE "Project" ALTER COLUMN "project_type_id" SET NOT NULL;
ALTER TABLE "Project" ALTER COLUMN "sample_size" SET NOT NULL;
ALTER TABLE "Project" ALTER COLUMN "sample_source_id" SET NOT NULL;
ALTER TABLE "Project" ALTER COLUMN "start_date" SET NOT NULL;
ALTER TABLE "Project" ALTER COLUMN "updated_at" SET NOT NULL;

ALTER TABLE "Project" DROP COLUMN "categoryId";
ALTER TABLE "Project" DROP COLUMN "communityId";
ALTER TABLE "Project" DROP COLUMN "companyId";
ALTER TABLE "Project" DROP COLUMN "createdAt";
ALTER TABLE "Project" DROP COLUMN "endDate";
ALTER TABLE "Project" DROP COLUMN "languageId";
ALTER TABLE "Project" DROP COLUMN "projectTypeId";
ALTER TABLE "Project" DROP COLUMN "sampleSize";
ALTER TABLE "Project" DROP COLUMN "sampleSourceId";
ALTER TABLE "Project" DROP COLUMN "startDate";
ALTER TABLE "Project" DROP COLUMN "updatedAt";

-- AlterTable - Questionnaire: Adicionar novas colunas e copiar dados
ALTER TABLE "Questionnaire" ADD COLUMN "created_at" TIMESTAMP(3);
ALTER TABLE "Questionnaire" ADD COLUMN "filter_id" INTEGER;
ALTER TABLE "Questionnaire" ADD COLUMN "project_id" INTEGER;
ALTER TABLE "Questionnaire" ADD COLUMN "randomized_answers" BOOLEAN DEFAULT false;
ALTER TABLE "Questionnaire" ADD COLUMN "updated_at" TIMESTAMP(3);

-- Copiar dados das colunas antigas para as novas
UPDATE "Questionnaire" SET 
  "created_at" = "createdAt",
  "filter_id" = "filterId",
  "project_id" = "projectId",
  "randomized_answers" = "randomizedAnswers",
  "updated_at" = "updatedAt";

-- Remover colunas antigas e tornar as novas NOT NULL
ALTER TABLE "Questionnaire" ALTER COLUMN "created_at" SET NOT NULL;
ALTER TABLE "Questionnaire" ALTER COLUMN "filter_id" SET NOT NULL;
ALTER TABLE "Questionnaire" ALTER COLUMN "project_id" SET NOT NULL;
ALTER TABLE "Questionnaire" ALTER COLUMN "updated_at" SET NOT NULL;

ALTER TABLE "Questionnaire" DROP COLUMN "createdAt";
ALTER TABLE "Questionnaire" DROP COLUMN "filterId";
ALTER TABLE "Questionnaire" DROP COLUMN "projectId";
ALTER TABLE "Questionnaire" DROP COLUMN "randomizedAnswers";
ALTER TABLE "Questionnaire" DROP COLUMN "updatedAt";

-- AlterTable - Question: Adicionar novas colunas e copiar dados
ALTER TABLE "Question" ADD COLUMN "created_at" TIMESTAMP(3);
ALTER TABLE "Question" ADD COLUMN "question_type_id" INTEGER;
ALTER TABLE "Question" ADD COLUMN "questionnaire_id" INTEGER;
ALTER TABLE "Question" ADD COLUMN "updated_at" TIMESTAMP(3);

-- Copiar dados das colunas antigas para as novas
UPDATE "Question" SET 
  "created_at" = "createdAt",
  "question_type_id" = "questionTypeId",
  "questionnaire_id" = "questionnaireId",
  "updated_at" = "updatedAt";

-- Remover colunas antigas e tornar as novas NOT NULL
ALTER TABLE "Question" ALTER COLUMN "created_at" SET NOT NULL;
ALTER TABLE "Question" ALTER COLUMN "question_type_id" SET NOT NULL;
ALTER TABLE "Question" ALTER COLUMN "questionnaire_id" SET NOT NULL;
ALTER TABLE "Question" ALTER COLUMN "updated_at" SET NOT NULL;

ALTER TABLE "Question" DROP COLUMN "createdAt";
ALTER TABLE "Question" DROP COLUMN "questionTypeId";
ALTER TABLE "Question" DROP COLUMN "questionnaireId";
ALTER TABLE "Question" DROP COLUMN "updatedAt";

-- AlterTable - Answer: Adicionar novas colunas e copiar dados
ALTER TABLE "Answer" ADD COLUMN "created_at" TIMESTAMP(3);
ALTER TABLE "Answer" ADD COLUMN "numeric_order" INTEGER;
ALTER TABLE "Answer" ADD COLUMN "question_id" INTEGER;
ALTER TABLE "Answer" ADD COLUMN "skip_to_question_id" INTEGER;
ALTER TABLE "Answer" ADD COLUMN "updated_at" TIMESTAMP(3);

-- Copiar dados das colunas antigas para as novas
UPDATE "Answer" SET 
  "created_at" = "createdAt",
  "numeric_order" = "numericOrder",
  "question_id" = "questionId",
  "skip_to_question_id" = "skiptoQuestionId",
  "updated_at" = "updatedAt";

-- Remover colunas antigas e tornar as novas NOT NULL
ALTER TABLE "Answer" ALTER COLUMN "created_at" SET NOT NULL;
ALTER TABLE "Answer" ALTER COLUMN "numeric_order" SET NOT NULL;
ALTER TABLE "Answer" ALTER COLUMN "question_id" SET NOT NULL;
ALTER TABLE "Answer" ALTER COLUMN "updated_at" SET NOT NULL;

ALTER TABLE "Answer" DROP COLUMN "createdAt";
ALTER TABLE "Answer" DROP COLUMN "numericOrder";
ALTER TABLE "Answer" DROP COLUMN "questionId";
ALTER TABLE "Answer" DROP COLUMN "skiptoQuestionId";
ALTER TABLE "Answer" DROP COLUMN "updatedAt";

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Questionnaire" ADD CONSTRAINT "Questionnaire_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_questionnaire_id_fkey" FOREIGN KEY ("questionnaire_id") REFERENCES "Questionnaire"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
