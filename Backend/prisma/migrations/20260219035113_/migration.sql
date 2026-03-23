/*
  Warnings:

  - You are about to drop the column `job_id` on the `Shipment` table. All the data in the column will be lost.
  - Added the required column `customer_id` to the `Shipment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Shipment" DROP CONSTRAINT "Shipment_job_id_fkey";

-- AlterTable
ALTER TABLE "Shipment" DROP COLUMN "job_id",
ADD COLUMN     "customer_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Shipment" ADD CONSTRAINT "Shipment_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "Customer"("customer_id") ON DELETE RESTRICT ON UPDATE CASCADE;
