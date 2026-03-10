# Admin API - Postman Examples

Complete Postman guide for Admin authentication and operations.

---

## Base URL
```
http://localhost:5000
```

---

## Step 1: Create First Admin

Before you can sign in, you need to create the first admin.

### Run the script:
```bash
npm run create-admin
```

**Output:**
```
Connected to MongoDB
✅ Admin created successfully!
Email: admin@example.com
Password: admin123

You can now sign in at: POST /api/admin/signin
```

---

## Step 2: Admin Sign In

### Endpoint
```
POST /api/admin/signin
```

### Postman Setup:
1. Method: `POST`
2. URL: `http://localhost:5000/api/admin/signin`
3. Headers:
   - `Content-Type: application/json`
4. Body → raw → JSON:

```json
{
  "email": "admin@example.com",
  "password": "admin123"
}
```

### Response (200 OK):
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
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1ZjFhMmIzYzRkNWU2ZjdnOGg5aTBqMSIsImlhdCI6MTcxMDUwMDAwMCwiZXhwIjoxNzExMTA0ODAwfQ.abc123xyz"
  }
}
```

**Important:** Copy the `token` value - you'll need it for all admin operations!

---

## Step 4: Get All Admins

### Endpoint
```
GET /api/admin/all
```

### Postman Setup:
1. Method: `GET`
2. URL: `http://localhost:5000/api/admin/all`
3. Authorization:
   - Type: `Bearer Token`
   - Token: `[Your admin token]`

### Response (200 OK):
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "65f1a2b3c4d5e6f7g8h9i0j1",
      "firstName": "Admin",
      "lastName": "User",
      "email": "admin@example.com",
      "avatar": "",
      "createdAt": "2024-03-15T10:30:00.000Z"
    },
    {
      "_id": "65f1a2b3c4d5e6f7g8h9i0j2",
      "firstName": "John",
      "lastName": "Admin",
      "email": "john.admin@example.com",
      "avatar": "",
      "createdAt": "2024-03-15T11:00:00.000Z"
    }
  ]
}
```

---

## Step 5: Get Admin Profile

### Endpoint
```
GET /api/admin/profile
```

### Postman Setup:
1. Method: `GET`
2. URL: `http://localhost:5000/api/admin/profile`
3. Authorization:
   - Type: `Bearer Token`
   - Token: `[Paste your admin token here]`

### Response (200 OK):
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

## Step 6: Update Admin Profile

### Endpoint
```
PUT /api/admin/profile
```

### Postman Setup:
1. Method: `PUT`
2. URL: `http://localhost:5000/api/admin/profile`
3. Authorization:
   - Type: `Bearer Token`
   - Token: `[Your admin token]`
4. Headers:
   - `Content-Type: application/json`
5. Body → raw → JSON:

```json
{
  "firstName": "Super",
  "lastName": "Admin"
}
```

### Response (200 OK):
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": "65f1a2b3c4d5e6f7g8h9i0j1",
    "firstName": "Super",
    "lastName": "Admin",
    "email": "admin@example.com",
    "avatar": "",
    "role": "admin"
  }
}
```

---

## Step 7: Upload Admin Avatar

### Endpoint
```
POST /api/admin/upload-avatar
```

### Postman Setup:
1. Method: `POST`
2. URL: `http://localhost:5000/api/admin/upload-avatar`
3. Authorization:
   - Type: `Bearer Token`
   - Token: `[Your admin token]`
4. Body → form-data:
   - Key: `avatar`
   - Type: `File`
   - Value: [Select image file]

### Response (200 OK):
```json
{
  "success": true,
  "message": "Avatar uploaded successfully",
  "data": {
    "avatar": "https://res.cloudinary.com/dxvynre0v/image/upload/v1234567890/admins/avatars/admin123.jpg"
  }
}
```

---

## Step 8: Delete Admin (Admin Only)

### Endpoint
```
DELETE /api/admin/:id
```

### Example:
```
DELETE /api/admin/65f1a2b3c4d5e6f7g8h9i0j2
```

### Postman Setup:
1. Method: `DELETE`
2. URL: `http://localhost:5000/api/admin/65f1a2b3c4d5e6f7g8h9i0j2`
3. Authorization:
   - Type: `Bearer Token`
   - Token: `[Your admin token]`

### Response (200 OK):
```json
{
  "success": true,
  "message": "Admin deleted successfully"
}
```

**Important:** You cannot delete your own admin account!

---

## Step 9: Create Category (Admin Only)

### Endpoint
```
POST /api/categories
```

### Postman Setup:
1. Method: `POST`
2. URL: `http://localhost:5000/api/categories`
3. Authorization:
   - Type: `Bearer Token`
   - Token: `[Your admin token]`
4. Headers:
   - `Content-Type: application/json`
5. Body → raw → JSON:

```json
{
  "title": "Fiction"
}
```

### Response (201 Created):
```json
{
  "success": true,
  "message": "Category created successfully",
  "data": {
    "_id": "65f1a2b3c4d5e6f7g8h9i0j1",
    "title": "Fiction",
    "createdAt": "2024-03-15T10:30:00.000Z"
  }
}
```

**Copy the category `_id` - you'll need it to create books!**

---

## Step 10: Create Book (Admin Only)

### Endpoint
```
POST /api/books
```

### Postman Setup:
1. Method: `POST`
2. URL: `http://localhost:5000/api/books`
3. Authorization:
   - Type: `Bearer Token`
   - Token: `[Your admin token]`
4. Body → form-data → Bulk Edit:

```
title:The Great Gatsby
author:F. Scott Fitzgerald
description:A classic American novel set in the Jazz Age
releaseDate:1925-04-10
category:65f1a2b3c4d5e6f7g8h9i0j1
```

5. Switch to Key-Value Edit
6. Add files:
   - Key: `coverImage`, Type: `File`, Value: [Select image]
   - Key: `pdfFile`, Type: `File`, Value: [Select PDF]

### Response (201 Created):
```json
{
  "success": true,
  "message": "Book created successfully",
  "data": {
    "_id": "book123",
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "description": "A classic American novel set in the Jazz Age",
    "coverImage": "https://res.cloudinary.com/.../cover.jpg",
    "pdfFile": "https://res.cloudinary.com/.../book.pdf",
    "releaseDate": "1925-04-10T00:00:00.000Z",
    "category": {
      "_id": "65f1a2b3c4d5e6f7g8h9i0j1",
      "title": "Fiction"
    },
    "createdAt": "2024-03-15T10:30:00.000Z"
  }
}
```

---

## Step 11: Update Book (Admin Only)

### Endpoint
```
PUT /api/books/:id
```

### Example:
```
PUT /api/books/book123
```

### Postman Setup:
1. Method: `PUT`
2. URL: `http://localhost:5000/api/books/book123`
3. Authorization:
   - Type: `Bearer Token`
   - Token: `[Your admin token]`
4. Body → form-data → Bulk Edit (optional fields):

```
title:The Great Gatsby - Updated Edition
description:An updated description
```

5. Optionally add new files if you want to update them

---

## Step 12: Delete Book (Admin Only)

### Endpoint
```
DELETE /api/books/:id
```

### Example:
```
DELETE /api/books/book123
```

### Postman Setup:
1. Method: `DELETE`
2. URL: `http://localhost:5000/api/books/book123`
3. Authorization:
   - Type: `Bearer Token`
   - Token: `[Your admin token]`

### Response (200 OK):
```json
{
  "success": true,
  "message": "Book deleted successfully"
}
```

---

## Step 13: Update Category (Admin Only)

### Endpoint
```
PUT /api/categories/:id
```

### Postman Setup:
1. Method: `PUT`
2. URL: `http://localhost:5000/api/categories/65f1a2b3c4d5e6f7g8h9i0j1`
3. Authorization:
   - Type: `Bearer Token`
   - Token: `[Your admin token]`
4. Headers:
   - `Content-Type: application/json`
5. Body → raw → JSON:

```json
{
  "title": "Science Fiction"
}
```

---

## Step 14: Delete Category (Admin Only)

### Endpoint
```
DELETE /api/categories/:id
```

### Postman Setup:
1. Method: `DELETE`
2. URL: `http://localhost:5000/api/categories/65f1a2b3c4d5e6f7g8h9i0j1`
3. Authorization:
   - Type: `Bearer Token`
   - Token: `[Your admin token]`

**Note:** Cannot delete category if it has books!

---

## Complete Admin Workflow

### 1. Setup (One Time)
```bash
npm run create-admin
```

### 2. Sign In
```
POST /api/admin/signin
{
  "email": "admin@example.com",
  "password": "admin123"
}
```
→ Copy token

### 3. Create Categories
```
POST /api/categories
Authorization: Bearer [token]
{
  "title": "Fiction"
}
```
→ Copy category ID

### 4. Create Books
```
POST /api/books
Authorization: Bearer [token]
Form Data:
- title, author, description, releaseDate, category
- coverImage (file)
- pdfFile (file)
```

### 5. Manage Content
- Update books
- Delete books
- Update categories
- Delete categories (if empty)

---

## Error Responses

### Invalid Credentials (401):
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

### Missing Token (401):
```json
{
  "success": false,
  "message": "Not authorized to access this route"
}
```

### Invalid Token (401):
```json
{
  "success": false,
  "message": "Invalid token"
}
```

### Admin Not Found (404):
```json
{
  "success": false,
  "message": "Admin not found"
}
```

---

## Testing Tips

### Save Admin Token as Environment Variable:
1. In Postman, create an Environment
2. Add variable: `adminToken`
3. After sign in, manually copy token to this variable
4. Use `{{adminToken}}` in Authorization headers

### Create Multiple Categories:
```json
{ "title": "Fiction" }
{ "title": "Science" }
{ "title": "Biography" }
{ "title": "Programming" }
{ "title": "History" }
```

### Test Different Scenarios:
1. ✅ Sign in with correct credentials
2. ❌ Sign in with wrong password
3. ✅ Create category with admin token
4. ❌ Create category without token
5. ❌ Create category with user token
6. ✅ Create book with all required fields
7. ❌ Create book without cover image
8. ❌ Create book without PDF
9. ✅ Update book with new data
10. ✅ Delete book
11. ❌ Delete category with books
12. ✅ Delete empty category

---

## Admin vs User Comparison

### Admin Can:
- ✅ Sign in at `/api/admin/signin`
- ✅ Create categories
- ✅ Update categories
- ✅ Delete categories
- ✅ Create books
- ✅ Update books
- ✅ Delete books
- ✅ View all books
- ✅ Search books

### User Can:
- ✅ Sign up at `/api/auth/signup`
- ✅ Sign in at `/api/auth/signin`
- ✅ View all books
- ✅ Search books
- ✅ View categories
- ❌ Create/Update/Delete anything

### Key Differences:
| Feature | Admin | User |
|---------|-------|------|
| Endpoint | `/api/admin/*` | `/api/auth/*` |
| Collection | `admins` | `users` |
| Can Signup | ❌ No | ✅ Yes |
| Can Manage Content | ✅ Yes | ❌ No |
| Token Type | Admin Token | User Token |

---

## Quick Reference

### Admin Endpoints:
```
POST   /api/admin/signin
POST   /api/admin/create          (Admin only)
GET    /api/admin/all             (Admin only)
GET    /api/admin/profile         (Admin only)
PUT    /api/admin/profile         (Admin only)
POST   /api/admin/upload-avatar   (Admin only)
DELETE /api/admin/:id             (Admin only)
```

### Category Management (Admin Only):
```
GET    /api/categories
GET    /api/categories/:id
POST   /api/categories
PUT    /api/categories/:id
DELETE /api/categories/:id
```

### Book Management (Admin Only):
```
GET    /api/books
GET    /api/books/:id
GET    /api/books/search?query=keyword
GET    /api/books/author/:author
POST   /api/books
PUT    /api/books/:id
DELETE /api/books/:id
```

---

## Need Help?

### Common Issues:

**1. "Invalid token"**
- Make sure you're using admin token, not user token
- Check token hasn't expired (7 days)
- Sign in again to get new token

**2. "Not authorized to access this route"**
- Missing Authorization header
- Token not in "Bearer TOKEN" format
- Using user token for admin endpoints

**3. "Admin not found"**
- Run `npm run create-admin` first
- Check MongoDB connection
- Verify admin exists in database

**4. "Category not found" when creating book**
- Create category first
- Copy correct category ID
- Check category ID format (24 characters)

**5. "Cover image and PDF file are required"**
- Use form-data, not JSON
- Add both coverImage and pdfFile
- Set type to "File" not "Text"


---

## Admin Management Examples

### Create Multiple Admins:

**Admin 1:**
```json
{
  "firstName": "John",
  "lastName": "Smith",
  "email": "john@example.com",
  "password": "secure123"
}
```

**Admin 2:**
```json
{
  "firstName": "Sarah",
  "lastName": "Johnson",
  "email": "sarah@example.com",
  "password": "secure456"
}
```

**Admin 3:**
```json
{
  "firstName": "Mike",
  "lastName": "Brown",
  "email": "mike@example.com",
  "password": "secure789"
}
```

---

## Security Notes

1. **Only Admins Can Create Admins:**
   - You must be signed in as admin
   - Must have valid admin token
   - Cannot create admin without authentication

2. **Cannot Delete Yourself:**
   - System prevents self-deletion
   - Ensures at least one admin exists
   - Must use another admin account to delete

3. **Password Security:**
   - Passwords are hashed with bcrypt
   - Minimum 6 characters required
   - Never stored in plain text

4. **Email Uniqueness:**
   - Each admin must have unique email
   - System checks before creation
   - Returns error if email exists

---

## Testing Scenarios

### ✅ Valid Operations:
1. Create first admin with script
2. Sign in as admin
3. Create additional admins
4. View all admins
5. Update own profile
6. Delete other admins

### ❌ Invalid Operations:
1. Create admin without token → 401 Unauthorized
2. Create admin with user token → 401 Unauthorized
3. Create admin with duplicate email → 400 Bad Request
4. Delete own account → 400 Bad Request
5. Create admin with short password → 400 Bad Request
