export interface Row {
  customer: string;
  job: string;
  quantity: number;
  date: string;
  cutting: boolean;
  heating: boolean;
  embroidering: boolean;
  sewing: boolean;
  qc: boolean;
  pack: boolean;
  fabric: string;
}
export const init: Row[] = [
  {
    customer: "Michael Johnson",
    job: "JO-2025-0001",
    quantity: 500,
    date: "9/20/2025",
    cutting: true,
    heating: true,
    embroidering: true,
    sewing: true,
    qc: true,
    pack: true,
    fabric: "cotton",
  },
  {
    customer: "Sophia Brown",
    job: "JO-2025-0012",
    quantity: 300,
    date: "9/21/2025",
    cutting: true,
    heating: true,
    embroidering: false,
    sewing: false,
    qc: false,
    pack: false,
    fabric: "polyester",
  },
  {
    customer: "Sophia Brown",
    job: "JO-2025-0112",
    quantity: 300,
    date: "9/21/2025",
    cutting: true,
    heating: true,
    embroidering: false,
    sewing: false,
    qc: false,
    pack: false,
    fabric: "polyester",
  },
];