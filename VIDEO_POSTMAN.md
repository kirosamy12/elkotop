# Video Library API - Postman Examples

Base URL: `http://localhost:3000`

---

## 1. Get All Videos

```
GET /api/videos
```

**Response:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": 1,
      "title": "Introduction to Python",
      "description": "A beginner-friendly Python course",
      "coverImage": "https://elragaa.b-cdn.net/videos/covers/uuid.jpg",
      "videoUrl": "https://elragaa.b-cdn.net/videos/python-intro.mp4",
      "duration": "2h 15m",
      "releaseDate": "2024-01-15T00:00:00.000Z",
      "category": { "id": 1, "title": "Programming" },
      "author": { "id": 1, "name": "John Doe", "image": "..." },
      "createdAt": "2024-03-15T10:30:00.000Z"
    }
  ]
}
```

---

## 2. Get Video by ID

```
GET /api/videos/1
```

---

## 3. Search Videos

```
GET /api/videos/search?query=python
```

---

## 4. Get Videos by Author

```
GET /api/videos/author/1
```

---

## 5. Create Video (Admin Only)

```
POST /api/videos
Authorization: Bearer ADMIN_TOKEN
Content-Type: multipart/form-data
```

**Bulk Edit:**
```
title:Introduction to Python
description:A beginner-friendly Python programming course
releaseDate:2024-01-15
categoryId:1
authorId:1
videoUrl:https://elragaa.b-cdn.net/videos/python-intro.mp4
duration:2h 15m
```

**File field:**
| Key | Type | Value |
|-----|------|-------|
| coverImage | File | [select image] |

**Response (201):**
```json
{
  "success": true,
  "message": "Video created successfully",
  "data": {
    "id": 1,
    "title": "Introduction to Python",
    "description": "A beginner-friendly Python programming course",
    "coverImage": "https://elragaa.b-cdn.net/videos/covers/uuid.jpg",
    "videoUrl": "https://elragaa.b-cdn.net/videos/python-intro.mp4",
    "duration": "2h 15m",
    "releaseDate": "2024-01-15T00:00:00.000Z",
    "category": { "id": 1, "title": "Programming" },
    "author": { "id": 1, "name": "John Doe", "image": "..." }
  }
}
```

---

## 6. Update Video (Admin Only)

```
PUT /api/videos/1
Authorization: Bearer ADMIN_TOKEN
Content-Type: multipart/form-data
```

**Bulk Edit (optional fields):**
```
title:Updated Video Title
duration:3h 00m
videoUrl:https://elragaa.b-cdn.net/videos/new-video.mp4
```

Optionally add new cover:
| Key | Type | Value |
|-----|------|-------|
| coverImage | File | [select new image] |

---

## 7. Delete Video (Admin Only)

```
DELETE /api/videos/1
Authorization: Bearer ADMIN_TOKEN
```

**Response:**
```json
{
  "success": true,
  "message": "Video deleted successfully"
}
```

---

## Quick Copy Examples

**Video 1:**
```
title:Introduction to Python
description:Learn Python from scratch with hands-on examples
releaseDate:2024-01-15
categoryId:1
authorId:1
videoUrl:https://elragaa.b-cdn.net/videos/python.mp4
duration:2h 15m
```

**Video 2:**
```
title:JavaScript for Beginners
description:Complete JavaScript course for web development
releaseDate:2024-02-10
categoryId:1
authorId:2
videoUrl:https://elragaa.b-cdn.net/videos/javascript.mp4
duration:4h 30m
```

---

## Fields Reference

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| title | Text | ✅ | Video title |
| description | Text | ✅ | Video description |
| releaseDate | Text | ✅ | Format: YYYY-MM-DD |
| categoryId | Text | ✅ | Category ID from /api/categories |
| authorId | Text | ✅ | Author ID from /api/authors |
| videoUrl | Text | ✅ | Link to video file |
| duration | Text | ❌ | e.g. "2h 15m" |
| coverImage | File | ✅ | Thumbnail (uploaded to BunnyCDN) |
