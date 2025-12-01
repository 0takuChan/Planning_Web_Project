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

Login
![Login](https://github.com/user-attachments/assets/ed168bf6-ca0a-40c2-aec1-246702b9bed7)

Dashboard
![Dashboard](https://github.com/user-attachments/assets/cc4e5b6d-99ba-41b0-8d4d-ee9f3ef75947)

Customer
![Customer](https://github.com/user-attachments/assets/118011b6-49a0-4768-83ca-da971a4306fe)

job
![Job](https://github.com/user-attachments/assets/efa32a57-1949-49a8-b005-a54ba78cca8d)

Planning
![Planning](https://github.com/user-attachments/assets/8a94729f-b5a7-4946-9dd7-cdb0bea17b86)

Production Log
![Production Log](https://github.com/user-attachments/assets/968141c6-0ab5-4256-83a8-bd69452943d8)

Summary
![Summary](https://github.com/user-attachments/assets/6ca3c458-f9b8-45b9-9fae-4be5073d155d)

Steps
![Step](https://github.com/user-attachments/assets/ab5045e5-a6f3-4484-b686-be036069124b)

Admin
![Admin](https://github.com/user-attachments/assets/a12d3303-1f78-4812-b845-8285352335ff)


