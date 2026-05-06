# 📦 CargoLink — Freight Matching Platform

CargoLink is a full-stack logistics and freight matching platform that connects **shippers** with **drivers** for efficient cargo transportation. It features a custom backend with secure authentication, role-based access control, and a concurrency-safe load assignment system.

---

## 🚀 Features

### 🔐 Authentication & Authorization
- Secure JWT-based login and registration
- Role-based access control (Shipper / Driver)

### 📦 Load Management (Shipper)
- Create, update, and delete cargo loads
- View load history and status

### 🚚 Driver Workflow
- Browse available loads
- Accept and manage assigned loads
- Complete delivery lifecycle

### 🔄 Load Lifecycle System
- `open → assigned → in_transit → delivered`
- Strict state transition validation

### ⚡ Concurrency-Safe Booking
- Prevents multiple drivers from accepting the same load
- Uses atomic database operations for consistency

### 🔁 Optimized UI Updates
- Powered by React Query for real-time-like UI synchronization

### 🛡️ Robust API Design
- RESTful APIs with validation and error handling
- Secure middleware for protected routes

---

## 🛠️ Tech Stack

### Frontend
- React (TypeScript)
- Tailwind CSS
- React Query

### Backend
- Node.js
- Express.js

### Database
- MongoDB

---

## 🧠 Key Highlights

- Designed a **scalable backend architecture** with clear separation of concerns  
- Implemented **race-condition handling** using atomic database operations  
- Built a **state-driven system** ensuring consistent workflow transitions  
- Developed a **role-based system** for multi-user interaction  

---

## 📁 Project Structure


- /frontend   → React application
- /backend    → Node.js + Express API
- /docs       → Project documentation & development phases