/*
  Warnings:

  - Made the column `job_id` on table `Planning` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `standard_time` to the `Step` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Planning" DROP CONSTRAINT "Planning_job_id_fkey";

-- AlterTable
ALTER TABLE "Planning" ALTER COLUMN "job_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "Step" ADD COLUMN     "standard_time" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "TransportType" (
    "transport_type_id" SERIAL NOT NULL,
    "transport_name" VARCHAR(50) NOT NULL,

    CONSTRAINT "TransportType_pkey" PRIMARY KEY ("transport_type_id")
);

-- CreateTable
CREATE TABLE "ShipmentStatus" (
    "status_id" SERIAL NOT NULL,
    "status_name" VARCHAR(50) NOT NULL,

    CONSTRAINT "ShipmentStatus_pkey" PRIMARY KEY ("status_id")
);

-- CreateTable
CREATE TABLE "Shipment" (
    "shipment_id" SERIAL NOT NULL,
    "job_id" INTEGER NOT NULL,
    "transport_type_id" INTEGER NOT NULL,
    "status_id" INTEGER NOT NULL,
    "departure_date" DATE NOT NULL,
    "arrival_date" DATE NOT NULL,
    "note" TEXT,

    CONSTRAINT "Shipment_pkey" PRIMARY KEY ("shipment_id")
);

-- CreateTable
CREATE TABLE "ShipmentItem" (
    "shipment_item_id" SERIAL NOT NULL,
    "shipment_id" INTEGER NOT NULL,
    "job_step_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "ShipmentItem_pkey" PRIMARY KEY ("shipment_item_id")
);

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
CREATE UNIQUE INDEX "TransportType_transport_name_key" ON "TransportType"("transport_name");

-- CreateIndex
CREATE UNIQUE INDEX "ShipmentStatus_status_name_key" ON "ShipmentStatus"("status_name");

-- CreateIndex
CREATE UNIQUE INDEX "WorkCalendar_work_date_key" ON "WorkCalendar"("work_date");

-- AddForeignKey
ALTER TABLE "Planning" ADD CONSTRAINT "Planning_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "Job"("job_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shipment" ADD CONSTRAINT "Shipment_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "Job"("job_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shipment" ADD CONSTRAINT "Shipment_transport_type_id_fkey" FOREIGN KEY ("transport_type_id") REFERENCES "TransportType"("transport_type_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shipment" ADD CONSTRAINT "Shipment_status_id_fkey" FOREIGN KEY ("status_id") REFERENCES "ShipmentStatus"("status_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShipmentItem" ADD CONSTRAINT "ShipmentItem_shipment_id_fkey" FOREIGN KEY ("shipment_id") REFERENCES "Shipment"("shipment_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShipmentItem" ADD CONSTRAINT "ShipmentItem_job_step_id_fkey" FOREIGN KEY ("job_step_id") REFERENCES "JobStep"("job_step_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StepCapacity" ADD CONSTRAINT "StepCapacity_step_id_fkey" FOREIGN KEY ("step_id") REFERENCES "Step"("step_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductionSchedule" ADD CONSTRAINT "ProductionSchedule_job_step_id_fkey" FOREIGN KEY ("job_step_id") REFERENCES "JobStep"("job_step_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductionSchedule" ADD CONSTRAINT "ProductionSchedule_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "Job"("job_id") ON DELETE RESTRICT ON UPDATE CASCADE;
