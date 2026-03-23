// Mock Data for Transportation

export interface Customer {
  customer_id: number;
  customer_code: string;
  fullname: string;
  email: string;
  phone: string;
  address_detail: string;
}

export interface ShipmentHistoryEntry {
  timestamp: string;
  action: string;
  field: 'pending_date' | 'shipping_date' | 'delivery_date' | 'status';
  old_value: string | null;
  new_value: string | null;
}

export interface Product {
  product_id: number;
  product_name: string;
  sku: string;
  description: string;
}

export interface Shipment {
  shipment_id: string;
  customer_id: number;
  customer: Customer;
  product_id: number;
  product: Product;
  quantity_boxes: number;
  total_weight: number;
  transportation_method: 'truck' | 'van' | 'airplane' | 'ship'; // ประเภทการส่ง
  pending_date: string | null; // วันที่เริ่มสถานะรอจัดส่ง
  shipping_date: string | null; // วันที่เริ่มจัดส่ง (เริ่มสถานะกำลังจัดส่ง)
  delivery_date: string | null; // วันที่ส่งถึง (เริ่มสถานะจัดส่งแล้ว)
  delivery_deadline: string; // วันที่ต้องส่งถึง (Deadline)
  status: 'pending' | 'in-transit' | 'delivered';
  history: ShipmentHistoryEntry[]; // ประวัติการแก้ไข
  created_at: string;
}

// Mock Customers Data
export const mockCustomers: Customer[] = [
  {
    customer_id: 1,
    customer_code: "CM-000-0001",
    fullname: "บริษัท เอบีซี จำกัด",
    email: "contact@abc.co.th",
    phone: "0812345678",
    address_detail: "123 ถนนสุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพมหานคร 10110"
  },
  {
    customer_id: 2,
    customer_code: "CM-000-0002",
    fullname: "ห้างหุ้นส่วน ดีอีเอฟ",
    email: "info@def.com",
    phone: "0823456789",
    address_detail: "456 ถนนพระราม 4 แขวงปทุมวัน เขตปทุมวัน กรุงเทพมหานคร 10330"
  },
  {
    customer_id: 3,
    customer_code: "CM-000-0003",
    fullname: "บริษัท จีเอชไอ อินดัสทรี จำกัด",
    email: "sales@ghi-industry.co.th",
    phone: "0834567890",
    address_detail: "789 ถนนพัทยาเหนือ ตำบลนาเกลือ อำเภอบางละมุง จังหวัดชลบุรี 20150"
  },
  {
    customer_id: 4,
    customer_code: "CM-000-0004",
    fullname: "ร้าน เจเคแอล เทรดดิ้ง",
    email: "jkl.trading@gmail.com",
    phone: "0845678901",
    address_detail: "321 หมู่ 5 ตำบลบ้านใหม่ อำเภอปากเกร็ด จังหวัดนนทบุรี 11120"
  },
  {
    customer_id: 5,
    customer_code: "CM-000-0005",
    fullname: "บริษัท เอ็มเอ็นโอ โซลูชั่น จำกัด",
    email: "hello@mno-solution.com",
    phone: "0856789012",
    address_detail: "654 ถนนเพชรบุรี แขวงมักกะสัน เขตราชเทวี กรุงเทพมหานคร 10400"
  }
];

// Mock Products Data
export const mockProducts: Product[] = [
  {
    product_id: 1,
    product_name: "เสื้อโปโล Cotton 100%",
    sku: "POLO-001",
    description: "เสื้อโปโลคุณภาพดี ผ้าฝ้าย 100%"
  },
  {
    product_id: 2,
    product_name: "เสื้อยืดคอกลม Premium",
    sku: "TSHIRT-002",
    description: "เสื้อยืดคอกลมเนื้อผ้าพรีเมียม"
  },
  {
    product_id: 3,
    product_name: "กางเกงขายาว Chino",
    sku: "PANT-003",
    description: "กางเกงขายาวสไตล์ชิโน ทรงสวย"
  },
  {
    product_id: 4,
    product_name: "แจ็คเก็ตกันหนาว Fleece",
    sku: "JACKET-004",
    description: "แจ็คเก็ตกันหนาวผ้าฟลีซอบอุ่น"
  },
  {
    product_id: 5,
    product_name: "เสื้อเชิ้ตแขนยาว Business",
    sku: "SHIRT-005",
    description: "เสื้อเชิ้ตแขนยาวสำหรับทำงาน"
  }
];

// Mock Shipments Data
export const mockShipments: Shipment[] = [
  {
    shipment_id: "SH-2026-0001",
    customer_id: 1,
    customer: mockCustomers[0],
    product_id: 1,
    product: mockProducts[0],
    quantity_boxes: 50,
    total_weight: 125.5,
    transportation_method: 'truck',
    pending_date: null,
    shipping_date: null,
    delivery_date: null,
    delivery_deadline: "2026-02-10",
    status: "pending",
    history: [],
    created_at: "2026-02-04T10:30:00Z"
  },
  {
    shipment_id: "SH-2026-0002",
    customer_id: 2,
    customer: mockCustomers[1],
    product_id: 3,
    product: mockProducts[2],
    quantity_boxes: 30,
    total_weight: 85.0,
    transportation_method: 'van',
    pending_date: "2026-02-01",
    shipping_date: "2026-02-03",
    delivery_date: null,
    delivery_deadline: "2026-02-12",
    status: "in-transit",
    history: [
      {
        timestamp: "2026-02-01T09:00:00Z",
        action: "กำหนดวันที่เริ่มรอจัดส่ง",
        field: "pending_date",
        old_value: null,
        new_value: "2026-02-01"
      },
      {
        timestamp: "2026-02-03T14:20:00Z",
        action: "กำหนดวันที่เริ่มจัดส่ง",
        field: "shipping_date",
        old_value: null,
        new_value: "2026-02-03"
      }
    ],
    created_at: "2026-02-03T14:20:00Z"
  },
  {
    shipment_id: "SH-2026-0003",
    customer_id: 3,
    customer: mockCustomers[2],
    product_id: 2,
    product: mockProducts[1],
    quantity_boxes: 100,
    total_weight: 180.75,
    transportation_method: 'airplane',
    pending_date: "2026-01-30",
    shipping_date: "2026-02-01",
    delivery_date: "2026-02-03",
    delivery_deadline: "2026-02-08",
    status: "delivered",
    history: [
      {
        timestamp: "2026-01-30T08:00:00Z",
        action: "กำหนดวันที่เริ่มรอจัดส่ง",
        field: "pending_date",
        old_value: null,
        new_value: "2026-01-30"
      },
      {
        timestamp: "2026-02-01T09:15:00Z",
        action: "กำหนดวันที่เริ่มจัดส่ง",
        field: "shipping_date",
        old_value: null,
        new_value: "2026-02-01"
      },
      {
        timestamp: "2026-02-03T16:30:00Z",
        action: "กำหนดวันที่ส่งถึง",
        field: "delivery_date",
        old_value: null,
        new_value: "2026-02-03"
      }
    ],
    created_at: "2026-02-01T09:15:00Z"
  }
];

// Helper function to generate random Shipment ID
export function generateShipmentId(): string {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(Math.random() * 9999) + 1;
  return `SH-${year}-${randomNum.toString().padStart(4, '0')}`;
}

// Helper function to calculate shipment status based on dates
export function calculateShipmentStatus(
  pendingDate: string | null,
  shippingDate: string | null,
  deliveryDate: string | null
): 'pending' | 'in-transit' | 'delivered' {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // ถ้ามีวันที่ส่งถึงแล้ว และวันนี้ >= วันที่ส่งถึง
  if (deliveryDate) {
    const delivDate = new Date(deliveryDate);
    delivDate.setHours(0, 0, 0, 0);
    if (today >= delivDate) {
      return 'delivered';
    }
  }
  
  // ถ้ามีวันที่เริ่มจัดส่งแล้ว และวันนี้ >= วันที่เริ่มจัดส่ง
  if (shippingDate) {
    const shipDate = new Date(shippingDate);
    shipDate.setHours(0, 0, 0, 0);
    if (today >= shipDate) {
      return 'in-transit';
    }
  }
  
  // ค่าเริ่มต้นคือ pending
  return 'pending';
}
