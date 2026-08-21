# 🔧 Troubleshooting 403 Forbidden Errors

## Problem
Getting "403 Forbidden - Access denied: Insufficient permissions for this department" when accessing staff management features.

---

## ✅ Root Causes & Solutions

### 1. **Old Token with Lowercase Role** (Most Common)
**Symptom:** Admin user gets 403 errors despite having ADMIN role in database

**Cause:** User logged in before role normalization was implemented. Token contains lowercase "admin" instead of "ADMIN"

**Solution:** 
```bash
# Force logout and login again
1. Open browser DevTools (F12)
2. Go to Console tab
3. Run: localStorage.clear()
4. Refresh page and log in again
```

---

### 2. **Database Role is Lowercase**
**Symptom:** Even after fresh login, still getting 403 errors

**Cause:** Database record has `role: "admin"` (lowercase) instead of `role: "ADMIN"` (uppercase)

**Solution:**
```bash
# Reseed database with correct uppercase roles
cd server
npm run seed
```

Or manually update in database:
```sql
UPDATE staff_accounts SET role = 'ADMIN' WHERE username = 'admin';
```

---

### 3. **No Authentication Token**
**Symptom:** Console shows `hasToken: false` in API request logs

**Cause:** User not logged in or token was cleared

**Solution:**
- Log in through `/staff/login`
- Check browser console for login errors

---

### 4. **Expired Token**
**Symptom:** Token exists but requests fail with 401 or 403

**Cause:** JWT token expired (default: 24 hours)

**Solution:**
- Log out and log in again
- Token will auto-refresh on login

---

## 🔍 Debugging Tools

### Check Your Current Token

**In Browser Console:**
```javascript
// Get your token
const token = localStorage.getItem('token') || localStorage.getItem('auth_token');
console.log('Token:', token);

// Decode token (without verification)
const payload = JSON.parse(atob(token.split('.')[1]));
console.log('Decoded:', payload);

// Check role
console.log('Role:', payload.role);
console.log('Is uppercase?', payload.role === payload.role.toUpperCase());
```

**On Server (Detailed Verification):**
```bash
cd server

# Get token from browser localStorage
# Then run:
npx tsx src/utils/verify-token.ts <YOUR_TOKEN_HERE>

# This will show:
# - Token validity
# - User info (id, username, role)
# - Expiration date
# - Role case warning if needed
```

---

## 📋 Verification Checklist

Before reporting a bug, verify:

- [ ] Cleared localStorage and logged in again
- [ ] Database admin user has `role: 'ADMIN'` (uppercase)
- [ ] Backend server is running on correct port
- [ ] `.env` has correct `VITE_API_URL` (without `/api` suffix)
- [ ] Browser console shows `hasToken: true` in API requests
- [ ] Network tab shows `Authorization: Bearer ...` header
- [ ] Server logs don't show JWT errors

---

## 🔐 Expected Behavior

### Successful Admin Request
```
Console Output:
  [API Request] { path: '/api/staff', hasToken: true, tokenPrefix: 'eyJhbGciOiJIUzI1NiIsIn...' }
  
Network Headers:
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  
Response:
  Status: 200 OK
  Body: { success: true, staff: [...], count: 6 }
```

### Failed Request (403)
```
Console Output:
  [API Request] { path: '/api/staff', hasToken: true, tokenPrefix: 'eyJhbGciOiJIUzI1NiIsIn...' }
  [API Error] { 
    status: 403, 
    statusText: 'Forbidden',
    error: 'Access denied: Insufficient permissions for this department.'
  }
```

**If you see 403:** Token role doesn't match. Decode token to verify role is "ADMIN" (uppercase).

---

## 🛠️ Backend Configuration

### Middleware (Already Configured)
File: `server/src/middlewares/auth.middleware.ts`

```typescript
export const authorizeRoles = (...roles: string[]) => {
  return (req, res, next) => {
    const userRole = req.user.role?.toUpperCase();
    const normalizedAllowedRoles = roles.map(r => r.toUpperCase());
    
    // ADMIN has global access
    if (userRole === 'ADMIN' || 
        userRole === 'ADMINISTRATOR' || 
        normalizedAllowedRoles.includes(userRole)) {
      return next();
    }
    
    return res.status(403).json({
      message: 'Access denied: Insufficient permissions for this department.'
    });
  };
};
```

### Routes (Already Configured)
File: `server/src/routes/staff.routes.ts`

All staff routes require `authorizeRoles('ADMIN')`:
- ✅ GET `/api/staff` - Fetch all
- ✅ POST `/api/staff` - Create  
- ✅ PUT `/api/staff/:id` - Update
- ✅ PUT `/api/staff/:id/password` - Reset password
- ✅ PATCH `/api/staff/:id/status` - Toggle status
- ✅ DELETE `/api/staff/:id` - Delete

---

## 📞 Still Having Issues?

1. **Check browser console** - Copy any errors
2. **Check server logs** - Look for JWT or auth errors
3. **Verify token** - Use `verify-token.ts` script
4. **Check database** - Verify admin user role is 'ADMIN'

If issue persists after:
- Clearing localStorage
- Reseeding database
- Logging in fresh

Then check:
- CORS configuration
- JWT_SECRET matches between env files
- Server and frontend are on same domain or CORS is properly configured

---

## 🎯 Quick Fix (90% of Cases)

```bash
# This fixes most 403 issues:

# 1. Clear browser storage
Open DevTools > Console:
  localStorage.clear()
  sessionStorage.clear()

# 2. Reseed database (optional, if role is lowercase)
cd server
npm run seed

# 3. Restart server
npm run dev

# 4. Refresh browser and login again
```

**Expected result:** All staff management features work without 403 errors.
