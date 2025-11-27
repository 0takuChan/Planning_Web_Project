-- CreateTable
CREATE TABLE "Role" (
    "role_id" SERIAL NOT NULL,
    "role_name" VARCHAR(50) NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("role_id")
);

-- CreateTable
CREATE TABLE "Employee" (
    "employee_id" SERIAL NOT NULL,
    "fullname" VARCHAR(100) NOT NULL,
    "username" VARCHAR(50) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "phone" VARCHAR(15) NOT NULL,
    "role_id" INTEGER NOT NULL,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("employee_id")
);

-- CreateTable
CREATE TABLE "Customer" (
    "customer_id" SERIAL NOT NULL,
    "customer_code" VARCHAR(20) NOT NULL,
    "fullname" VARCHAR(100) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "phone" VARCHAR(15) NOT NULL,
    "address_detail" TEXT NOT NULL,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("customer_id")
);

-- CreateTable
CREATE TABLE "Job" (
    "job_id" SERIAL NOT NULL,
    "job_number" VARCHAR(20) NOT NULL,
    "created_date" DATE NOT NULL,
    "end_date" DATE NOT NULL,
    "customer_id" INTEGER NOT NULL,
    "total_quantity" INTEGER NOT NULL,
    "clothing_type" VARCHAR(50) NOT NULL,
    "type_of_fabric" VARCHAR(50) NOT NULL,
    "employee_id" INTEGER NOT NULL,
    "delivery_location" VARCHAR(255) NOT NULL,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("job_id")
);

-- CreateTable
CREATE TABLE "Step" (
    "step_id" SERIAL NOT NULL,
    "step_name" VARCHAR(50) NOT NULL,

    CONSTRAINT "Step_pkey" PRIMARY KEY ("step_id")
);

-- CreateTable
CREATE TABLE "JobStep" (
    "job_step_id" SERIAL NOT NULL,
    "job_id" INTEGER NOT NULL,
    "step_id" INTEGER NOT NULL,

    CONSTRAINT "JobStep_pkey" PRIMARY KEY ("job_step_id")
);

-- CreateTable
CREATE TABLE "Planning" (
    "planning_id" SERIAL NOT NULL,
    "job_id" INTEGER NOT NULL,
    "job_step_id" INTEGER NOT NULL,
    "planned_date" DATE NOT NULL,
    "planned_quantity" INTEGER NOT NULL,

    CONSTRAINT "Planning_pkey" PRIMARY KEY ("planning_id")
);

-- CreateTable
CREATE TABLE "ProductionLog" (
    "log_id" SERIAL NOT NULL,
    "job_id" INTEGER NOT NULL,
    "job_step_id" INTEGER NOT NULL,
    "log_date" DATE NOT NULL,
    "actual_date" DATE NOT NULL,
    "quantity" INTEGER NOT NULL,
    "employee_id" INTEGER NOT NULL,

    CONSTRAINT "ProductionLog_pkey" PRIMARY KEY ("log_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Role_role_name_key" ON "Role"("role_name");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_username_key" ON "Employee"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_customer_code_key" ON "Customer"("customer_code");

-- CreateIndex
CREATE UNIQUE INDEX "Job_job_number_key" ON "Job"("job_number");

-- CreateIndex
CREATE UNIQUE INDEX "Step_step_name_key" ON "Step"("step_name");

-- CreateIndex
CREATE UNIQUE INDEX "JobStep_job_id_step_id_key" ON "JobStep"("job_id", "step_id");

-- CreateIndex
CREATE UNIQUE INDEX "Planning_planned_date_key" ON "Planning"("planned_date");

-- CreateIndex
CREATE UNIQUE INDEX "Planning_job_id_job_step_id_key" ON "Planning"("job_id", "job_step_id");

-- CreateIndex
CREATE UNIQUE INDEX "ProductionLog_actual_date_key" ON "ProductionLog"("actual_date");

-- CreateIndex
CREATE UNIQUE INDEX "ProductionLog_job_id_job_step_id_key" ON "ProductionLog"("job_id", "job_step_id");

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "Role"("role_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "Customer"("customer_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "Employee"("employee_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobStep" ADD CONSTRAINT "JobStep_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "Job"("job_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobStep" ADD CONSTRAINT "JobStep_step_id_fkey" FOREIGN KEY ("step_id") REFERENCES "Step"("step_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Planning" ADD CONSTRAINT "Planning_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "Job"("job_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Planning" ADD CONSTRAINT "Planning_job_step_id_fkey" FOREIGN KEY ("job_step_id") REFERENCES "JobStep"("job_step_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductionLog" ADD CONSTRAINT "ProductionLog_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "Job"("job_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductionLog" ADD CONSTRAINT "ProductionLog_job_step_id_fkey" FOREIGN KEY ("job_step_id") REFERENCES "JobStep"("job_step_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductionLog" ADD CONSTRAINT "ProductionLog_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "Employee"("employee_id") ON DELETE RESTRICT ON UPDATE CASCADE;
