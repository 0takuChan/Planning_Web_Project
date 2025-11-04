/*
  Warnings:

  - You are about to drop the column `actual_date` on the `ProductionLog` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[job_id,job_step_id,planned_date]` on the table `Planning` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `dateline_date` to the `ProductionLog` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Planning" DROP CONSTRAINT "Planning_job_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."ProductionLog" DROP CONSTRAINT "ProductionLog_job_id_fkey";

-- DropIndex
DROP INDEX "public"."Planning_job_id_job_step_id_key";

-- DropIndex
DROP INDEX "public"."ProductionLog_actual_date_key";

-- DropIndex
DROP INDEX "public"."ProductionLog_job_id_job_step_id_key";

-- AlterTable
ALTER TABLE "JobStep" ADD COLUMN     "step_option" VARCHAR(50);

-- AlterTable
ALTER TABLE "Planning" ALTER COLUMN "job_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "ProductionLog" DROP COLUMN "actual_date",
ADD COLUMN     "dateline_date" DATE NOT NULL,
ALTER COLUMN "job_id" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Planning_job_id_job_step_id_planned_date_key" ON "Planning"("job_id", "job_step_id", "planned_date");

-- AddForeignKey
ALTER TABLE "Planning" ADD CONSTRAINT "Planning_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "Job"("job_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductionLog" ADD CONSTRAINT "ProductionLog_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "Job"("job_id") ON DELETE SET NULL ON UPDATE CASCADE;
