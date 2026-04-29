# Deploy Guide

ใช้ชุดนี้สำหรับ deploy แบบฟรี:

- Frontend: Netlify
- Backend: Render
- Database: Supabase Postgres

## 1. Supabase

1. สร้างโปรเจกต์ใหม่ใน Supabase
2. ไปที่ `Project Settings > Database`
3. คัดลอกค่า connection string สองแบบ:
	- Session pooler หรือ pooler URI สำหรับ `DATABASE_URL`
	- Direct connection URI สำหรับ `DIRECT_URL`
4. ใส่ password จริงแทน `[YOUR-PASSWORD]`
5. ถ้า URI ยังไม่มี ให้เติม `?sslmode=require`

## 2. Render Backend

ใช้ไฟล์ [render.yaml](render.yaml) ที่ root ของ repo ได้เลย หรือสร้าง service ผ่านหน้าเว็บ Render โดยตั้งค่าแบบนี้:

- Root Directory: `Backend`
- Build Command: `npm install && npx prisma generate && npm run build`
- Start Command: `npx prisma migrate deploy && npm run start`

Environment Variables ที่ต้องตั้ง:

- `DATABASE_URL` = Session pooler URI จาก Supabase
- `DIRECT_URL` = Direct connection URI จาก Supabase
- `CORS_ORIGIN` = URL ของ frontend บน Netlify เช่น `https://your-site.netlify.app`
- `JWT_SECRET` = ค่า secret สำหรับระบบ login
- `GEMINI_API_KEY` = ใส่เมื่อใช้ AI planning ผ่าน Gemini
- `GROQ_API_KEY` = ใส่เมื่อใช้ AI planning ผ่าน Groq

หมายเหตุ:

- `DATABASE_URL` ใช้สำหรับ runtime ปกติบน Render
- `DIRECT_URL` ใช้โดย Prisma สำหรับ `prisma migrate deploy`
- ถ้าใช้ direct URL แบบ `db.<project>.supabase.co:5432` แล้ว Render ต่อไม่ได้ ให้เช็กว่าเลือก direct URI ที่รองรับจาก Supabase และมี `sslmode=require`

หลัง deploy สำเร็จ ให้จด backend URL เช่น:

`https://your-backend.onrender.com`

Seed data:

- Render config ตอนนี้รัน `npx prisma db seed` ให้อัตโนมัติหลัง `prisma migrate deploy`
- ถ้าต้องการรันเองใน local ใช้ `npm run seed`
- seed ปัจจุบันใน [Backend/prisma/seed.ts](Backend/prisma/seed.ts) ใช้ `upsert` และ `skipDuplicates` เป็นหลัก จึงเหมาะกับการรันซ้ำ

## 3. Netlify Frontend

โปรเจกต์ frontend ใช้ [Frontend/netlify.toml](Frontend/netlify.toml)

ตั้งค่าบน Netlify:

- Base directory: `Frontend`
- Build command: `npm run build`
- Publish directory: `dist/spa`

Environment Variable ที่ต้องตั้ง:

- `VITE_API_BASE_URL` = `https://your-backend.onrender.com/api`

Netlify config มี SPA redirect แล้ว จึงเปิด route ตรง ๆ ได้

## 4. Local Env

สร้างไฟล์ตามตัวอย่างนี้:

- Frontend: [Frontend/.env.example](Frontend/.env.example)
- Backend: [Backend/.env.example](Backend/.env.example)

ค่าที่ควรใช้ตอน local:

- Frontend `VITE_API_BASE_URL=http://localhost:4000/api`
- Backend `CORS_ORIGIN=http://localhost:5173,http://localhost:8080`
- Backend `DIRECT_URL` ใช้ค่าเดียวกับ `DATABASE_URL` ได้ใน local ถ้าใช้ Postgres เครื่องตัวเอง

## 5. Post-deploy Checklist

1. เปิดเว็บ Netlify และลอง login
2. เช็กว่าเรียก API ได้จริงจากโดเมน Render
3. เช็ก CRUD หลัก: customer, job, planning, shipment
4. ถ้า CORS พัง ให้ตรวจ `CORS_ORIGIN` บน Render ว่าตรงกับโดเมน Netlify จริง
5. ถ้า database ใช้งานไม่ได้ ให้ตรวจ `DATABASE_URL`, `DIRECT_URL` และ log ของ `prisma migrate deploy`
