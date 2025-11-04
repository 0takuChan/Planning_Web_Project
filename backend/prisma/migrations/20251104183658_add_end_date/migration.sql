/*
  Warnings:

  - You are about to drop the column `actual_date` on the `ProductionLog` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."ProductionLog_actual_date_key";

-- DropIndex
DROP INDEX "public"."ProductionLog_job_id_job_step_id_key";

-- AlterTable
ALTER TABLE "ProductionLog" DROP COLUMN "actual_date",
ADD COLUMN     "end_date" DATE;
