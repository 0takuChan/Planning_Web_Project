import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
const prisma = new PrismaClient();

async function main(): Promise<void> {
  // --- Role ---
  const roles = [
    { role_name: 'Admin' },
    { role_name: 'Planner' },
    { role_name: 'Orderer' },
    { role_name: 'Recorder' },
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { role_name: role.role_name },
      update: {},
      create: role,
    });
  }

  // --- Step ---
  const steps = [
    { step_name: 'Cutting' },
    { step_name: 'Heating' },
    { step_name: 'Embroidering' },
    { step_name: 'Sewing' },
    { step_name: 'QC' },
    { step_name: 'Pack' },
  ];

  for (const step of steps) {
    await prisma.step.upsert({
      where: { step_name: step.step_name },
      update: {},
      create: step,
    });
  }
// --- Shipment Status ---
const shipmentStatuses = [
  { status_name: 'เตรียมส่ง' },
  { status_name: 'กำลังจัดส่ง' },
  { status_name: 'ส่งแล้ว' },
];

for (const status of shipmentStatuses) {
  await prisma.shipmentStatus.upsert({
    where: { status_name: status.status_name },
    update: {},
    create: status,
  });
}
// --- Transport Type ---
const transportTypes = [
  { transport_name: 'รถ' },
  { transport_name: 'เรือ' },
  { transport_name: 'เครื่องบิน' },
];

for (const type of transportTypes) {
  await prisma.transportType.upsert({
    where: { transport_name: type.transport_name },
    update: {},
    create: type,
  });
}

  // --- Admin ---
  const adminRole = await prisma.role.findUnique({
    where: { role_name: 'Admin' },
  });

  if (adminRole) {
    const hashedPassword = await bcrypt.hash("123456", 10);
    await prisma.employee.upsert({
      where: { username: 'admin' },
      update: {},
      create: {
        fullname: 'System Administrator',
        username: 'admin',
        password: hashedPassword,
        email: 'admin@example.com',
        phone: '0989987887',
        role_id: adminRole.role_id,
      },
    });
  }

  console.log('Seed data inserted successfully!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('Error seeding data:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
