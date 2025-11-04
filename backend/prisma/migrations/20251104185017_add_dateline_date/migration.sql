/*
  Warnings:

  - You are about to drop the column `end_date` on the `ProductionLog` table. All the data in the column will be lost.
  - Added the required column `dateline_date` to the `ProductionLog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ProductionLog" DROP COLUMN "end_date",
ADD COLUMN     "dateline_date" DATE NOT NULL;
