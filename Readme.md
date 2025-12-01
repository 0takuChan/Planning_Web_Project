# Planning Web Project

ระบบวางแผนการผลิตและจัดการงาน (Production Planning & Management System)

## โครงสร้างโปรเจกต์

- **Backend/**: ระบบฝั่งเซิร์ฟเวอร์ (Node.js, TypeScript, Prisma, Express)
- **Frontend/**: ระบบฝั่งผู้ใช้ (React, TypeScript, Vite, TailwindCSS)

### Backend

1. ติดตั้ง dependencies:
    ```powershell
    cd Backend
    npm install
    ```
2. ตั้งค่าฐานข้อมูล (ใช้ Prisma):
    ```powershell
    npx prisma migrate deploy
    npx prisma db seed
    ```
3. เริ่มเซิร์ฟเวอร์:
    ```powershell
    npm run dev
    ```

### Frontend

1. ติดตั้ง dependencies:
    ```powershell
    cd Frontend
    npm install
    ```
2. เริ่มเซิร์ฟเวอร์:
    ```powershell
    npm run dev
    ```

## การใช้งาน

- เข้าถึงระบบผ่านเบราว์เซอร์ที่ `http://localhost:5173` (Frontend)
- API backend เริ่มต้นที่ `http://localhost:3000`

## เทคโนโลยีที่ใช้

- **Backend**: Node.js, Express, TypeScript, Prisma, Docker
- **Frontend**: React, Vite, TailwindCSS


Interface

