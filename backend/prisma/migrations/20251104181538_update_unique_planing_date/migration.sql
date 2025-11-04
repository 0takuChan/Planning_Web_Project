/*
  Warnings:

  - A unique constraint covering the columns `[job_id,job_step_id,planned_date]` on the table `Planning` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."Planning_job_id_job_step_id_key";

-- CreateIndex
CREATE UNIQUE INDEX "Planning_job_id_job_step_id_planned_date_key" ON "Planning"("job_id", "job_step_id", "planned_date");
