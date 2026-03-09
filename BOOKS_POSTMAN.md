# Books API - Postman Guide

Complete guide for testing the Books Management System.

---

## Base URL
```
http://localhost:5000
```

---

## Categories Endpoints

### 1. Get All Categories

```
GET /api/categories
```

**Response:**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "_id": "65f1a2b3c4d5e6f7g8h9i0j1",
      "title": "Fiction",
      "createdAt": "2024-03-15T10:30:00.000Z"
    },
    {
      "_id": "65f1a2b3c4d5e6f7g8h9i0j2",
      "title": "Science",
      "createdAt": "2024-03-15T10:31:00.000Z"
    }
  ]
}
```

---

### 2. Get Category with Books

```
GET /api/categories/:id
```

**Example:** `GET /api/categories/65f1a2b3c4d5e6f7g8h9i0j1`

**Response:**
```json
{
  "success": true,
  "data": {
    "category": {
      "_id": "65f1a2b3c4d5e6f7g8h9i0j1",
      "title": "Fiction",
      "createdAt": "2024-03-15T10:30:00.000Z"
    },
    "books": [
      {
        "_id": "book123",
        "title": "The Great Book",
        "author": "John Doe",
        "coverImage": "https://res.cloudinary.com/dxvynre0v/image/upload/.../cover.jpg",
        "description": "An amazing story...",
        "releaseDate": "2024-01-15T00:00:00.000Z"
      },
      {
        "_id": "book456",
        "title": "Another Book",
        "author": "Jane Smith",
        "coverImage": "https://res.cloudinary.com/dxvynre0v/image/upload/.../cover2.jpg",
        "description": "Another great story...",
        "releaseDate": "2024-02-20T00:00:00.000Z"
      }
    ]
  }
}
```

**Note:** Books list includes `coverImage` for displaying book covers in the category view.

---

### 3. Create Category (Admin Only)

```
POST /api/categories
Authorization: Bearer ADMIN_TOKEN
Content-Type: application/json
```

**Body:**
```json
{
  "title": "Fiction"
}
```

**Response:**
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

---

### 4. Update Category (Admin Only)

```
PUT /api/categories/:id
Authorization: Bearer ADMIN_TOKEN
Content-Type: application/json
```

**Body:**
```json
{
  "title": "Science Fiction"
}
```

---

### 5. Delete Category (Admin Only)

```
DELETE /api/categories/:id
Authorization: Bearer ADMIN_TOKEN
```

**Note:** Cannot delete category if it has books.

---

## Books Endpoints

### 6. Get All Books

```
GET /api/books
```

**Response:**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "book123",
      "title": "The Great Book",
      "author": "John Doe",
      "description": "An amazing story about...",
      "coverImage": "https://res.cloudinary.com/dxvynre0v/image/upload/v1234567890/books/covers/book123.jpg",
      "pdfFile": "https://res.cloudinary.com/dxvynre0v/image/upload/v1234567890/books/pdfs/book123.pdf",
      "releaseDate": "2024-01-15T00:00:00.000Z",
      "category": {
        "_id": "cat123",
        "title": "Fiction"
      },
      "createdAt": "2024-03-15T10:30:00.000Z"
    }
  ]
}
```

**Note:** 
- `coverImage` is the book cover (displayed in lists and detail view)
- `pdfFile` is the actual book PDF file

---

### 7. Get Single Book

```
GET /api/books/:id
```

**Example:** `GET /api/books/65f1a2b3c4d5e6f7g8h9i0j1`

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "book123",
    "title": "The Great Book",
    "author": "John Doe",
    "description": "An amazing story about adventure and discovery. This book takes you on a journey...",
    "coverImage": "https://res.cloudinary.com/dxvynre0v/image/upload/v1234567890/books/covers/book123.jpg",
    "pdfFile": "https://res.cloudinary.com/dxvynre0v/image/upload/v1234567890/books/pdfs/book123.pdf",
    "releaseDate": "2024-01-15T00:00:00.000Z",
    "category": {
      "_id": "cat123",
      "title": "Fiction"
    },
    "createdAt": "2024-03-15T10:30:00.000Z"
  }
}
```

**What you get:**
- ✅ `coverImage` - Book cover image URL (for display)
- ✅ `pdfFile` - PDF file URL (for download/read)
- ✅ `title` - Book title
- ✅ `author` - Author name
- ✅ `description` - Full description
- ✅ `releaseDate` - Publication date
- ✅ `category` - Category details

---

### 8. Search Books

```
GET /api/books/search?query=great
```

**Response:**
```json
{
  "success": true,
  "count": 2,
  "data": [...]
}
```

**Note:** Searches in both title and author fields.

---

### 9. Get Books by Author

```
GET /api/books/author/John%20Doe
```

**Response:**
```json
{
  "success": true,
  "count": 3,
  "data": [...]
}
```

---

### 10. Create Book (Admin Only)

**Important:** Use form-data, NOT JSON!

```
POST /api/books
Authorization: Bearer ADMIN_TOKEN
Content-Type: multipart/form-data
```

**Postman Setup:**
1. Select POST method
2. URL: `http://localhost:5000/api/books`
3. Authorization tab → Bearer Token → Paste admin token
4. Body tab → Select "form-data"
5. Copy and paste these fields (use Bulk Edit in Postman):

```
title:The Great Book
author:John Doe
description:An amazing story about adventure and discovery
releaseDate:2024-01-15
category:PASTE_YOUR_CATEGORY_ID_HERE
```

6. Then manually add files:
   - Key: `coverImage` → Change type to "File" → Select image
   - Key: `pdfFile` → Change type to "File" → Select PDF

**How to use Bulk Edit in Postman:**
1. In Body tab, click "Bulk Edit" button (top right)
2. Paste the text above
3. Click "Key-Value Edit" to go back
4. Add the two file fields manually

**Response:**
```json
{
  "success": true,
  "message": "Book created successfully",
  "data": {
    "_id": "book123",
    "title": "The Great Book",
    "author": "John Doe",
    "description": "An amazing story...",
    "coverImage": "https://res.cloudinary.com/.../cover.jpg",
    "pdfFile": "https://res.cloudinary.com/.../book.pdf",
    "releaseDate": "2024-01-15T00:00:00.000Z",
    "category": {
      "_id": "cat123",
      "title": "Fiction"
    }
  }
}
```

---

### 11. Update Book (Admin Only)

```
PUT /api/books/:id
Authorization: Bearer ADMIN_TOKEN
Content-Type: multipart/form-data
```

**Postman Setup:**
Same as Create, but all fields are optional.
Only include fields you want to update.

**Example - Update text fields only (Bulk Edit):**
```
title:Updated Book Title
author:Updated Author Name
description:Updated description text
```

**Example - Update with new files:**
Add the text fields above, then manually add:
- `coverImage` (File type)
- `pdfFile` (File type)

---

### 12. Delete Book (Admin Only)

```
DELETE /api/books/:id
Authorization: Bearer ADMIN_TOKEN
```

---

## Complete Workflow Example

### Step 1: Sign In as Admin

```
POST /api/admin/signin
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "admin123"
}
```

Copy the token from response.

---

### Step 2: Create Category

```
POST /api/categories
Authorization: Bearer YOUR_ADMIN_TOKEN
Content-Type: application/json

{
  "title": "Fiction"
}
```

Copy the category `_id` from response.

---

### Step 3: Create Book

```
POST /api/books
Authorization: Bearer YOUR_ADMIN_TOKEN
Content-Type: multipart/form-data
```

**Bulk Edit (copy & paste):**
```
title:The Great Gatsby
author:F. Scott Fitzgerald
description:A classic American novel set in the Jazz Age
releaseDate:1925-04-10
category:PASTE_CATEGORY_ID_HERE
```

**Then add files manually:**
- coverImage: [select image file]
- pdfFile: [select PDF file]

---

### Step 4: Get All Books

```
GET /api/books
```

---

### Step 5: Search Books

```
GET /api/books/search?query=gatsby
```

---

### Step 6: Get Books by Author

```
GET /api/books/author/F.%20Scott%20Fitzgerald
```

---

## Testing Tips

### File Requirements:
- **Cover Image:** JPG, PNG, GIF (max 10MB)
- **PDF File:** PDF only (max 10MB)

### Date Format:
- Use ISO format: `YYYY-MM-DD`
- Example: `2024-01-15`

### Category ID:
- Must be a valid MongoDB ObjectId
- Get it from GET /api/categories response

---

## Error Responses

### Missing Files (400):
```json
{
  "success": false,
  "message": "Cover image and PDF file are required"
}
```

### Category Not Found (404):
```json
{
  "success": false,
  "message": "Category not found"
}
```

### Unauthorized (401):
```json
{
  "success": false,
  "message": "Not authorized to access this route"
}
```

### Forbidden (403):
```json
{
  "success": false,
  "message": "User role 'user' is not authorized to access this route"
}
```

---

## Summary

**Public Endpoints (No Auth Required):**
- GET /api/categories
- GET /api/categories/:id
- GET /api/books
- GET /api/books/:id
- GET /api/books/search
- GET /api/books/author/:author

**Admin Only Endpoints:**
- POST /api/categories
- PUT /api/categories/:id
- DELETE /api/categories/:id
- POST /api/books
- PUT /api/books/:id
- DELETE /api/books/:id


---

## Quick Copy-Paste Examples

### Example 1: Fiction Book
```
title:To Kill a Mockingbird
author:Harper Lee
description:A gripping tale of racial injustice and childhood innocence
releaseDate:1960-07-11
category:YOUR_FICTION_CATEGORY_ID
```

### Example 2: Science Book
```
title:A Brief History of Time
author:Stephen Hawking
description:From the Big Bang to Black Holes
releaseDate:1988-04-01
category:YOUR_SCIENCE_CATEGORY_ID
```

### Example 3: Biography
```
title:Steve Jobs
author:Walter Isaacson
description:The exclusive biography of the Apple founder
releaseDate:2011-10-24
category:YOUR_BIOGRAPHY_CATEGORY_ID
```

### Example 4: Programming Book
```
title:Clean Code
author:Robert C. Martin
description:A Handbook of Agile Software Craftsmanship
releaseDate:2008-08-01
category:YOUR_PROGRAMMING_CATEGORY_ID
```

**Remember:** After pasting in Bulk Edit, switch to Key-Value Edit and add the file fields!


---

## Understanding Cover Image vs PDF

### Cover Image (`coverImage`)
- **Purpose:** Display book cover in lists and detail pages
- **Format:** JPG, PNG, GIF
- **Size:** Automatically resized to 800x1200px
- **Usage:** Show in:
  - Books list (GET /api/books)
  - Category books (GET /api/categories/:id)
  - Book details (GET /api/books/:id)
  - Search results
  - Author's books

### PDF File (`pdfFile`)
- **Purpose:** The actual book content for reading/downloading
- **Format:** PDF only
- **Size:** Up to 10MB
- **Usage:** 
  - Download link
  - PDF viewer
  - Book reader

### Example Response Structure:
```json
{
  "title": "The Great Book",
  "author": "John Doe",
  "coverImage": "https://cloudinary.com/.../cover.jpg",  ← Display this image
  "pdfFile": "https://cloudinary.com/.../book.pdf"       ← Download/read this
}
```

### In Your Frontend:
```html
<!-- Show cover image -->
<img src="{{ book.coverImage }}" alt="{{ book.title }}">

<!-- Download PDF button -->
<a href="{{ book.pdfFile }}" download>Download Book</a>

<!-- Or open in viewer -->
<a href="{{ book.pdfFile }}" target="_blank">Read Book</a>
```


---

## Important: Admin vs User

### For Admin Operations (Create/Update/Delete):
Use Admin Token from:
```
POST /api/admin/signin
```

### For User Operations (View Only):
No token needed for public endpoints:
- GET /api/books
- GET /api/categories
- GET /api/books/search

Or use User Token from:
```
POST /api/auth/signin
```

**Note:** User tokens CANNOT create/update/delete books or categories!

---

## Quick Start Guide

### 1. Create Admin (First Time Only):
```bash
npm run create-admin
```

### 2. Sign In as Admin:
```
POST /api/admin/signin
Body: { "email": "admin@example.com", "password": "admin123" }
```

### 3. Use Admin Token:
Copy token and use in Authorization header for all admin operations.

### 4. Create Content:
- Create categories
- Create books with cover images and PDFs
- Manage all content

See `ADMIN_POSTMAN.md` for detailed admin examples!
