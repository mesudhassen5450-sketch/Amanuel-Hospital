# Multi-Schema Fix for Supabase Auth Integration

## Problem

Getting error: `Foreign key constraint "appointments_user_id_fkey" cannot be implemented`

This happens because:
- Supabase has two schemas: `public` (your tables) and `auth` (Supabase auth users)
- Your database has foreign keys pointing to `auth.users`
- Prisma was only looking at `public` schema
- Need to enable multi-schema support

---

## ✅ Solution Applied

### Step 1: Enable Multi-Schema Preview Feature

**Updated `server/prisma/schema.prisma`:**

```prisma
generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["driverAdapters", "multiSchema"]  // Added multiSchema
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
  schemas   = ["public", "auth"]  // Added schemas array
}
```

### Step 2: Add Schema Decorators to All Models

Each model needs `@@schema("public")` at the end:

```prisma
model StaffAccount {
  // ... fields ...
  
  @@index([username])
  @@map("staff_accounts")
  @@schema("public")  // Added this line
}
```

---

## 🔧 Complete Fix Instructions

### Option 1: Manual Update (Recommended)

Add `@@schema("public")` to the end of EACH model in your schema file:

**Models to update (all 17):**
1. ✅ StaffAccount
2. Patient
3. Appointment
4. Consultation
5. ConsultationNote
6. ConsultationMessage
7. Call
8. LabRequest
9. LabResult
10. Medicine
11. Prescription
12. PrescriptionItem
13. DispenseLog
14. Payment
15. PushSubscription
16. Doctor
17. Department

**Example:**
```prisma
model Patient {
  id String @id @default(uuid())
  // ... all fields ...
  
  @@index([mrn])
  @@index([phoneNumber])
  @@map("patients")
  @@schema("public")  // <-- Add this line
}
```

### Option 2: Find & Replace (Quick)

Use your editor's find & replace:

**Find:** `@@map("`
**Replace:** `@@schema("public")\n  @@map("`

Then manually fix any formatting issues.

---

## 📋 Complete Schema Template

Here's how the top of your schema file should look:

```prisma
generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["driverAdapters", "multiSchema"]
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
  schemas   = ["public", "auth"]
}

// Example model with schema decorator
model StaffAccount {
  id           Int       @id @default(autoincrement())
  username     String    @unique
  passwordHash String    @map("password_hash")
  // ... other fields ...
  
  @@index([username])
  @@map("staff_accounts")
  @@schema("public")
}

model Patient {
  id String @id @default(uuid())
  // ... fields ...
  
  @@index([mrn])
  @@map("patients")
  @@schema("public")
}

// ... repeat for all 17 models
```

---

## 🚀 After Updating Schema

### Step 1: Validate Schema
```powershell
cd server
npx prisma validate
```

Expected output:
```
✔ Prisma schema loaded from prisma\schema.prisma
✔ The schema is valid
```

### Step 2: Generate Prisma Client
```powershell
npx prisma generate
```

Expected output:
```
✔ Generated Prisma Client to .\node_modules\@prisma\client
```

### Step 3: Try DB Push Again
```powershell
npx prisma db push
```

Should now work without the foreign key constraint error!

Expected output:
```
✔ Your database is now in sync with your Prisma schema
```

### Step 4: Restart Server
```powershell
npm run dev
```

---

## 🔍 Verification

### Check Multi-Schema is Working

```powershell
npx prisma studio
```

Should open successfully and show all tables from `public` schema.

### Test in Node
```javascript
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Should work without errors
console.log(prisma.staffAccount);
console.log(prisma.patient);
```

---

## 🐛 Troubleshooting

### Issue: "Preview feature 'multiSchema' not found"

**Fix:** Update Prisma:
```powershell
npm install prisma@latest @prisma/client@latest
npx prisma generate
```

### Issue: Still getting foreign key errors

**Debug:** Check if schema decorator is on ALL models:
```powershell
# Count how many times @@schema("public") appears
(Get-Content server\prisma\schema.prisma | Select-String "@@schema").Count
```

Should return: `17` (one for each model)

### Issue: "Ambiguous relation"

**Cause:** Multiple schemas confusing Prisma relations

**Fix:** Add explicit schema to relation fields:
```prisma
model Appointment {
  patient Patient? @relation(fields: [patientId], references: [id])
  // Both models should have @@schema("public")
}
```

---

## 📝 Why This Is Needed

### Supabase Database Structure:

```
postgres (database)
├── public (schema)
│   ├── staff_accounts
│   ├── patients
│   ├── appointments
│   └── ... (your 17 tables)
├── auth (schema)
│   ├── users (Supabase managed)
│   ├── sessions
│   └── ... (Supabase auth tables)
└── storage (schema)
    └── ... (Supabase storage)
```

### Foreign Key References:

Some of your tables may have foreign keys like:
```sql
ALTER TABLE appointments 
  ADD CONSTRAINT appointments_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES auth.users(id);
```

Without multi-schema support, Prisma can't see the `auth.users` table, causing the push to fail.

---

## ✅ Expected Result

After applying this fix:

- ✅ `npx prisma db push` works without errors
- ✅ All 17 tables sync correctly
- ✅ Foreign keys to `auth` schema are preserved
- ✅ Prisma Client generates successfully
- ✅ Express server starts without issues
- ✅ Can create/read/update/delete staff accounts
- ✅ Can create doctor accounts

---

## 🚀 Quick Fix Checklist

To complete this fix:

- [ ] ✅ Updated `generator` block with `multiSchema` feature
- [ ] ✅ Updated `datasource` block with `schemas = ["public", "auth"]`
- [ ] Add `@@schema("public")` to StaffAccount ✅ (already done)
- [ ] Add `@@schema("public")` to Patient
- [ ] Add `@@schema("public")` to Appointment
- [ ] Add `@@schema("public")` to Consultation
- [ ] Add `@@schema("public")` to ConsultationNote
- [ ] Add `@@schema("public")` to ConsultationMessage
- [ ] Add `@@schema("public")` to Call
- [ ] Add `@@schema("public")` to LabRequest
- [ ] Add `@@schema("public")` to LabResult
- [ ] Add `@@schema("public")` to Medicine
- [ ] Add `@@schema("public")` to Prescription
- [ ] Add `@@schema("public")` to PrescriptionItem
- [ ] Add `@@schema("public")` to DispenseLog
- [ ] Add `@@schema("public")` to Payment
- [ ] Add `@@schema("public")` to PushSubscription
- [ ] Add `@@schema("public")` to Doctor
- [ ] Add `@@schema("public")` to Department
- [ ] Run `npx prisma validate`
- [ ] Run `npx prisma generate`
- [ ] Run `npx prisma db push`
- [ ] Start server and test

---

## 📞 Alternative: Pull Schema from Database

If manual updates are too tedious:

```powershell
# Backup current schema
Copy-Item server\prisma\schema.prisma server\prisma\schema.prisma.backup

# Pull schema from database (will add @@schema automatically)
npx prisma db pull

# Review changes and merge with your backup if needed
```

**Note:** `db pull` will overwrite your schema file, so backup first!

---

**After adding `@@schema("public")` to all models, your multi-schema setup will be complete!** 🎉
