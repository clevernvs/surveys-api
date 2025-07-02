/*
  Warnings:

  - You are about to drop the column `status` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Questionnaire` table. All the data in the column will be lost.
  - Added the required column `status_id` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status_id` to the `Questionnaire` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Project" DROP COLUMN "status",
ADD COLUMN     "status_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Questionnaire" DROP COLUMN "status",
ADD COLUMN     "status_id" INTEGER NOT NULL;
