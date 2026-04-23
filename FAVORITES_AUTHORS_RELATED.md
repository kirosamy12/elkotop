# Favorites & Related Books - Postman Examples

Base URL: `https://elkotop-dusky.vercel.app`

All endpoints require User Token:
```
Authorization: Bearer USER_TOKEN
```

---

## Favorite Books

### 1. Get Favorite Books
```
GET /api/favorites/books
Authorization: Bearer USER_TOKEN
```

**Response:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "6612a3b4c5d6e7f8g9h0i1j2",
      "title": "The Great Gatsby",
      "coverImage": "https://res.cloudinary.com/.../cover.jpg",
      "author": { "_id": "...", "name": "F. Scott Fitzgerald", "image": "..." },
      "category": { "_id": "...", "title": "Fiction" }
    }
  ]
}
```

---

### 2. Add Book to Favorites
```
POST /api/favorites/books/:bookId
Authorization: Bearer USER_TOKEN
```

**Example:**
```
POST /api/favorites/books/6612a3b4c5d6e7f8g9h0i1j2
```

**Response:**
```json
{
  "success": true,
  "message": "Book added to favorites"
}
```

---

### 3. Remove Book from Favorites
```
DELETE /api/favorites/books/:bookId
Authorization: Bearer USER_TOKEN
```

**Example:**
```
DELETE /api/favorites/books/6612a3b4c5d6e7f8g9h0i1j2
```

**Response:**
```json
{
  "success": true,
  "message": "Book removed from favorites"
}
```

---

## Favorite Authors

### 4. Get Favorite Authors
```
GET /api/favorites/authors
Authorization: Bearer USER_TOKEN
```

**Response:**
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "_id": "6612a3b4c5d6e7f8g9h0i1j4",
      "name": "F. Scott Fitzgerald",
      "bio": "American novelist...",
      "image": "https://res.cloudinary.com/.../author.jpg"
    }
  ]
}
```

---

### 5. Add Author to Favorites
```
POST /api/favorites/authors/:authorId
Authorization: Bearer USER_TOKEN
```

**Example:**
```
POST /api/favorites/authors/6612a3b4c5d6e7f8g9h0i1j4
```

**Response:**
```json
{
  "success": true,
  "message": "Author added to favorites"
}
```

---

### 6. Remove Author from Favorites
```
DELETE /api/favorites/authors/:authorId
Authorization: Bearer USER_TOKEN
```

**Example:**
```
DELETE /api/favorites/authors/6612a3b4c5d6e7f8g9h0i1j4
```

**Response:**
```json
{
  "success": true,
  "message": "Author removed from favorites"
}
```

---

## Related Books

### 7. Get Related Books
```
GET /api/books/:id/related
```

**Example:**
```
GET /api/books/6612a3b4c5d6e7f8g9h0i1j2/related
```

**Response:**
```json
{
  "success": true,
  "count": 4,
  "data": [
    {
      "_id": "6612a3b4c5d6e7f8g9h0i1j5",
      "title": "The Catcher in the Rye",
      "coverImage": "https://res.cloudinary.com/.../cover2.jpg",
      "author": { "_id": "...", "name": "J.D. Salinger" },
      "category": { "_id": "...", "title": "Fiction" }
    }
  ]
}
```

**Note:** Returns up to 6 books from the same category, excluding the current book.

---

## Error Responses

**Already in favorites (400):**
```json
{
  "success": false,
  "message": "Book already in favorites"
}
```

**Not in favorites (404):**
```json
{
  "success": false,
  "message": "Book not in favorites"
}
```

**Not authorized (401):**
```json
{
  "success": false,
  "message": "Not authorized to access this route"
}
```
