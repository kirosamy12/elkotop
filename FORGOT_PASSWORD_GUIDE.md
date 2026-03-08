# Forgot Password - Complete Postman Guide

This guide shows you step-by-step how to test the forgot password feature in Postman.

---

## Prerequisites

1. Make sure your server is running: `npm start`
2. Have a registered user account with a valid email
3. Configure Gmail in `.env` file:
   ```env
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASSWORD=your_16_character_app_password
   ```

---

## Step 1: Request Reset Code

### Endpoint
```
POST http://localhost:5000/api/auth/forgot-password
```

### Postman Setup:
1. Create a new request
2. Set method to `POST`
3. Enter URL: `http://localhost:5000/api/auth/forgot-password`
4. Go to "Headers" tab
5. Add header:
   - Key: `Content-Type`
   - Value: `application/json`
6. Go to "Body" tab
7. Select "raw"
8. Select "JSON" from dropdown
9. Enter:

```json
{
  "email": "john.doe@example.com"
}
```

### Click "Send"

### Expected Response (200 OK):
```json
{
  "success": true,
  "message": "Reset code sent to your email"
}
```

### What Happens:
- System generates a 5-digit code (e.g., 12345)
- Code is hashed and stored in database
- Email is sent to the user with the code
- Code expires in 10 minutes

### Check Your Email:
You should receive an email like this:

```
Subject: Password Reset Code

Hello John,

You requested to reset your password. Use the code below to reset your password:

┌─────────────────┐
│     12345       │
└─────────────────┘

This code will expire in 10 minutes.

If you didn't request this, please ignore this email.
```

---

## Step 2 (Optional): Verify Reset Code

This step is optional. You can skip to Step 3 if you want.

### Endpoint
```
POST http://localhost:5000/api/auth/verify-code
```

### Postman Setup:
1. Create a new request
2. Set method to `POST`
3. Enter URL: `http://localhost:5000/api/auth/verify-code`
4. Go to "Headers" tab
5. Add header:
   - Key: `Content-Type`
   - Value: `application/json`
6. Go to "Body" tab
7. Select "raw"
8. Select "JSON" from dropdown
9. Enter (use the code from your email):

```json
{
  "email": "john.doe@example.com",
  "code": "12345"
}
```

### Click "Send"

### Expected Response (200 OK):
```json
{
  "success": true,
  "message": "Code verified successfully"
}
```

### Possible Errors:

**Invalid or Expired Code (400 Bad Request):**
```json
{
  "success": false,
  "message": "Invalid or expired reset code"
}
```

---

## Step 3: Reset Password

### Endpoint
```
POST http://localhost:5000/api/auth/reset-password
```

### Postman Setup:
1. Create a new request
2. Set method to `POST`
3. Enter URL: `http://localhost:5000/api/auth/reset-password`
4. Go to "Headers" tab
5. Add header:
   - Key: `Content-Type`
   - Value: `application/json`
6. Go to "Body" tab
7. Select "raw"
8. Select "JSON" from dropdown
9. Enter (use the code from your email):

```json
{
  "email": "john.doe@example.com",
  "code": "12345",
  "newPassword": "mynewpassword123"
}
```

### Click "Send"

### Expected Response (200 OK):
```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

### What Happens:
- System verifies the code
- Password is updated and hashed
- Reset code is deleted from database
- User can now sign in with new password

### Possible Errors:

**Invalid or Expired Code (400 Bad Request):**
```json
{
  "success": false,
  "message": "Invalid or expired reset code"
}
```

**Password Too Short (400 Bad Request):**
```json
{
  "success": false,
  "message": "Password must be at least 6 characters"
}
```

**Missing Fields (400 Bad Request):**
```json
{
  "success": false,
  "message": "Please provide email, code, and new password"
}
```

---

## Step 4: Sign In with New Password

### Endpoint
```
POST http://localhost:5000/api/auth/signin
```

### Postman Setup:
1. Create a new request
2. Set method to `POST`
3. Enter URL: `http://localhost:5000/api/auth/signin`
4. Go to "Headers" tab
5. Add header:
   - Key: `Content-Type`
   - Value: `application/json`
6. Go to "Body" tab
7. Select "raw"
8. Select "JSON" from dropdown
9. Enter (use your NEW password):

```json
{
  "email": "john.doe@example.com",
  "password": "mynewpassword123"
}
```

### Click "Send"

### Expected Response (200 OK):
```json
{
  "success": true,
  "message": "Signed in successfully",
  "data": {
    "user": {
      "id": "65f1a2b3c4d5e6f7g8h9i0j1",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "avatar": "",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

✅ Success! You've successfully reset your password and signed in.

---

## Complete Flow Summary

```
1. User forgets password
   ↓
2. POST /api/auth/forgot-password
   → Email sent with 5-digit code
   ↓
3. User checks email and gets code
   ↓
4. (Optional) POST /api/auth/verify-code
   → Verify code is valid
   ↓
5. POST /api/auth/reset-password
   → Password updated
   ↓
6. POST /api/auth/signin
   → Sign in with new password
   ✓ Done!
```

---

## Testing Tips

### Test Case 1: Valid Flow
- Use a real email you have access to
- Follow all steps in order
- Should work perfectly

### Test Case 2: Expired Code
- Request a code
- Wait 11 minutes
- Try to reset password
- Should get "Invalid or expired reset code"

### Test Case 3: Wrong Code
- Request a code
- Use a different code (e.g., 99999)
- Try to reset password
- Should get "Invalid or expired reset code"

### Test Case 4: Invalid Email
- Use an email that doesn't exist
- Request reset code
- Should get "No user found with this email"

### Test Case 5: Short Password
- Request code
- Try to reset with password "123" (less than 6 chars)
- Should get "Password must be at least 6 characters"

---

## Troubleshooting

### Email Not Received?

1. **Check Gmail Configuration:**
   - Make sure you're using App Password, not regular password
   - Remove spaces from app password
   - Enable 2-Factor Authentication first

2. **Check Spam Folder:**
   - Email might be in spam/junk folder

3. **Check Server Logs:**
   - Look for email sending errors in console

4. **Test Email Configuration:**
   ```javascript
   // Add this to test email
   console.log('EMAIL_USER:', process.env.EMAIL_USER);
   console.log('EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? 'Set' : 'Not Set');
   ```

### Code Not Working?

1. **Check Expiration:**
   - Code expires in 10 minutes
   - Request a new code if expired

2. **Check Email Match:**
   - Email must match exactly
   - Check for typos

3. **Check Code:**
   - Code is case-sensitive (numbers only)
   - Copy-paste from email to avoid typos

---

## Gmail App Password Setup

### Step-by-Step:

1. **Enable 2-Factor Authentication:**
   - Go to: https://myaccount.google.com/security
   - Click "2-Step Verification"
   - Follow the setup process

2. **Generate App Password:**
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" from dropdown
   - Select "Other (Custom name)"
   - Enter "Node Auth App"
   - Click "Generate"
   - Copy the 16-character password (remove spaces)

3. **Update .env:**
   ```env
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASSWORD=abcdefghijklmnop
   ```

4. **Restart Server:**
   ```bash
   npm start
   ```

---

## Security Notes

- Reset codes are hashed before storing in database
- Codes expire after 10 minutes
- Each code can only be used once
- Old codes are automatically deleted after use
- Passwords are hashed with bcrypt before storing

---

## Need Help?

If you encounter any issues:
1. Check server console for errors
2. Verify .env configuration
3. Test with a real email you can access
4. Make sure MongoDB is running
5. Check that all dependencies are installed: `npm install`
