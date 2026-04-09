# Favorites API - Postman Examples

Base URL: `http://localhost:3000`

> All endpoints require User Token (not Admin Token)

---

## 1. Get My Favorites

```
GET /api/favorites
Authorization: Bearer USER_TOKEN
```

**Response (200 OK):**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
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
        "image": "https://res.cloudinary.com/.../author.jpg"
      }
    }
  ]
}
```

**Empty favorites:**
```json
{
  "success": true,
  "count": 0,
  "data": []
}
```

---

## 2. Add Book to Favorites

```
POST /api/favorites/:bookId
Authorization: Bearer USER_TOKEN
```

**Example:**
```
POST /api/favorites/1
Authorization: Bearer USER_TOKEN
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Book added to favorites"
}
```

**Already in favorites (400):**
```json
{
  "success": false,
  "message": "Book already in favorites"
}
```

**Book not found (404):**
```json
{
  "success": false,
  "message": "Book not found"
}
```

---

## 3. Remove Book from Favorites

```
DELETE /api/favorites/:bookId
Authorization: Bearer USER_TOKEN
```

**Example:**
```
DELETE /api/favorites/1
Authorization: Bearer USER_TOKEN
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Book removed from favorites"
}
```

**Not in favorites (404):**
```json
{
  "success": false,
  "message": "Book not in favorites"
}
```

---

## Complete Workflow

### Step 1: Sign In as User
```
POST /api/auth/signin
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "123456"
}
```
→ Copy user token

### Step 2: Get All Books (find book IDs)
```
GET /api/books
```

### Step 3: Add Books to Favorites
```
POST /api/favorites/1
Authorization: Bearer USER_TOKEN

POST /api/favorites/2
Authorization: Bearer USER_TOKEN

POST /api/favorites/3
Authorization: Bearer USER_TOKEN
```

### Step 4: View My Favorites
```
GET /api/favorites
Authorization: Bearer USER_TOKEN
```

### Step 5: Remove a Book
```
DELETE /api/favorites/2
Authorization: Bearer USER_TOKEN
```

---

## Notes

- Requires **User Token** (not Admin Token)
- Each user has their own separate favorites list
- Cannot add the same book twice
- Favorites include full book details (cover, author, category)
