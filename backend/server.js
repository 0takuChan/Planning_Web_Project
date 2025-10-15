import express from "express";
import bodyParser from "body-parser";
import { PrismaClient } from '@prisma/client';


const app = express();
const prisma = new PrismaClient();

app.use(bodyParser.json());

// ดึงข้อมูล
// ดึงพนักงานทั้งหมด
app.get("/get/employee", async (req, res) => {
  try {
    const employees = await prisma.employee.findMany();
    res.json(employees);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูลพนักงาน" });
  }
});
// ดึงพนักงานตาม ID
app.get("/get/employee/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const employee = await prisma.employee.findUnique({
      where: { employee_id: parseInt(id) },
    });
    if (!employee) return res.status(404).json({ error: "ไม่พบพนักงานนี้" });
    res.json(employee);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูลพนักงาน" });
  }
});

// ดึงข้อมูลลูกค้าทั้งหมด
app.get("/get/customer", async (req, res) => {
  try {
    const customers = await prisma.customer.findMany();
    res.json(customers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูลลูกค้า" });
  }
});

// ดึงลูกค้าตาม ID
app.get("/get/customer/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const customer = await prisma.customer.findUnique({
      where: { customer_id: parseInt(id) },
    });
    if (!customer) return res.status(404).json({ error: "ไม่พบลูกค้านี้" });
    res.json(customer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูลลูกค้า" });
  }
});
// ดึงงานทั้งหมด
app.get("/get/job", async (req, res) => {
  try {
    const jobs = await prisma.job.findMany();
    res.json(jobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูลงาน" });
  }
});

// ดึงงานตาม ID
app.get("/get/job/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const job = await prisma.job.findUnique({
      where: { job_id: parseInt(id) },
    });
    if (!job) return res.status(404).json({ error: "ไม่พบงานนี้" });
    res.json(job);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูลงาน" });
  }
});

// JobStep
app.get("/jobsteps", async (req, res) => {
  try {
    const jobsteps = await prisma.jobStep.findMany({
      include: { job: true, step: true },
    });
    res.json(jobsteps);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูล JobStep" });
  }
});

// ดึงPlanning
app.get("/get/plannings", async (req, res) => {
  try {
    const plannings = await prisma.planning.findMany({
      include: { job: true, jobStep: true },
    });
    res.json(plannings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูล Planning" });
  }
});

// ดึงProductionLog
app.get("/get/productionlogs", async (req, res) => {
  try {
    const logs = await prisma.productionLog.findMany({
      include: { job: true, jobStep: true, employee: true },
    });
    res.json(logs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูล ProductionLog" });
  }
});

// ดึง Role ทั้งหมด
app.get("/get/roles", async (req, res) => {
  try {
    const roles = await prisma.role.findMany();
    res.json(roles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูล Role" });
  }
});

// ดึง Step ทั้งหมด
app.get("/get/steps", async (req, res) => {
  try {
    const steps = await prisma.step.findMany();
    res.json(steps);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูล Step" });
  }
});


// เพิ่มข้อมูล
// เพิ่มพนักงาน
app.post("/add/employee", async (req, res) => {
  try {
    const { fullname, username, password, email, phone, role_id } = req.body;

    const newEmployee = await prisma.employee.create({
      data: {
        fullname,
        username,
        password,
        email,
        phone,
        role_id,
      },
    });

    res.status(201).json(newEmployee);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการเพิ่มข้อมูลพนักงาน" });
  }
});

//เพิ่มลูกค้า
app.post("/add/customer", async (req, res) => {
  try {
    const { customer_code, fullname, email, phone, address_detail } = req.body;

    const newCustomer = await prisma.customer.create({
      data: {
        customer_code,
        fullname,
        email,
        phone,
        address_detail,
      },
    });

    res.status(201).json(newCustomer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการเพิ่มข้อมูลลูกค้า" });
  }
});

//เพิ่มงาน
app.post("/add/job", async (req, res) => {
  try {
    const {
      job_number,
      created_date,
      end_date,
      customer_id,
      total_quantity,
      clothing_type,
      type_of_fabric,
      employee_id,
      delivery_location,
    } = req.body;

    const newJob = await prisma.job.create({
      data: {
        job_number,
        created_date: new Date(created_date),
        end_date: new Date(end_date),
        customer_id,
        total_quantity,
        clothing_type,
        type_of_fabric,
        employee_id,
        delivery_location,
      },
    });

    res.status(201).json(newJob);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการเพิ่มข้อมูลงาน" });
  }
});
// เพิ่ม jobsteps
app.post('/add/jobsteps', async (req, res) => {
  const { job_id, step_id } = req.body;

  if (!job_id || !step_id) {
    return res.status(400).json({ error: 'job_id and step_id are required' });
  }

  try {
    const newJobStep = await prisma.jobStep.create({
      data: {
        job_id,
        step_id,
      },
    });
    res.json(newJobStep);
  } catch (error) {
    if (error.code === 'P2002') {
      // Prisma unique constraint violation
      return res.status(400).json({ error: 'JobStep with this job_id and step_id already exists' });
    }
    res.status(500).json({ error: 'Something went wrong', details: error.message });
  }
});

// เพิ่ม plannings
app.post('/add/plannings', async (req, res) => {
  const { job_id, job_step_id, planned_date, planned_quantity } = req.body;

  if (!job_id || !job_step_id || !planned_date || planned_quantity === undefined) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const newPlanning = await prisma.planning.create({
      data: {
        job_id,
        job_step_id,
        planned_date: new Date(planned_date),
        planned_quantity,
      },
    });
    res.json(newPlanning);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Planning with this job_id and job_step_id already exists' });
    }
    res.status(500).json({ error: 'Something went wrong', details: error.message });
  }
});
//เพิ่ม productionlogs
app.post('/add/productionlogs', async (req, res) => {
  const { job_id, job_step_id, log_date, actual_date, quantity, employee_id } = req.body;

  if (!job_id || !job_step_id || !log_date || !actual_date || !quantity || !employee_id) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const newLog = await prisma.productionLog.create({
      data: {
        job_id,
        job_step_id,
        log_date: new Date(log_date),
        actual_date: new Date(actual_date),
        quantity,
        employee_id,
      },
    });
    res.json(newLog);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'ProductionLog with this job_id and job_step_id already exists' });
    }
    res.status(500).json({ error: 'Something went wrong', details: error.message });
  }
});



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(` Server is running on port ${PORT}`));



