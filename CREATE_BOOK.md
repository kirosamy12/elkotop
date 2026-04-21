# Create Book - Postman Example

## Endpoint
```
POST /api/books
```

## Setup in Postman

1. Method: `POST`
2. URL: `https://elkotop-dusky.vercel.app/api/books`
3. Authorization tab → Bearer Token → paste admin token
4. Body tab → form-data → click **Bulk Edit** and paste:

```
title:The Great Gatsby
description:A classic American novel set in the Jazz Age about wealth and love
releaseDate:1925-04-10
categoryId:PASTE_CATEGORY_ID_HERE
authorId:PASTE_AUTHOR_ID_HERE
```

5. Switch back to **Key-Value Edit**
6. Add two file fields manually:

| Key | Type | Value |
|-----|------|-------|
| coverImage | File | select image |
| pdfFile | File | select PDF |

---

## Response (201)
```json
{
  "success": true,
  "message": "Book created successfully",
  "data": {
    "_id": "6612a3b4c5d6e7f8g9h0i1j2",
    "title": "The Great Gatsby",
    "description": "A classic American novel...",
    "coverImage": "https://res.cloudinary.com/dxvynre0v/image/upload/.../cover.jpg",
    "pdfFile": "https://res.cloudinary.com/dxvynre0v/raw/upload/.../book.pdf",
    "releaseDate": "1925-04-10",
    "category": {
      "id": "6612a3b4c5d6e7f8g9h0i1j3",
      "title": "Fiction"
    },
    "author": {
      "_id": "6612a3b4c5d6e7f8g9h0i1j4",
      "name": "F. Scott Fitzgerald",
      "image": "https://res.cloudinary.com/dxvynre0v/image/upload/.../author.jpg"
    }
  }
}
```

---

## Steps Before Creating a Book

### 1. Get Category ID
```
GET /api/categories
```
Copy the `_id` from the response.

### 2. Get Author ID
```
GET /api/authors
```
Copy the `_id` from the response.

### 3. Create the Book
Use the IDs above in the form-data.
