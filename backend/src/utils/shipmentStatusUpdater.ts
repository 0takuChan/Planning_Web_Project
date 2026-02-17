export const calculateShipmentStatus = (
  departure_date: Date,
  arrival_date: Date
) => {
  const today = new Date();

  if (today < departure_date) {
    return 1; // เตรียมส่ง
  }

  if (today >= departure_date && today < arrival_date) {
    return 2; // กำลังจัดส่ง
  }

  return 3; // ส่งแล้ว
};
