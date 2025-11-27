export interface PlanningRecord {
  jobId: string;
  date: string; // yyyy-MM-dd
  qty: number;
  step: string;
}

export const planningApi: PlanningRecord[] = [];

export const jobRows = [
  // Example data structure; adjust fields as needed
  {
    job: "JOB-001",
    quantity: 100,
    date: "09/15/2025",
    cutting: true,
    heating: true,
    embroidering: true,
    sewing: true,
    qc: true,
    pack: true,
  },
  // Add more jobs as needed
];