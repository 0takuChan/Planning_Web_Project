-- DropForeignKey
ALTER TABLE "public"."Planning" DROP CONSTRAINT "Planning_job_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."ProductionLog" DROP CONSTRAINT "ProductionLog_job_id_fkey";

-- AlterTable
ALTER TABLE "Planning" ALTER COLUMN "job_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "ProductionLog" ALTER COLUMN "job_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Planning" ADD CONSTRAINT "Planning_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "Job"("job_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductionLog" ADD CONSTRAINT "ProductionLog_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "Job"("job_id") ON DELETE SET NULL ON UPDATE CASCADE;
