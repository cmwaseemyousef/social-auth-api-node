# Instagram Node API

This is a RESTful API built with **Node.js**, **Express**, **MongoDB**, and **Socket.IO**. It demonstrates user and admin role separation, email verification, WebSocket messaging, Swagger documentation, validation, logging, and rate-limiting.

## 🌐 Features

- **Users:**
  - Signup with: First Name, Last Name, Email, Country, Password
  - Email verification using OTP
  - Send private message to other users via WebSocket
  - Join, send, and leave group messages via WebSocket

- **Admins:**
  - Cannot signup via endpoint
  - Default admin seeded from database
  - Admins can add other admins

- **Shared:**
  - Server-side validation on all endpoints
  - Swagger documentation:
    - `/api/docs/user`
    - `/api/docs/admin`
  - Logging with **Winston** & daily rotate
  - Rate limiting on all endpoints

## 🧪 Technologies Used

- Express.js
- MongoDB Atlas
- Mongoose
- Nodemailer (email)
- Socket.IO (real-time messaging)
- Swagger (API docs)
- Joi (validation)
- Winston (logging)
- Express-rate-limit

## 📦 Installation

```bash
git clone https://github.com/cmwaseemyousef/social-auth-api-node.git
cd social-auth-api-node
npm install
```

## ⚙️ Setup

Create a `.env` file in the root directory with the following:

```env
PORT=5000
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email_address
EMAIL_PASS=your_email_password
```

Then run:

```bash
npm run dev
```

## 🧪 Swagger Docs

- [User Docs](http://localhost:5000/api/docs/user)
- [Admin Docs](http://localhost:5000/api/docs/admin)

## 🧠 Admin Seeder

Run the following to seed the default admin:

```bash
node seeders/createAdmin.js
```

## 💬 WebSocket Instructions

- Users connect via client socket to server
- Can send direct messages or group messages
- Server handles real-time events with Socket.IO

## 📸 Demo

Two walkthrough videos available:

- [Loom Video 1 (Setup & Features)](https://www.loom.com/share/e0747d88f7dc4aa78f687f8a681b1bc3?sid=e4d7aeb1-1a8c-4215-b429-18caa38b4283)
- [Loom Video 2 (WebSocket & Swagger)](https://www.loom.com/share/bc80c758ecd64e9ba6710d256655b212?sid=82fe015d-d08e-436a-8d0a-bb4d540027fa)

## 📬 Contact

**Name:** Waseem Ibn Yousef C M  
**Email:** cmwaseemyousef@gmail.com  
**Microsoft Teams:** [Chat Link](https://teams.microsoft.com/l/chat/0/0?users=outlook_606CF3D24E12C822@outlook.com)

---

> This project was built as part of a backend technical task for SirPaulElliott – Instagram NodeJS Job (May 2025).