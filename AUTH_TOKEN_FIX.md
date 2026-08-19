# Authentication Token Fix

## Problem
The JWT token wasn't being saved to `localStorage` during login, causing all API calls to fail with:
```
Authorization: Bearer undefined
401 Access denied. No token provided
```

## Solution Applied

### Updated `src/lib/staff-auth.tsx`

#### 1. **Login Function** - Now uses Express API and saves token
```typescript
const login = async (username: string, password: string) => {
  // Call Express /api/auth/login
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  const result = await response.json();

  if (response.ok && result.success && result.token) {
    // ✅ Save JWT token to localStorage
    localStorage.setItem('token', result.token);
    
    // Save session to sessionStorage
    // ...
  }
}
```

#### 2. **Logout Function** - Clears token
```typescript
const logout = async () => {
  // ✅ Clear JWT token from localStorage
  localStorage.removeItem('token');
  
  clearSession();
  // ...
}
```

#### 3. **Session Expiry** - Clears token on timeout
```typescript
const expireSession = useCallback(() => {
  // ✅ Clear JWT token
  localStorage.removeItem('token');
  
  clearSession();
  // ...
}, []);
```

## How It Works Now

### Login Flow:
1. User enters credentials on `/staff/login`
2. Frontend calls `POST /api/auth/login`
3. Backend validates credentials and returns:
   ```json
   {
     "success": true,
     "token": "eyJhbGc...",
     "user": {
       "id": "...",
       "username": "admin",
       "role": "admin",
       "displayName": "Administrator"
     }
   }
   ```
4. **Token saved to `localStorage.setItem('token', token)`**
5. Session info saved to `sessionStorage`
6. User redirected to dashboard

### API Call Flow:
1. User navigates to `/staff/admin`
2. Component calls `StaffAPI.getAllStaffAccounts()`
3. API service reads token: `localStorage.getItem('token')`
4. Request sent with header: `Authorization: Bearer <token>`
5. Express validates token and returns data

### Logout Flow:
1. User clicks logout
2. Token removed from localStorage
3. Session cleared from sessionStorage
4. Redirect to login page

## Testing Steps

1. **Clear existing storage:**
   ```javascript
   // In browser console:
   localStorage.clear();
   sessionStorage.clear();
   ```

2. **Login again:**
   - Go to `/staff/login`
   - Enter credentials (e.g., admin / your_password)
   - Click login

3. **Verify token is saved:**
   ```javascript
   // In browser console:
   console.log(localStorage.getItem('token'));
   // Should output: "eyJhbGc..."
   ```

4. **Test staff management:**
   - Navigate to `/staff/admin`
   - Should see staff list load successfully
   - Try create, update, delete operations

## Troubleshooting

### Still getting 401 errors?
```javascript
// Check if token exists:
console.log('Token:', localStorage.getItem('token'));

// Check if it's valid JWT:
const token = localStorage.getItem('token');
if (token) {
  const parts = token.split('.');
  console.log('Token parts:', parts.length); // Should be 3
  console.log('Payload:', JSON.parse(atob(parts[1]))); // Decode payload
}
```

### Token expired?
- JWT tokens expire after 24 hours (configured in `server/src/utils/auth.ts`)
- Simply logout and login again to get a new token

### CORS errors?
- Ensure `server/.env` has: `CORS_ORIGIN="http://localhost:8080"`
- Restart the Express server after changing .env

## Files Modified

1. ✅ `src/lib/staff-auth.tsx` - Updated login/logout to use Express API and manage localStorage token
2. ✅ `server/.env` - Fixed CORS_ORIGIN to match frontend URL

## Next Steps

After implementing this fix:
1. ✅ Restart the Express server
2. ✅ Refresh the frontend
3. ✅ Logout (to clear old session)
4. ✅ Login again (to get new token)
5. ✅ Test all staff management operations

The authentication flow now fully integrates with the Express backend API!
