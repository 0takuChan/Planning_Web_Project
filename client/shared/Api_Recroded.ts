export interface Row {
  job: string;
  quantity: number;
  step: string;
  recordedDate: string;
  dueDate: string;
  recorder: string;
}

export const init: Row[] = [
  {
    job: "JO-2025-0001",
    quantity: 150,
    step: "Cutting",
    recordedDate: "08/05/2025",
    dueDate: "09/18/2025",
    recorder: "tester 007",
  },
  {
    job: "JO-2025-0012",
    quantity: 250,
    step: "QC",
    recordedDate: "08/13/2025",
    dueDate: "09/20/2025",
    recorder: "tester 002",
  },
];