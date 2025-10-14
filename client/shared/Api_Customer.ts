export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  location: string;
  orders: number;
}

export const initialCustomers: Customer[] = [
  { id: "00010234", name: "Michael Johnson", phone: "098-999-5689", email: "michael@gmail.com", location: "New York, USA", orders: 2 },
  { id: "00056789", name: "Emily Davis", phone: "098-2266-554", email: "emily@gmail.com", location: "London, UK", orders: 1 },
];
