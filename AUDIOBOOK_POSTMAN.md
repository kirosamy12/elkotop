# AudioBook API - Postman Examples

Base URL: `http://localhost:3000`

---

## 1. Get All AudioBooks

```
GET /api/audiobooks
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
      "description": "A classic American novel",
      "coverImage": "https://elragaa.b-cdn.net/audiobooks/covers/uuid.jpg",
      "audioUrl": "https://elragaa.b-cdn.net/audiobooks/audio.mp3",
      "duration": "5h 30m",
      "releaseDate": "1925-04-10T00:00:00.000Z",
      "category": { "id": 1, "title": "Fiction" },
      "author": { "id": 1, "name": "F. Scott Fitzgerald", "image": "..." },
      "createdAt": "2024-03-15T10:30:00.000Z"
    }
  ]
}
```

---

## 2. Get AudioBook by ID

```
GET /api/audiobooks/1
```

---

## 3. Search AudioBooks

```
GET /api/audiobooks/search?query=gatsby
```

---

## 4. Get AudioBooks by Author

```
GET /api/audiobooks/author/1
```

---

## 5. Create AudioBook (Admin Only)

```
POST /api/audiobooks
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
audioUrl:https://elragaa.b-cdn.net/audiobooks/gatsby.mp3
duration:5h 30m
```

**File field:**
| Key | Type | Value |
|-----|------|-------|
| coverImage | File | [select image] |

**Response (201):**
```json
{
  "success": true,
  "message": "Audiobook created successfully",
  "data": {
    "id": 1,
    "title": "The Great Gatsby",
    "description": "A classic American novel set in the Jazz Age",
    "coverImage": "https://elragaa.b-cdn.net/audiobooks/covers/uuid.jpg",
    "audioUrl": "https://elragaa.b-cdn.net/audiobooks/gatsby.mp3",
    "duration": "5h 30m",
    "releaseDate": "1925-04-10T00:00:00.000Z",
    "category": { "id": 1, "title": "Fiction" },
    "author": { "id": 1, "name": "F. Scott Fitzgerald", "image": "..." }
  }
}
```

---

## 6. Update AudioBook (Admin Only)

```
PUT /api/audiobooks/1
Authorization: Bearer ADMIN_TOKEN
Content-Type: multipart/form-data
```

**Bulk Edit (optional fields):**
```
title:Updated Title
duration:6h 00m
audioUrl:https://elragaa.b-cdn.net/audiobooks/new-audio.mp3
```

Optionally add new cover image:
| Key | Type | Value |
|-----|------|-------|
| coverImage | File | [select new image] |

---

## 7. Delete AudioBook (Admin Only)

```
DELETE /api/audiobooks/1
Authorization: Bearer ADMIN_TOKEN
```

**Response:**
```json
{
  "success": true,
  "message": "Audiobook deleted successfully"
}
```

---

## Quick Copy Examples

**AudioBook 1:**
```
title:The Great Gatsby
description:A classic American novel narrated by Jake Gyllenhaal
releaseDate:1925-04-10
categoryId:1
authorId:1
audioUrl:https://elragaa.b-cdn.net/audio/gatsby.mp3
duration:5h 30m
```

**AudioBook 2:**
```
title:1984
description:George Orwell's dystopian masterpiece read by Simon Prebble
releaseDate:1949-06-08
categoryId:1
authorId:2
audioUrl:https://elragaa.b-cdn.net/audio/1984.mp3
duration:11h 22m
```

---

## Fields Reference

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| title | Text | ✅ | AudioBook title |
| description | Text | ✅ | AudioBook description |
| releaseDate | Text | ✅ | Format: YYYY-MM-DD |
| categoryId | Text | ✅ | Category ID from /api/categories |
| authorId | Text | ✅ | Author ID from /api/authors |
| audioUrl | Text | ✅ | Link to audio file |
| duration | Text | ❌ | e.g. "5h 30m" |
| coverImage | File | ✅ | Cover image (uploaded to BunnyCDN) |
