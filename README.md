# Authentication System with Role-Based Authorization

Complete authentication system using Node.js, Express, MongoDB, JWT, and bcrypt with ES Modules.

## Features
- ✅ User Registration (Sign Up)
- ✅ User Sign In
- ✅ User Profile (View & Update)
- ✅ Role-Based Authorization (User & Admin)
- ✅ Password Encryption with bcrypt
- ✅ JWT Authentication
- ✅ Protected Routes
- ✅ Admin-Only Routes
- ✅ Image Upload with Cloudinary
- ✅ Avatar Management
- ✅ Forgot Password with Email
- ✅ Password Reset with 5-Digit Code

## Project Structure
```
├── config/
│   └── db.js                    # MongoDB configuration
├── modules/
│   ├── auth/
│   │   ├── auth.controller.js   # Authentication logic
│   │   └── auth.routes.js       # Auth routes
│   └── user/
│       ├── user.model.js        # User model
│       ├── user.controller.js   # User management logic
│       └── user.routes.js       # User routes
├── middleware/
│   └── auth.js                  # Auth & Authorization middleware
├── utils/
│   └── generateToken.js         # JWT token generator
├── .env                         # Environment variables
├── server.js                    # Entry point
└── package.json
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Update `.env` file with your MongoDB connection string

3. Run the server:
```bash
npm start
# or for development
npm run dev
```

## API Endpoints

### 1. Register New User
```
POST /api/auth/signup
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "123456"
}
```
Note: Role is automatically set to "user"

### 2. Sign In
```
POST /api/auth/signin
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "123456"
}
```

### 3. Forgot Password
```
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "john@example.com"
}
```

### 4. Verify Reset Code (Optional)
```
POST /api/auth/verify-code
Content-Type: application/json

{
  "email": "john@example.com",
  "code": "12345"
}
```

### 5. Reset Password
```
POST /api/auth/reset-password
Content-Type: application/json

{
  "email": "john@example.com",
  "code": "12345",
  "newPassword": "newpassword123"
}
```

### 6. Get User Profile (requires token)
```
GET /api/user/profile
Authorization: Bearer YOUR_JWT_TOKEN
```

### 7. Update Profile (requires token)
```
PUT /api/user/profile
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Smith"
}
```
Note: For text fields only

### 8. Upload Avatar Image (requires token)
```
POST /api/user/upload-avatar
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: multipart/form-data

Form Data:
- avatar: [image file]
```
Note: Use form-data in Postman, select File type

### 9. Get All Users (Admin only)
```
GET /api/user/all
Authorization: Bearer ADMIN_JWT_TOKEN
```

### 10. Delete User (Admin only)
```
DELETE /api/user/:id
Authorization: Bearer ADMIN_JWT_TOKEN
```

### 8. Upload Avatar Image
```
POST /api/user/upload-avatar
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: multipart/form-data

Form Data:
- avatar: [image file]
```

## Cloudinary Configuration

1. Create a free account at https://cloudinary.com/
2. Get your credentials from the Dashboard
3. Add to `.env` file:
```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Installation

```bash
npm install
```

This will install all dependencies including:
- cloudinary (for image storage)
- multer (for file upload handling)

## User Roles
- `user` - Default role with basic access
- `admin` - Full access including user management

## Notes
- Make sure MongoDB is running before starting the server
- Change `JWT_SECRET` in `.env` to a secure key in production
- Password must be at least 6 characters
- All new users are automatically assigned the `user` role
- Admin role must be set manually in the database
- Admin routes are protected and require admin role
