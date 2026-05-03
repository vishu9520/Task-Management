<div align="center">
  <img src="https://raw.githubusercontent.com/tandpfun/skill-icons/main/icons/React-Dark.svg" width="60" alt="React" />
  <img src="https://raw.githubusercontent.com/tandpfun/skill-icons/main/icons/NodeJS-Dark.svg" width="60" alt="Node.js" />
  <img src="https://raw.githubusercontent.com/tandpfun/skill-icons/main/icons/MongoDB.svg" width="60" alt="MongoDB" />
  <img src="https://raw.githubusercontent.com/tandpfun/skill-icons/main/icons/TailwindCSS-Dark.svg" width="60" alt="Tailwind" />

  <h1>🚀 Team Task Manager</h1>
  <p><i>A robust, modern full-stack web application for managing projects, teams, and tasks effortlessly.</i></p>

  <p>
    <a href="#-features">Features</a> •
    <a href="#-tech-stack">Tech Stack</a> •
    <a href="#-architecture--file-structure">Architecture</a> •
    <a href="#-getting-started">Getting Started</a> •
    <a href="#-api-reference">API Reference</a>
  </p>
</div>

---

## ✨ Features

- **🔐 Secure Authentication**: JWT-based login and signup with bcrypt password hashing.
- **👥 Role-Based Access Control (RBAC)**: 
  - **Admin**: Create projects, assign tasks, add members, and oversee the entire workflow. *(Note: To sign up as an Admin, use the default Admin Key: `admin123`)*
  - **Member**: View assigned tasks, update task statuses (Todo ➡️ In Progress ➡️ Completed).
- **📁 Project Management**: Group related tasks under specific projects.
- **📊 Real-time Dashboard**: Dynamic overview of total, completed, pending, and overdue tasks.
- **📱 Responsive UI**: A beautifully crafted interface using **Tailwind CSS v4** that works across devices.

---

## 🛠 Tech Stack

### Frontend
- **React.js (Vite)**: Lightning-fast development and optimized build.
- **Tailwind CSS v4**: Utility-first styling for a premium, custom UI.
- **React Router v7**: Declarative routing for single-page applications.
- **Axios**: HTTP client with request interceptors for automatic JWT token injection.
- **date-fns**: Modern JavaScript date utility library.

### Backend
- **Node.js & Express.js**: Fast, scalable, and lightweight RESTful server.
- **MongoDB & Mongoose**: Flexible NoSQL database with strict schema definitions.
- **JSON Web Tokens (JWT)**: Stateless API authentication.
- **Bcrypt.js**: Secure password encryption.

---

## 🏗 Architecture & File Structure

This project follows a clean **MVC (Model-View-Controller)** architecture on the backend and a modular **Component-based** architecture on the frontend.

```text
E:\Task-Management\
├── backend/                  # ⚙️ Node.js + Express API
│   ├── config/               # Database connection (db.js)
│   ├── controllers/          # Business logic for routes
│   │   ├── authController.js # Handles login/register
│   │   ├── dashboardController.js
│   │   ├── projectController.js
│   │   └── taskController.js
│   ├── middleware/           # Express middlewares
│   │   ├── auth.js           # JWT verification & RBAC
│   │   └── errorHandler.js   # Global error handling
│   ├── models/               # Mongoose schemas (User, Project, Task)
│   ├── routes/               # API endpoint definitions
│   ├── .env                  # Backend environment variables
│   └── server.js             # API Entry point
│
└── frontend/                 # 💻 React.js App
    ├── src/
    │   ├── assets/           # Images & SVGs
    │   ├── components/       # Reusable UI components (e.g., Layout with Sidebar)
    │   ├── context/          # React Context (AuthContext for global user state)
    │   ├── pages/            # View components (Login, Dashboard, Projects, etc.)
    │   ├── utils/            # Utilities (Axios interceptor setup)
    │   ├── App.jsx           # Main routing configuration
    │   └── main.jsx          # React DOM render entry
    ├── index.html            # App HTML template
    └── vite.config.js        # Vite + Tailwind CSS v4 configuration
```

---

## 🚀 Getting Started

Follow these instructions to run the project on your local machine.

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community) installed and running locally on port `27017`.

### 1. Clone the repository
```bash
git clone https://github.com/vishu9520/Task-Management.git
cd Task-Management
```

### 2. Setup the Backend
Open a terminal and navigate to the backend directory:
```bash
cd backend
```
*(Dependencies are already installed, but you can run `npm install` just in case)*

Start the backend development server:
```bash
npx nodemon server.js
```
*The server will run on `http://localhost:5000`.*

### 3. Setup the Frontend
Open a **new** terminal and navigate to the frontend directory:
```bash
cd frontend
```
*(Dependencies are already installed, but you can run `npm install` just in case)*

Start the frontend Vite server:
```bash
npm run dev
```
*The app will be accessible at `http://localhost:5173`.*

---

## 🌐 API Reference

The backend exposes the following RESTful endpoints:

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and receive JWT
- `GET /api/auth/me` - Get current authenticated user

### Projects
- `GET /api/projects` - Get all projects (filtered by role)
- `POST /api/projects` - Create a project (Admin only)
- `GET /api/projects/:id` - Get specific project details
- `PUT /api/projects/:id` - Update a project (Admin only)
- `DELETE /api/projects/:id` - Delete a project (Admin only)

### Tasks
- `GET /api/tasks` - Get all tasks (Admin only)
- `GET /api/tasks/project/:projectId` - Get tasks for a specific project
- `POST /api/tasks` - Create a task (Admin only)
- `PUT /api/tasks/:id` - Update a task (Members can update status, Admin can update all)
- `DELETE /api/tasks/:id` - Delete a task (Admin only)

### Dashboard
- `GET /api/dashboard/stats` - Retrieve aggregate statistics for total, pending, completed, and overdue tasks.

---

> Built with ❤️ for effective team management.
