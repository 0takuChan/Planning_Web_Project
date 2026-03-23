/*
  Warnings:

  - You are about to drop the column `job_id` on the `Shipment` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Shipment" DROP CONSTRAINT "Shipment_job_id_fkey";

-- AlterTable
ALTER TABLE "Shipment" DROP COLUMN "job_id";
