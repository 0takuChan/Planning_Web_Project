/*
  Warnings:

  - Added the required column `standard_time` to the `Step` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Step"
ADD COLUMN "standard_time" INTEGER;

UPDATE "Step" SET "standard_time" = 15 WHERE step_name = 'Cutting';
UPDATE "Step" SET "standard_time" = 10 WHERE step_name = 'Heating';
UPDATE "Step" SET "standard_time" = 20 WHERE step_name = 'Embroidering';
UPDATE "Step" SET "standard_time" = 30 WHERE step_name = 'Sewing';
UPDATE "Step" SET "standard_time" = 5  WHERE step_name = 'QC';
UPDATE "Step" SET "standard_time" = 5  WHERE step_name = 'Pack';

ALTER TABLE "Step"
ALTER COLUMN "standard_time" SET NOT NULL;


-- CreateTable
CREATE TABLE "StepCapacity" (
    "capacity_id" SERIAL NOT NULL,
    "step_id" INTEGER NOT NULL,
    "worker_count" INTEGER NOT NULL,
    "work_date" DATE NOT NULL,

    CONSTRAINT "StepCapacity_pkey" PRIMARY KEY ("capacity_id")
);

-- CreateTable
CREATE TABLE "ProductionSchedule" (
    "schedule_id" SERIAL NOT NULL,
    "job_id" INTEGER NOT NULL,
    "job_step_id" INTEGER NOT NULL,
    "schedule_date" DATE NOT NULL,
    "planned_qty" INTEGER NOT NULL,

    CONSTRAINT "ProductionSchedule_pkey" PRIMARY KEY ("schedule_id")
);

-- CreateTable
CREATE TABLE "WorkCalendar" (
    "calendar_id" SERIAL NOT NULL,
    "work_date" DATE NOT NULL,
    "work_hour" INTEGER NOT NULL,

    CONSTRAINT "WorkCalendar_pkey" PRIMARY KEY ("calendar_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WorkCalendar_work_date_key" ON "WorkCalendar"("work_date");

-- AddForeignKey
ALTER TABLE "StepCapacity" ADD CONSTRAINT "StepCapacity_step_id_fkey" FOREIGN KEY ("step_id") REFERENCES "Step"("step_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductionSchedule" ADD CONSTRAINT "ProductionSchedule_job_step_id_fkey" FOREIGN KEY ("job_step_id") REFERENCES "JobStep"("job_step_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductionSchedule" ADD CONSTRAINT "ProductionSchedule_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "Job"("job_id") ON DELETE RESTRICT ON UPDATE CASCADE;
