# Schema Sync Final Solution

## 🚨 Critical Issue Discovered

Your Prisma `schema.prisma` file does NOT match the actual database schema!

The database has many columns that are missing from your Prisma schema file:

### Examples of Mismatches:

**Appointments table in DB has:**
- `appointment_time`, `consultation_fee`, `consultation_type`, `full_name`, `phone`, `reminder_sms_*` fields

**Consultations table in DB has:**
- `additional_notes`, `blood_pressure`, `height`, `physical_examination`, `temperature`, `weight`, etc.

**Patients table in DB has:**
- `chronic_conditions`, `emergency_contact_name`, `emergency_contact_phone`, `notes`, `phone` (not `phoneNumber`)

**Medicines table in DB has:**
- `is_active` (not `isAvailable`), `stock_quantity` (not `quantity`), `unit`

---

## ✅ Solution: Pull Schema from Database

Instead of trying to push your schema to the database, **pull the actual database schema** into Prisma:

### Step 1: Backup Current Schema

```powershell
cd server
Copy-Item prisma\schema.prisma prisma\schema.prisma.backup
```

### Step 2: Pull Actual Database Schema

```powershell
npx prisma db pull
```

This will:
- ✅ Introspect your Supabase PostgreSQL database
- ✅ Generate accurate models matching all existing tables and columns
- ✅ Automatically add `@@schema("public")` decorators
- ✅ Include all foreign keys and relations
- ✅ Preserve all existing data

### Step 3: Review Changes

Open `schema.prisma` and compare with your backup:

```powershell
# View differences
code --diff prisma\schema.prisma.backup prisma\schema.prisma
```

### Step 4: Keep Important Manual Changes

From your backup schema, manually copy back:
- ✅ `previewFeatures = ["driverAdapters", "multiSchema"]`
- ✅ `directUrl = env("DIRECT_URL")`
- ✅ `schemas = ["public", "auth"]`
- ✅ Any custom comments or documentation

### Step 5: Generate Prisma Client

```powershell
npx prisma generate
```

### Step 6: Test Server

```powershell
npm run dev
```

---

## 🔧 Alternative: Keep Your Schema & Update Database

If you want to keep your current Prisma schema and update the database to match:

### ⚠️ WARNING: This will DROP existing columns and data!

```powershell
npx prisma db push --accept-data-loss --force-reset
```

This will:
- ❌ Drop all tables
- ❌ Lose ALL existing data
- ✅ Create new tables matching your Prisma schema
- ✅ Start with clean slate

**Only do this if:**
- You're in development
- All existing data is test data
- You have backups

---

## 🎯 Recommended Approach

**For Development/Production with Data:**

```powershell
# 1. Backup current schema
cd server
Copy-Item prisma\schema.prisma prisma\schema.prisma.backup

# 2. Pull actual database schema
npx prisma db pull

# 3. Manually merge your changes into the pulled schema:
#    - Add driverAdapters preview feature
#    - Add directUrl
#    - Add multiSchema and schemas array
#    - Add any custom comments

# 4. Generate client
npx prisma generate

# 5. Start server
npm run dev
```

**For Fresh Start (Test Environment):**

```powershell
cd server

# WARNING: Destroys all data!
npx prisma db push --force-reset

# Generate client
npx prisma generate

# Start server
npm run dev
```

---

## 📋 What to Do About Multi-Schema

### Current State:

Your database has:
- `public` schema: Your application tables
- `auth` schema: Supabase auth tables (managed by Supabase)

Foreign keys exist: `appointments.user_id` → `auth.users.id`

### Prisma Configuration:

After pulling the schema, ensure these settings:

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

// Models in public schema will have:
model StaffAccount {
  // ... fields ...
  
  @@map("staff_accounts")
  @@schema("public")
}

// Auth schema models should be ignored:
model User {
  // ... fields ...
  
  @@map("users")
  @@schema("auth")
  @@ignore  // Don't generate Prisma Client methods
}
```

---

## 🐛 Why This Happened

Your Prisma schema file was likely:
1. Manually created or partially created
2. Not kept in sync with database migrations
3. Missing many columns that exist in the actual database

When you tried `npx prisma db push`, it attempted to:
- Drop all the "extra" columns in the database
- Change data types
- Remove tables it doesn't know about

This would have caused massive data loss!

---

## ✅ Next Steps

1. **Decision Point:** Choose your approach based on environment:
   - **Development with test data?** → Use `db push --force-reset`
   - **Production or data matters?** → Use `db pull`

2. **After syncing schema:**
   ```powershell
   npx prisma validate
   npx prisma generate
   npm run dev
   ```

3. **Test endpoints:**
   - Login: `POST http://localhost:3000/api/auth/login`
   - Get staff: `GET http://localhost:3000/api/staff`
   - Create doctor: `POST http://localhost:3000/api/staff`

4. **Verify in UI:**
   - Open `http://localhost:8080`
   - Navigate to `/staff/admin`
   - Try creating a new doctor account

---

## 📝 Going Forward

### Keep Schema in Sync:

**Option 1: Use Prisma Migrate (Recommended)**

```powershell
# Create a new migration for changes
npx prisma migrate dev --name describe_your_change

# Apply migrations to production
npx prisma migrate deploy
```

**Option 2: Prisma Studio for Data**

```powershell
npx prisma studio
```

Provides a GUI for viewing/editing database records safely.

**Option 3: Regular Schema Pulls**

```powershell
# Periodically sync schema with database
npx prisma db pull
```

---

## 🎉 Expected Outcome

After following the recommended approach:

✅ Prisma schema matches your actual database
✅ All existing data preserved
✅ `npx prisma generate` works without errors
✅ Express server starts successfully  
✅ API endpoints function correctly
✅ Can create/read/update/delete staff accounts
✅ Doctor accounts created successfully
✅ Multi-schema support for Supabase auth

---

**Choose your path and execute the commands above!** 🚀
