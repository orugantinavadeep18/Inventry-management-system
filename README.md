# 🛒 Inventory Management System

A full-stack **Inventory Management Web Application** designed to bridge the gap between **product retailers** and **customers**, ensuring smooth stock management, order tracking, and notification updates in real time.

---

## 📌 Overview

This system helps **retailers** manage their products, stocks, suppliers, and notifications effectively. It also allows **customers** to place orders and view product availability. The platform supports **role-based access** for Admin and Staff with live updates and real-time inventory control.

---

## 🚀 Features

### 🔐 User Roles
- **Admin**
  - Full access to dashboard
  - Manage staff, products, categories, suppliers, orders
  - View stock insights and analytics
- **Staff**
  - Limited access to add/view products and stock
  - Receive real-time notifications

### 📦 Product Management
- Add, update, and delete products
- Assign categories and suppliers to products
- Upload and display product images

### 🧾 Order Handling
- Place product orders
- Automatically reduce stock upon purchase
- Prevent orders when stock is insufficient

### 🔔 Notification System
- Unread notifications shown on dashboard
- Real-time stock and order alerts
- Mark notifications as read

### 📊 Dashboard & Analytics
- View total products, orders, stock level
- Pie chart / bar chart visualizations of stock distribution
- Sort and filter inventory by categories or suppliers

### 🔄 Live Updates
- Socket.io-powered real-time updates across users (admin/staff)
- Instant changes without refreshing

### 📁 Category & Supplier Management
- Add/Edit/Delete categories and suppliers dynamically
- Relational mapping with products

---

## 🛠️ Tech Stack

| Frontend | Backend  | Database |
|----------|----------|----------|
| React.js (Tailwind CSS) | Node.js (Express) | MongoDB |

Other Tools:
- Axios
- Socket.io
- JWT Authentication
- Render for deployment

---

## 🧪 Installation

1. **Clone the repo**  
```bash
git clone https://github.com/orugantinavadeep18/Inventry-management-system.git
cd Inventry-management-system
