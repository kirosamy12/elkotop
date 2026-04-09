# Author API - Postman Examples

Base URL: `http://localhost:3000`

---

## 1. Get All Authors

```
GET /api/authors
```

**Response:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": 1,
      "name": "F. Scott Fitzgerald",
      "bio": "American novelist and short story writer",
      "avatar": "https://res.cloudinary.com/.../author1.jpg",
      "createdAt": "2024-03-15T10:30:00.000Z"
    } 
  ]
}
```

---

## 2. Get Author by ID (with books)

```
GET /api/authors/1
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "F. Scott Fitzgerald",
    "bio": "American novelist",
    "avatar": "https://res.cloudinary.com/.../author1.jpg",
    "books": [
      {
        "id": 1,
        "title": "The Great Gatsby",
        "coverImage": "https://res.cloudinary.com/.../cover.jpg",
        "releaseDate": "1925-04-10"
      }
    ]
  }
}
```

---

## 3. Create Author (Admin Only)

```
POST /api/authors
Authorization: Bearer ADMIN_TOKEN
Content-Type: multipart/form-data
```

**Bulk Edit:**
```
name:F. Scott Fitzgerald
bio:American novelist and short story writer known for The Great Gatsby
```

Add avatar manually (optional):
- Key: `image`, Type: `File`

**Response:**
```json
{
  "success": true,
  "message": "Author created successfully",
  "data": {
    "id": 1,
    "name": "F. Scott Fitzgerald",
    "bio": "American novelist...",
    "avatar": "https://res.cloudinary.com/.../author1.jpg",
    "createdAt": "2024-03-15T10:30:00.000Z"
  }
}
```

---

## 4. Update Author (Admin Only)

```
PUT /api/authors/1
Authorization: Bearer ADMIN_TOKEN
Content-Type: multipart/form-data
```

**Bulk Edit (optional fields):**
```
name:Updated Author Name
bio:Updated biography text
```

---

## 5. Delete Author (Admin Only)

```
DELETE /api/authors/1
Authorization: Bearer ADMIN_TOKEN
```

**Response:**
```json
{
  "success": true,
  "message": "Author deleted successfully"
}
```

**Note:** Cannot delete author if they have books!

---

## 6. Create Book with Author ID (Admin Only)

```
POST /api/books
Authorization: Bearer ADMIN_TOKEN
Content-Type: multipart/form-data
```

**Bulk Edit:**
```
title:The Great Gatsby
description:A classic American novel set in the Jazz Age
releaseDate:1925-04-10
categoryId:1
authorId:1
```

Add files manually:
- Key: `coverImage`, Type: `File`
- Key: `pdfFile`, Type: `File`

**Response:**
```json
{
  "success": true,
  "message": "Book created successfully",
  "data": {
    "id": 1,
    "title": "The Great Gatsby",
    "description": "A classic American novel...",
    "coverImage": "https://res.cloudinary.com/.../cover.jpg",
    "pdfFile": "https://res.cloudinary.com/.../book.pdf",
    "releaseDate": "1925-04-10",
    "category": {
      "id": 1,
      "title": "Fiction"
    },
    "author": {
      "id": 1,
      "name": "F. Scott Fitzgerald",
      "avatar": "https://res.cloudinary.com/.../author1.jpg"
    }
  }
}
```

---

## 7. Get Books by Author ID

```
GET /api/books/author/1
```

**Response:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": 1,
      "title": "The Great Gatsby",
      "coverImage": "https://res.cloudinary.com/.../cover.jpg",
      "author": {
        "id": 1,
        "name": "F. Scott Fitzgerald"
      }
    }
  ]
}
```

---

## Complete Workflow

### Step 1: Sign in as Admin
```
POST /api/admin/signin
{ "email": "admin@example.com", "password": "admin123" }
```
→ Copy token

### Step 2: Create Category
```
POST /api/categories
Authorization: Bearer TOKEN
{ "title": "Fiction" }
```
→ Copy category ID

### Step 3: Create Author
```
POST /api/authors
Authorization: Bearer TOKEN
form-data: name, bio, avatar(file)
```
→ Copy author ID

### Step 4: Create Book
```
POST /api/books
Authorization: Bearer TOKEN
form-data: title, description, releaseDate, categoryId, authorId, coverImage(file), pdfFile(file)
```

---

## Quick Copy Examples

**Author 1:**
```
name:Stephen King
bio:American author of horror and supernatural fiction
```

**Author 2:**
```
name:J.K. Rowling
bio:British author best known for the Harry Potter series
```

**Author 3:**
```
name:George Orwell
bio:English novelist known for Nineteen Eighty-Four and Animal Farm
```

**Book with Author:**
```
title:1984
description:A dystopian novel set in a totalitarian society
releaseDate:1949-06-08
categoryId:1
authorId:3
```
