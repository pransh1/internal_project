# Internal Employee Management System

A full-stack web application for managing employee records, built with **Next.js** (frontend) and **Express.js** (backend). This system allows administrators to create, manage, and track employee information with role-based access control.

## 🚀 Features

### Admin Features
- **Authentication System**
  - Secure login with JWT tokens
  - Password reset via email
  - Admin registration
  
- **Employee Management**
  - Create new employees with auto-generated employee IDs (EMP001, EMP002, etc.)
  - Auto-generate secure passwords and email credentials to employees
  - Upload and manage employee profile pictures via Cloudinary
  - Edit employee information
  - Delete employee records
  - View all employees in a sortable table
  
- **Employee Information Tracking**
  - Personal details (name, email, DOB, phone, address)
  - Professional details (role, manager, project assignment)
  - Employment information (type, joining date, employee ID)
  - Profile pictures with avatar fallbacks

### Employee Features
- Login with email and auto-generated password
- View personal profile information
- Access dashboard

## 📁 Project Structure

```
internal_project/
├── backend/                 # Express.js API server
│   ├── constants.js        # Enums for roles, managers, projects, employment types
│   ├── controllers/        # Business logic
│   │   ├── admin.controller.js
│   │   └── user.controller.js
│   ├── db/
│   │   └── connect.js      # MongoDB connection
│   ├── middleware/
│   │   ├── auth.middleware.js    # JWT authentication
│   │   └── upload.middleware.js  # Multer file upload
│   ├── models/
│   │   ├── admin.model.js
│   │   └── user.model.js
│   ├── routes/
│   │   ├── admin.route.js
│   │   └── user.route.js
│   ├── utils/
│   │   ├── cloudinary.js        # Image upload service
│   │   ├── generatePassword.js  # Auto password generation
│   │   └── sendMail.js          # Email service (Nodemailer)
│   ├── package.json
│   └── server.js           # Entry point
│
└── frontend/               # Next.js 16 application
    ├── app/
    │   ├── admin/          # Admin routes
    │   │   ├── dashboard/
    │   │   ├── login/
    │   │   ├── register/
    │   │   ├── reset-password/
    │   │   └── users/      # Employee management UI
    │   ├── globals.css
    │   ├── layout.js
    │   └── page.js         # Root redirects to /admin/login
    ├── components/
    │   ├── AdminHeader.jsx
    │   ├── Sidebar.jsx
    │   └── UserTable.jsx
    ├── utils/
    │   ├── axios.js        # API client configuration
    │   └── constants.js
    └── package.json
```

## 🛠️ Technology Stack

### Backend
- **Framework**: Express.js 5.2.1
- **Database**: MongoDB with Mongoose 9.0.1
- **Authentication**: JWT (jsonwebtoken 9.0.3)
- **Password Hashing**: bcryptjs
- **File Upload**: Multer 2.0.2
- **Cloud Storage**: Cloudinary 2.8.0
- **Email Service**: Nodemailer 7.0.11
- **Environment**: Node.js with ES Modules

### Frontend
- **Framework**: Next.js 16.0.10 (React 19.2.1)
- **Styling**: Tailwind CSS 4
- **HTTP Client**: Axios 1.13.2
- **Icons**: Lucide React, React Icons
- **UI Components**: Custom components with Tailwind

## 📋 Prerequisites

- **Node.js**: v18+ recommended
- **MongoDB**: Local instance or MongoDB Atlas
- **Cloudinary Account**: For image storage
- **SMTP Server**: For sending emails (Gmail, SendGrid, etc.)

## ⚙️ Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd internal_project
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```env
# Server Configuration
PORT=your_port

# Database
MONGO_URI=mongodb://localhost:27017/employee_management
# Or use MongoDB Atlas:
# MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/employee_management

# JWT Secret (use a strong random string)
JWT_SECRET=your_super_secret_jwt_key_here

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email Configuration (Example: Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Frontend URL (for password reset links)
FRONTEND_URL=your_frontend_url
```

Start the backend server:
```bash
npm run dev    # Development with nodemon
# or
npm start      # Production
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` directory:

```env
NEXT_PUBLIC_API_URL=your_frontend_url/api
```

Start the frontend development server:
```bash
npm run dev
```


## 🔒 Security Features

- **Password Security**: Bcrypt hashing with salt rounds
- **JWT Authentication**: Secure token-based authentication (1-day expiry)
- **Protected Routes**: Middleware authentication for admin-only endpoints
- **Password Reset**: Time-limited tokens (10 minutes)
- **CORS Enabled**: Cross-origin resource sharing configured
- **Environment Variables**: Sensitive data stored securely


## 🐛 Troubleshooting

### Backend Issues

**MongoDB Connection Error**
```bash
# Check if MongoDB is running
mongod --version
# Verify connection string in .env
```

**Email Not Sending**
- Verify SMTP credentials
- For Gmail: Enable "Less secure app access" or use App Password
- Check firewall/network settings

**Cloudinary Upload Fails**
- Verify API credentials
- Check Cloudinary dashboard for quota limits

### Frontend Issues

**API Connection Error**
- Ensure backend is running on correct port
- Verify `NEXT_PUBLIC_API_URL` in `.env`
- Check CORS configuration in backend



