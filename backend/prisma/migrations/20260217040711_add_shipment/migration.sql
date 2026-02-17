/*
  Warnings:

  - Made the column `job_id` on table `Planning` required. This step will fail if there are existing NULL values in that column.
  - Made the column `job_id` on table `ProductionLog` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."Planning" DROP CONSTRAINT "Planning_job_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."ProductionLog" DROP CONSTRAINT "ProductionLog_job_id_fkey";

-- AlterTable
ALTER TABLE "Planning" ALTER COLUMN "job_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "ProductionLog" ALTER COLUMN "job_id" SET NOT NULL;

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

-- CreateIndex
CREATE UNIQUE INDEX "TransportType_transport_name_key" ON "TransportType"("transport_name");

-- CreateIndex
CREATE UNIQUE INDEX "ShipmentStatus_status_name_key" ON "ShipmentStatus"("status_name");

-- AddForeignKey
ALTER TABLE "Planning" ADD CONSTRAINT "Planning_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "Job"("job_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductionLog" ADD CONSTRAINT "ProductionLog_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "Job"("job_id") ON DELETE RESTRICT ON UPDATE CASCADE;

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
