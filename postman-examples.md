# Postman API Examples

## Base URL
```
http://localhost:5000
```

---

## 1. Sign Up (Register New User)

### Endpoint
```
POST /api/auth/signup
```

### Headers
```
Content-Type: application/json
```

### Body (JSON)
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "password": "123456"
}
```

**Note:** Role is automatically set to "user" and cannot be changed during signup.

### Response (201 Created)
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "65f1a2b3c4d5e6f7g8h9i0j1",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "avatar": "",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

## 2. Sign In (Login)

### Endpoint
```
POST /api/auth/signin
```

### Headers
```
Content-Type: application/json
```

### Body (JSON)
```json
{
  "email": "john.doe@example.com",
  "password": "123456"
}
```

### Response (200 OK)
```json
{
  "success": true,
  "message": "Signed in successfully",
  "data": {
    "user": {
      "id": "65f1a2b3c4d5e6f7g8h9i0j1",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "avatar": "",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

## 3. Get User Profile (Protected Route)

### Endpoint
```
GET /api/user/profile
```

### Headers
```
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "id": "65f1a2b3c4d5e6f7g8h9i0j1",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "avatar": "https://res.cloudinary.com/dxvynre0v/image/upload/v1234567890/avatars/user123.jpg",
    "role": "user",
    "createdAt": "2024-03-15T10:30:00.000Z"
  }
}
```

**Note:** 
- If user has uploaded an avatar, `avatar` will contain the Cloudinary URL
- If no avatar uploaded yet, `avatar` will be an empty string `""`

---

## 4. Update User Profile (Protected Route)

### Endpoint
```
PUT /api/user/profile
```

### Headers
```
Authorization: Bearer YOUR_JWT_TOKEN_HERE
Content-Type: application/json
```

### Body (JSON)
```json
{
  "firstName": "John",
  "lastName": "Smith"
}
```

**Note:** This endpoint is for updating text fields only (firstName, lastName). To upload avatar image, use the dedicated endpoint below.

### Response (200 OK)
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": "65f1a2b3c4d5e6f7g8h9i0j1",
    "firstName": "John",
    "lastName": "Smith",
    "email": "john.doe@example.com",
    "avatar": "https://res.cloudinary.com/dxvynre0v/image/upload/v1234567890/avatars/user123.jpg",
    "role": "user"
  }
}
```

---

## 5. Upload Avatar Image (Protected Route)

**Important:** This is a separate endpoint specifically for uploading images. Use form-data, NOT JSON!

### Endpoint
```
POST /api/user/upload-avatar
```

### Headers
```
Authorization: Bearer YOUR_JWT_TOKEN_HERE
Content-Type: multipart/form-data (automatically set by Postman)
```

### Body (form-data)
```
Key: avatar
Type: File
Value: [Select your image file]
```

**Important Notes:**
- Use `form-data` in Postman, NOT `raw` or `JSON`
- Key name must be exactly `avatar`
- File type must be an image (jpg, png, gif, etc.)
- Maximum file size: 5MB
- Image will be automatically resized to 500x500px

### Response (200 OK)
```json
{
  "success": true,
  "message": "Avatar uploaded successfully",
  "data": {
    "avatar": "https://res.cloudinary.com/dxvynre0v/image/upload/v1234567890/avatars/abc123.jpg"
  }
}
```

### How to Test in Postman:
1. Select `POST` method
2. Enter URL: `http://localhost:5000/api/user/upload-avatar`
3. Go to "Authorization" tab → Select "Bearer Token" → Paste your JWT token
4. Go to "Body" tab → Select "form-data"
5. Add a new key called `avatar`
6. Change the type from "Text" to "File" (dropdown on the right)
7. Click "Select Files" and choose your image
8. Click "Send"

---

## 6. Get All Users (Admin Only)

### Endpoint
```
GET /api/user/all
```

### Headers
```
Authorization: Bearer ADMIN_JWT_TOKEN_HERE
```

### Response (200 OK)
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "65f1a2b3c4d5e6f7g8h9i0j1",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "avatar": "",
      "role": "user",
      "createdAt": "2024-03-15T10:30:00.000Z"
    },
    {
      "_id": "65f1a2b3c4d5e6f7g8h9i0j2",
      "firstName": "Admin",
      "lastName": "User",
      "email": "admin@example.com",
      "avatar": "",
      "role": "admin",
      "createdAt": "2024-03-15T11:00:00.000Z"
    }
  ]
}
```

---

## 7. Delete User (Admin Only)

### Endpoint
```
DELETE /api/user/:id
```

Example:
```
DELETE /api/user/65f1a2b3c4d5e6f7g8h9i0j1
```

### Headers
```
Authorization: Bearer ADMIN_JWT_TOKEN_HERE
```

### Response (200 OK)
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Email already in use"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "User role 'user' is not authorized to access this route"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "User not found"
}
```

---

## How to Use in Postman

1. **Create a new Collection** called "Auth API"

2. **Add requests** for each endpoint above

3. **For Sign Up/Sign In:**
   - Copy the token from the response
   - Save it for use in protected routes

4. **For Protected Routes:**
   - Go to the "Authorization" tab
   - Select "Bearer Token"
   - Paste your JWT token

5. **Environment Variables (Optional):**
   - Create variable `baseUrl` = `http://localhost:5000`
   - Create variable `token` = (paste your token here)
   - Use `{{baseUrl}}` and `{{token}}` in your requests


---

## 8. Cloudinary Setup

### 1. Create Cloudinary Account
- Go to https://cloudinary.com/
- Sign up for a free account
- Go to Dashboard

### 2. Get Your Credentials
From your Cloudinary Dashboard, copy:
- Cloud Name
- API Key
- API Secret

### 3. Update .env File
```env
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

### 4. Install Dependencies
```bash
npm install
```

The uploaded images will be stored in the `avatars` folder in your Cloudinary account.


---

## 9. Forgot Password (Request Reset Code)

### Endpoint
```
POST /api/auth/forgot-password
```

### Headers
```
Content-Type: application/json
```

### Body (JSON)
```json
{
  "email": "john.doe@example.com"
}
```

### Response (200 OK)
```json
{
  "success": true,
  "message": "Reset code sent to your email"
}
```

**Note:** A 5-digit code will be sent to the user's email. The code expires in 10 minutes.

---

## 10. Verify Reset Code (Optional)

### Endpoint
```
POST /api/auth/verify-code
```

### Headers
```
Content-Type: application/json
```

### Body (JSON)
```json
{
  "email": "john.doe@example.com",
  "code": "12345"
}
```

### Response (200 OK)
```json
{
  "success": true,
  "message": "Code verified successfully"
}
```

**Note:** This step is optional. You can directly use the reset-password endpoint.

---

## 11. Reset Password

### Endpoint
```
POST /api/auth/reset-password
```

### Headers
```
Content-Type: application/json
```

### Body (JSON)
```json
{
  "email": "john.doe@example.com",
  "code": "12345",
  "newPassword": "newpassword123"
}
```

### Response (200 OK)
```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

**Note:** After successful reset, the user can sign in with the new password.

---

## Email Configuration (Gmail)

### 1. Enable 2-Factor Authentication
- Go to your Google Account settings
- Security → 2-Step Verification → Turn it on

### 2. Generate App Password
- Go to: https://myaccount.google.com/apppasswords
- Select "Mail" and your device
- Click "Generate"
- Copy the 16-character password

### 3. Update .env File
```env
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_16_character_app_password
```

**Important:** 
- Use App Password, NOT your regular Gmail password
- Remove spaces from the app password
- Keep this information secure

---

## Password Reset Flow

1. **User requests reset:**
   - POST `/api/auth/forgot-password` with email
   - System sends 5-digit code to email

2. **User receives email:**
   - Email contains 5-digit code
   - Code expires in 10 minutes

3. **(Optional) Verify code:**
   - POST `/api/auth/verify-code` with email and code
   - Confirms code is valid

4. **User resets password:**
   - POST `/api/auth/reset-password` with email, code, and new password
   - Password is updated

5. **User signs in:**
   - POST `/api/auth/signin` with email and new password
