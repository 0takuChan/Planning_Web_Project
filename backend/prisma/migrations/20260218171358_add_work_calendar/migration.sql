/*
  Warnings:

  - A unique constraint covering the columns `[shipment_numbar]` on the table `Shipment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `shipment_numbar` to the `Shipment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Shipment" ADD COLUMN     "shipment_numbar" VARCHAR(20) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Shipment_shipment_numbar_key" ON "Shipment"("shipment_numbar");
