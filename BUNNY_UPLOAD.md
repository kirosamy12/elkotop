# BunnyCDN Upload - Postman Examples

BunnyCDN الرفع بيتم تلقائياً من الـ backend.
في Postman بترفع الملف كـ form-data وهو يرفعه على BunnyCDN.

---

## Setup .env Before Testing

```
BUNNY_API_KEY=your_api_key
BUNNY_STORAGE_ZONE=your_storage_zone_name
BUNNY_CDN_URL=https://your-zone.b-cdn.net
```

**How to get Storage Zone name:**
1. Go to BunnyCDN Dashboard → Storage
2. Click on your Storage Zone
3. The name appears at the top (e.g., `alkotop-storage`)

---

## 1. Upload Book Cover + PDF

```
POST /api/books
Authorization: Bearer ADMIN_TOKEN
Content-Type: multipart/form-data
```

**Bulk Edit:**
```
title:The Great Gatsby
description:A classic novel
releaseDate:1925-04-10
categoryId:YOUR_CATEGORY_ID
authorId:YOUR_AUTHOR_ID
```

**File fields:**
| Key | Type | Value |
|-----|------|-------|
| coverImage | File | select image (jpg/png) |
| pdfFile | File | select PDF file |

**Response - URLs will be from BunnyCDN:**
```json
{
  "success": true,
  "message": "Book created successfully",
  "data": {
    "title": "The Great Gatsby",
    "coverImage": "https://elragaa.b-cdn.net/books/covers/uuid.jpg",
    "pdfFile": "https://elragaa.b-cdn.net/books/pdfs/uuid.pdf"
  }
}
```

---

## 2. Upload Author Image

```
POST /api/authors
Authorization: Bearer ADMIN_TOKEN
Content-Type: multipart/form-data
```

**Bulk Edit:**
```
name:F. Scott Fitzgerald
bio:American novelist
```

**File field:**
| Key | Type | Value |
|-----|------|-------|
| image | File | select image |

**Response:**
```json
{
  "success": true,
  "message": "Author created successfully",
  "data": {
    "name": "F. Scott Fitzgerald",
    "image": "https://elragaa.b-cdn.net/authors/uuid.jpg"
  }
}
```

---

## 3. Upload User Avatar

```
POST /api/user/upload-avatar
Authorization: Bearer USER_TOKEN
Content-Type: multipart/form-data
```

**File field:**
| Key | Type | Value |
|-----|------|-------|
| avatar | File | select image |

**Response:**
```json
{
  "success": true,
  "message": "Avatar uploaded successfully",
  "data": {
    "avatar": "https://elragaa.b-cdn.net/avatars/uuid.jpg"
  }
}
```

---

## 4. Upload Admin Avatar

```
POST /api/admin/upload-avatar
Authorization: Bearer ADMIN_TOKEN
Content-Type: multipart/form-data
```

**File field:**
| Key | Type | Value |
|-----|------|-------|
| avatar | File | select image |

---

## BunnyCDN Folder Structure

```
your-storage-zone/
├── books/
│   ├── covers/     ← Book cover images
│   └── pdfs/       ← Book PDF files
├── authors/        ← Author images
├── avatars/        ← User avatars
└── admins/
    └── avatars/    ← Admin avatars
```

---

## Important Notes

- PDF files are publicly accessible (no auth required)
- Images are served via CDN URL
- Files are named with random UUID to avoid conflicts
- Max file size: 10MB
- Supported: jpg, png, gif, pdf
