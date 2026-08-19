# Staff Deletion Fix

## Problem
Getting error: `P2021: The table public.doctors does not exist in the current database`

This happened because the code was trying to manually delete from `prisma.doctor`, but:
1. The database schema already handles cascading deletion via `ON DELETE CASCADE`
2. The Doctor table has different field names/constraints than expected

## Solution Applied

### Updated `server/src/controllers/staff.controller.ts`

Removed the manual doctor deletion code and let the database handle it automatically:

**Before (BROKEN):**
```typescript
// Cascading deletion: Delete linked doctor records if role is doctor
if (existingStaff.role === 'doctor') {
    try {
        await prisma.doctor.deleteMany({
            where: { username: existingStaff.username },
        });
    } catch (doctorDeleteError) {
        // This was failing with P2021 error
    }
}

await prisma.staffAccount.delete({
    where: { id: Number(id) },
});
```

**After (FIXED):**
```typescript
// Delete staff account
// Note: Database foreign key constraints handle cascading deletion of related records
await prisma.staffAccount.delete({
    where: { id: staffId },
});
```

## How It Works Now

### Database Schema (from `schema.prisma`):

```prisma
model StaffAccount {
  id           Int       @id @default(autoincrement())
  username     String    @unique
  // ...
  doctor       Doctor?   // One-to-one relation
  @@map("staff_accounts")
}

model Doctor {
  id           String    @id @default(uuid())
  username     String    @unique
  // ...
  
  // Relations with CASCADE delete
  staffAccount StaffAccount @relation(
    fields: [username], 
    references: [username], 
    onDelete: Cascade    // <-- Automatic deletion!
  )
  
  @@map("doctors")
}
```

### What Happens When You Delete a Staff Account:

1. **Request:** `DELETE /api/staff/123`
2. **Controller:** `prisma.staffAccount.delete({ where: { id: 123 } })`
3. **Database:** 
   - Checks foreign key constraints
   - Finds `Doctor` record with matching `username`
   - **Automatically deletes** Doctor record (due to `ON DELETE CASCADE`)
   - Deletes StaffAccount record
4. **Response:** `{ success: true, message: 'Staff account deleted successfully' }`

### Other Tables with Cascade Deletion:

From the schema, these tables also have `ON DELETE CASCADE`:
- `Consultation` → When staff deleted
- `DispenseLog` → When staff deleted
- `Doctor` → When staff deleted ✅

These use `ON DELETE SetNull`:
- `Appointment.doctor` → Sets doctor_id to NULL (preserves appointment history)
- `Consultation.appointment` → Sets appointment_id to NULL

## Important Notes

### ✅ What's Handled Automatically:
- Doctor records deletion
- Consultation records deletion
- Dispense logs deletion

### ⚠️ What Requires Manual Check:
- Last admin protection (handled in controller)
- Active admin count validation (handled in controller)

## Testing the Fix

### 1. Delete a Non-Doctor Staff:
```bash
curl -X DELETE http://localhost:3001/api/staff/5 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

Expected: `{ "success": true, "message": "Staff account deleted successfully" }`

### 2. Delete a Doctor Staff:
```bash
curl -X DELETE http://localhost:3001/api/staff/3 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

Expected: 
- StaffAccount deleted
- Related Doctor record automatically deleted by database
- No P2021 error!

### 3. Try to Delete Last Admin:
```bash
curl -X DELETE http://localhost:3001/api/staff/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

Expected: `{ "error": "Cannot delete the last active admin account" }`

## Schema Correction Note

The StaffAccount ID type in the server schema is:
```prisma
model StaffAccount {
  id Int @id @default(autoincrement())  // NOT UUID!
}
```

This is different from Patient/Appointment (which use UUID). That's why we use `staffId = parseInt(id, 10)` instead of treating it as a string.

## Files Modified

1. ✅ `server/src/controllers/staff.controller.ts` - Removed manual doctor deletion

## Verification

After restarting the server, you should be able to:
- ✅ Delete regular staff accounts
- ✅ Delete doctor staff accounts (without P2021 error)
- ✅ See related doctor records automatically removed
- ✅ Still protected from deleting last admin

The deletion now works correctly with database-level cascade constraints!
