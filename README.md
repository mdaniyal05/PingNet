# 💬 PingNet Messenger

A Full Stack real time messaging application that enables seamless communication between users. Connect with friends, share media, and stay updated with real time notifications. All through an intuitive chat interface.

## 🚀 Features

- 🔐 Authentication & Authorization – Secure register/login with JWT access & refresh tokens (HTTP-only cookies)
- 🔐 OTP Email Verification – Secure verification flow powered by Brevo
- 👥 Friends System – Send, accept, and remove friend requests
- 💬 Real-Time Messaging – Instant one-on-one communication powered by Socket.IO
- 🔔 Live Notifications – Real-time alerts for messages and friend requests
- ✍️ Typing Indicators – See when your friends are typing
- 🟢 Online Status – Track who's currently active
- 😊 Emoji Support – Express yourself with emojis in messages
- 📸 Media Sharing – Upload and share images and videos via Cloudinary
- 🔍 User Search – Find and connect with other users
- 🎨 Modern UI – Beautiful interface built with Shadcn UI and Tailwind CSS

## 🛠️ Tech Stack

### Frontend

- ⚛️ React 19 (Vite + TypeScript)
- 🎨 Tailwind CSS + Shadcn UI
- 🔄 Redux Toolkit (state management)
- 🌐 React Router v7
- 🔌 Socket.IO Client (real-time communication)

### Backend

- 🟢 Node.js + Express.js
- 🍃 MongoDB + Mongoose ODM
- 🔌 Socket.IO (WebSocket server)
- 🔑 JWT (with HTTP-only cookies)
- 📧 Brevo (email service)
- 🔐 bcryptjs (password hashing)
- ☁️ Cloudinary (media storage)
- 📦 Multer (file uploads)

### Dev Tools

Nodemon, ESLint, Prettier, TypeScript

## 🌐 Deployment

- Frontend: Deployed on Vercel
- Backend: Deployed on Render
- Database: MongoDB Atlas
- Media Storage: Cloudinary
- Mailing Service: Brevo
