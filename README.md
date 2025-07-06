 # 📝 MERN Task Manager App

A full-featured task management web application built with the **MERN stack** (MongoDB, Express.js, React, Node.js).  
This app allows users to create, update, and organize tasks — with secure login, drag-and-drop, and Google OAuth integration.

App url : https://mern-task-manager-app-main.onrender.com/login


## 🚀 Features

- 🔐 **Authentication**
  - Email & password login using **JWT** (HttpOnly cookie)
  - **Google Sign-in** via Firebase Authentication
- ✅ **Task Management**
  - Create, edit, delete, and view tasks
  - Mark tasks as completed
  - Filter/search tasks
- 📦 **Drag-and-Drop**
  - Rearrange tasks using a smooth drag-and-drop interface
- 💾 **MongoDB Backend**
  - Tasks and users are stored in a MongoDB database
- 🖼️ **Responsive UI**
  - Built using React + TailwindCSS (or your chosen styling framework)

---

## 📸 Screenshots

| Home | Login | Task View |
|------|-------|------------|
| ![Home](./images/home.png) | ![Login](./images/login.png) | ![Task](./images/taskdetails.png) |

---

## 🛠️ Tech Stack

- **Frontend**: React + Axios + React Query
- **Backend**: Node.js + Express + MongoDB (Mongoose)
- **Authentication**: JWT + Firebase (Google OAuth)
- **Deployment**: Render (for backend & frontend)

---

## 🧑‍💻 Getting Started (Local Development)

### 1. Clone the repository


```bash
git clone https://github.com/your-username/mern_task_manager_app.git
cd mern_task_manager_app


# Backend
cd backend
npm run dev

# Frontend
cd ../frontend
npm run dev


PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173


# Backend
cd backend
npm run dev

# Frontend
cd ../frontend
npm run dev


