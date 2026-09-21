# Ads API - Postman Examples

Base URL: `http://localhost:3000`

---

## Available Slots

| Slot | Location |
|------|----------|
| `HOME_BANNER` | Main banner on home page |
| `HOME_MIDDLE` | Middle of home page |
| `BOOKS_TOP` | Top of books page |
| `BOOKS_BOTTOM` | Bottom of books page |
| `AUDIOBOOKS_TOP` | Top of audiobooks page |
| `VIDEOS_TOP` | Top of videos page |
| `SIDEBAR` | Sidebar |
| `POPUP` | Popup dialog |

---

## 1. Get Ads by Slot (Public)

```
GET /api/ads/slot/HOME_BANNER
```

Returns only active ads within their date range.

**Response:**
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "id": 1,
      "title": "Summer Sale",
      "image": "https://elragaa.b-cdn.net/ads/uuid.jpg",
      "link": "https://example.com/sale",
      "slot": "HOME_BANNER",
      "isActive": true,
      "startDate": "2024-06-01T00:00:00.000Z",
      "endDate": "2024-08-31T00:00:00.000Z"
    }
  ]
}
```

---

## 2. Get All Ads (Admin Only)

```
GET /api/ads
Authorization: Bearer ADMIN_TOKEN
```

---

## 3. Get Ad by ID

```
GET /api/ads/1
```

---

## 4. Create Ad (Admin Only)

```
POST /api/ads
Authorization: Bearer ADMIN_TOKEN
Content-Type: multipart/form-data
```

**Bulk Edit:**
```
title:Summer Sale
link:https://example.com/sale
slot:HOME_BANNER
isActive:true
startDate:2024-06-01
endDate:2024-08-31
```

**File field:**
| Key | Type | Value |
|-----|------|-------|
| image | File | [select image] |

**Response (201):**
```json
{
  "success": true,
  "message": "Ad created successfully",
  "data": {
    "id": 1,
    "title": "Summer Sale",
    "image": "https://elragaa.b-cdn.net/ads/uuid.jpg",
    "link": "https://example.com/sale",
    "slot": "HOME_BANNER",
    "isActive": true,
    "startDate": "2024-06-01T00:00:00.000Z",
    "endDate": "2024-08-31T00:00:00.000Z"
  }
}
```

---

## 5. Update Ad (Admin Only)

```
PUT /api/ads/1
Authorization: Bearer ADMIN_TOKEN
Content-Type: multipart/form-data
```

**Bulk Edit (optional fields):**
```
title:Updated Ad Title
isActive:false
endDate:2024-07-31
```

---

## 6. Delete Ad (Admin Only)

```
DELETE /api/ads/1
Authorization: Bearer ADMIN_TOKEN
```

---

## Quick Copy Examples

**Home Banner Ad:**
```
title:New Books Available
link:https://example.com/new-books
slot:HOME_BANNER
isActive:true
startDate:2024-01-01
endDate:2024-12-31
```

**Popup Ad:**
```
title:Subscribe Now
link:https://example.com/subscribe
slot:POPUP
isActive:true
```

**Books Page Ad:**
```
title:Special Discount on Books
link:https://example.com/discount
slot:BOOKS_TOP
isActive:true
startDate:2024-06-01
endDate:2024-06-30
```

---

## Notes

- `startDate` and `endDate` are optional
- If no dates set, ad is always shown (when `isActive: true`)
- Only active ads within date range are returned in public endpoint
- `isActive: false` hides the ad without deleting it
