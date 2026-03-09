# Admin System Guide

Complete guide for Admin authentication and management.

---

## Admin vs User

### User System
- **Endpoint:** `POST /api/auth/signin`
- **Model:** User
- **Role:** `user`
- **Can:** View books, categories, search

### Admin System
- **Endpoint:** `POST /api/admin/signin`
- **Model:** Admin (separate collection)
- **Role:** `admin`
- **Can:** Everything users can + Create/Update/Delete books and categories

---

## Admin Endpoints

### 1. Admin Sign In

```
POST /api/admin/signin
Content-Type: application/json
```

**Body:**
```json
{
  "email": "admin@example.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Admin signed in successfully",
  "data": {
    "admin": {
      "id": "65f1a2b3c4d5e6f7g8h9i0j1",
      "firstName": "Admin",
      "lastName": "User",
      "email": "admin@example.com",
      "avatar": "",
      "role": "admin"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 2. Get Admin Profile

```
GET /api/admin/profile
Authorization: Bearer ADMIN_TOKEN
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "65f1a2b3c4d5e6f7g8h9i0j1",
    "firstName": "Admin",
    "lastName": "User",
    "email": "admin@example.com",
    "avatar": "",
    "role": "admin",
    "createdAt": "2024-03-15T10:30:00.000Z"
  }
}
```

---

### 3. Update Admin Profile

```
PUT /api/admin/profile
Authorization: Bearer ADMIN_TOKEN
Content-Type: application/json
```

**Body:**
```json
{
  "firstName": "Super",
  "lastName": "Admin"
}
```

---

### 4. Upload Admin Avatar

```
POST /api/admin/upload-avatar
Authorization: Bearer ADMIN_TOKEN
Content-Type: multipart/form-data
```

**Form Data:**
- avatar: [image file]

---

## Creating First Admin

You need to create the first admin manually in MongoDB:

### Option 1: Using MongoDB Compass

1. Open MongoDB Compass
2. Connect to your database
3. Go to `admins` collection
4. Click "Add Data" → "Insert Document"
5. Paste this:

```json
{
  "firstName": "Admin",
  "lastName": "User",
  "email": "admin@example.com",
  "password": "$2a$10$YourHashedPasswordHere",
  "avatar": "",
  "createdAt": { "$date": "2024-03-15T10:00:00.000Z" }
}
```

**Note:** Password must be hashed with bcrypt. Use this Node.js script:

```javascript
import bcrypt from 'bcryptjs';

const password = 'admin123';
const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash(password, salt);
console.log(hashedPassword);
```

---

### Option 2: Using MongoDB Shell

```javascript
use alkotop

db.admins.insertOne({
  firstName: "Admin",
  lastName: "User",
  email: "admin@example.com",
  password: "$2a$10$YourHashedPasswordHere",
  avatar: "",
  createdAt: new Date()
})
```

---

### Option 3: Create Admin Script

Create a file `scripts/createAdmin.js`:

```javascript
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Admin from '../modules/admin/admin.model.js';

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const admin = await Admin.create({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@example.com',
      password: 'admin123'
    });

    console.log('Admin created successfully:', admin.email);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

createAdmin();
```

Run it:
```bash
node scripts/createAdmin.js
```

---

## Admin Workflow

### Step 1: Create Admin (One Time)
Use one of the methods above to create the first admin.

### Step 2: Sign In as Admin
```
POST /api/admin/signin

{
  "email": "admin@example.com",
  "password": "admin123"
}
```

Copy the token from response.

### Step 3: Use Admin Token
For all admin operations, use the admin token:

```
Authorization: Bearer YOUR_ADMIN_TOKEN
```

### Step 4: Manage Books & Categories
Now you can:
- Create categories
- Create books
- Update books
- Delete books
- Update categories
- Delete categories

---

## Important Notes

1. **Separate Collections:**
   - Users stored in `users` collection
   - Admins stored in `admins` collection

2. **Separate Tokens:**
   - User token works for user endpoints only
   - Admin token works for admin endpoints only

3. **Admin Cannot:**
   - Sign up through API (must be created manually)
   - Use user endpoints with admin token

4. **User Cannot:**
   - Access admin endpoints
   - Create/update/delete books or categories

---

## Testing in Postman

### Create Admin Collection:
1. Admin Sign In
2. Get Admin Profile
3. Update Admin Profile
4. Upload Admin Avatar
5. Create Category (with admin token)
6. Create Book (with admin token)

### Test Flow:
1. Sign in as admin → Get token
2. Create a category
3. Create a book in that category
4. Verify book appears in GET /api/books

---

## Security

- Admin passwords are hashed with bcrypt
- Admin tokens use JWT
- Admin routes protected with `protectAdmin` middleware
- Separate authentication system from users
- No public admin signup endpoint
