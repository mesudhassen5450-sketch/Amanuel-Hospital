# Prisma Client Setup Fix

## Problem
Getting `500 Internal Server Error` with:
```
Cannot read properties of undefined (reading 'staffAccount')
```

This means the Prisma client wasn't properly initialized/exported.

## Solution Applied

### 1. Created Proper Prisma Client (`server/src/config/db.ts`)
```typescript
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

// Singleton pattern to prevent multiple Prisma instances
declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma = global.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export default prisma;
```

### 2. Also Created Alternative Path (`server/src/lib/prisma.ts`)
Same content as above, for flexibility in imports.

### 3. Updated Auth Controller ID Type
Ensured token generation uses string ID (UUID from schema).

## How to Fix

### Step 1: Stop the Server
Press `Ctrl+C` to stop the current Express server.

### Step 2: Regenerate Prisma Client
```powershell
cd server
npx prisma generate
```

**If you get permission errors:**
1. Close any running Node processes
2. Close your IDE/editor
3. Run as Administrator:
   ```powershell
   Remove-Item -Recurse -Force node_modules\.prisma
   npx prisma generate
   ```

### Step 3: Verify Prisma Client Generated
Check that this file exists:
```
server/node_modules/.prisma/client/index.d.ts
```

### Step 4: Restart the Server
```powershell
npm run dev
```

### Step 5: Test Login
1. Go to `/staff/login`
2. Enter credentials
3. Should now get JWT token without 500 error

## Verification Checklist

✅ **Prisma Client Exports:**
```typescript
// server/src/config/db.ts should export:
export const prisma = new PrismaClient();
export default prisma;
```

✅ **Auth Controller Imports:**
```typescript
import { prisma } from '../config/db.js';
// OR
import prisma from '../config/db.js';
```

✅ **Prisma Schema Model Name:**
```prisma
model StaffAccount {
  id String @id @default(uuid())
  // ...
}
```

✅ **Controller Usage:**
```typescript
const staff = await prisma.staffAccount.findUnique({ 
  where: { username } 
});
```

## Common Issues

### Issue: `prisma is undefined`
**Cause:** Import path doesn't match export
**Fix:** Use `import prisma from '../config/db.js'` or `import { prisma } from '../config/db.js'`

### Issue: `staffAccount is not a function`
**Cause:** Prisma client not generated
**Fix:** Run `npx prisma generate` in server folder

### Issue: `EPERM: operation not permitted`
**Cause:** File is locked by another process
**Fix:** 
1. Close VS Code
2. Kill all node processes: `taskkill /F /IM node.exe`
3. Delete `.prisma` folder: `Remove-Item -Recurse -Force node_modules\.prisma`
4. Regenerate: `npx prisma generate`

### Issue: Model name mismatch
**Schema:** `model StaffAccount`
**Usage:** `prisma.staffAccount` (camelCase first letter!)

## Environment Check

Before running the server, verify:

### 1. `.env` file exists in `server/` folder:
```env
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
PORT=3001
JWT_SECRET=amanuel_hospital_secure_jwt_secret_2026_key
CORS_ORIGIN="http://localhost:8080"
```

### 2. Prisma schema is valid:
```powershell
cd server
npx prisma validate
```

### 3. Database is accessible:
```powershell
npx prisma db pull
```

## Testing the Fix

### 1. Check Prisma Client in Node REPL:
```powershell
cd server
node
```

```javascript
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
console.log(prisma.staffAccount); // Should show object with methods
```

### 2. Test Login Endpoint with curl:
```powershell
curl -X POST http://localhost:3001/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{\"username\":\"admin\",\"password\":\"your_password\"}'
```

Should return:
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

### 3. Check Server Logs:
After restarting, you should see Prisma queries in the log (if `log: ['query']` is enabled):
```
prisma:query SELECT * FROM "staff_accounts" WHERE "username" = $1
```

## Files Modified

1. ✅ `server/src/config/db.ts` - Added Prisma client initialization
2. ✅ `server/src/lib/prisma.ts` - Alternative import path (NEW)
3. ✅ `server/src/controllers/auth.controller.ts` - Ensured correct ID type

## Next Steps

After implementing this fix:
1. ✅ Run `npx prisma generate` in server folder
2. ✅ Restart Express server
3. ✅ Test login endpoint
4. ✅ Verify JWT token is returned
5. ✅ Test staff management API

The Prisma client should now work correctly with your Express backend!
