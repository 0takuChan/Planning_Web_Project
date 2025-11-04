/*
  Warnings:

  - You are about to drop the column `step_option` on the `Step` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "JobStep" ADD COLUMN     "step_option" VARCHAR(50);

-- AlterTable
ALTER TABLE "Step" DROP COLUMN "step_option";
