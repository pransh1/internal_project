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

## 🛠️ Technology Stack

### Backend
- **Framework**: Express.js 
- **Database**: MongoDB 
- **Authentication**: JWT (jsonwebtoken )
- **Password Hashing**: bcryptjs
- **File Upload**: Multer 
- **Cloud Storage**: Cloudinary 
- **Email Service**: Brevo
- **Environment**: Node.js with ES Modules

### Frontend
- **Framework**: Next.js 
- **Styling**: TailwindCSS 
- **HTTP Client**: Axios 
- **Icons**: Lucide React, React Icons
- **UI Components**: Custom components with Tailwind

## 📋 Prerequisites

- **Node.js**: v18+ recommended
- **MongoDB**: Local instance or MongoDB Atlas
- **Cloudinary Account**: For image storage
- **BREVO API KEY**: For sending emails (Gmail, SendGrid, etc.)

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
BREVO_SENDER_NAME=your_name
BREVO_SENDER_EMAIL=your_email@email.com
BREVO_API_KEY=your_api_key

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



