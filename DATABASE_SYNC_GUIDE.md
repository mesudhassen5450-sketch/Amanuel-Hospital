# Database Schema Sync Guide

## 🚨 Problem

Running `npx prisma db push` fails because:
- Database has existing data (3 consultations, 4 lab requests, 20 medicines, etc.)
- Schema adds new **required** fields without defaults
- Existing rows can't satisfy the new constraints

---

## ✅ Solution: Make New Fields Optional

To preserve existing data, we need to make these fields optional (nullable):

### Fields to Update:

1. **Consultation** model:
   - `doctorId String @map("doctor_id")` → `doctorId String? @map("doctor_id")`

2. **DispenseLog** model:
   - `medicineId String? @map("medicine_id")` → Already optional ✓
   - `dispensedBy String @map("dispensed_by")` → `dispensedBy String? @map("dispensed_by")`
   - `quantity Int` → `quantity Int?`
   - `totalPrice Float @map("total_price")` → `totalPrice Float? @map("total_price")`

3. **LabRequest** model:
   - `requestedBy String @map("requested_by")` → `requestedBy String? @map("requested_by")`
   - `testType String @map("test_type")` → `testType String? @map("test_type")`

4. **LabResult** model:
   - `parameterName String @map("parameter_name")` → `parameterName String? @map("parameter_name")`
   - `testedBy String @map("tested_by")` → `testedBy String? @map("tested_by")`

5. **Medicine** model:
   - `code String @unique` → `code String? @unique`
   - `unitPrice Float @map("unit_price")` → `unitPrice Float? @map("unit_price")`

6. **Patient** model:
   - `gender String` → `gender String?`

7. **PrescriptionItem** model:
   - `medicineId String? @map("medicine_id")` → Already optional ✓

8. **Prescription** model:
   - ✅ Already fixed: `prescribedBy String? @map("prescribed_by")`

---

## 🔧 Quick Fix Commands

### Option 1: Automated PowerShell Script

Save this as `fix-schema.ps1`:

```powershell
$schemaPath = "server\prisma\schema.prisma"
$content = Get-Content $schemaPath -Raw

# Make fields optional
$replacements = @{
    'doctorId\s+String\s+@map\("doctor_id"\)' = 'doctorId      String?  @map("doctor_id")'
    'dispensedBy\s+String\s+@map\("dispensed_by"\)' = 'dispensedBy   String?  @map("dispensed_by")'
    'quantity\s+Int(?!\?)' = 'quantity      Int?'
    'totalPrice\s+Float\s+@map\("total_price"\)' = 'totalPrice    Float?   @map("total_price")'
    'requestedBy\s+String\s+@map\("requested_by"\)' = 'requestedBy   String?  @map("requested_by")'
    'testType\s+String\s+@map\("test_type"\)' = 'testType      String?  @map("test_type")'
    'parameterName\s+String\s+@map\("parameter_name"\)' = 'parameterName String?  @map("parameter_name")'
    'testedBy\s+String\s+@map\("tested_by"\)' = 'testedBy      String?  @map("tested_by")'
    'code\s+String\s+@unique(?!\?)' = 'code          String?  @unique'
    'unitPrice\s+Float\s+@map\("unit_price"\)' = 'unitPrice     Float?   @map("unit_price")'
    'gender\s+String(?!\?)(?!\s+@)' = 'gender        String?'
}

foreach ($pattern in $replacements.Keys) {
    $replacement = $replacements[$pattern]
    $content = $content -replace $pattern, $replacement
}

$content | Set-Content $schemaPath -Encoding UTF8
Write-Host "✅ Schema updated successfully!"
```

Run:
```powershell
.\fix-schema.ps1
```

### Option 2: Manual Updates

Open `server/prisma/schema.prisma` and update these specific lines:

#### Consultation Model (~line 90)
```prisma
// Change this:
doctorId      String   @map("doctor_id")

// To this:
doctorId      String?  @map("doctor_id")
```

#### DispenseLog Model (~line 330)
```prisma
// Change these:
dispensedBy   String   @map("dispensed_by")
quantity      Int
totalPrice    Float    @map("total_price")

// To these:
dispensedBy   String?  @map("dispensed_by")
quantity      Int?
totalPrice    Float?   @map("total_price")
```

#### LabRequest Model (~line 190)
```prisma
// Change these:
requestedBy   String   @map("requested_by")
testType      String   @map("test_type")

// To these:
requestedBy   String?  @map("requested_by")
testType      String?  @map("test_type")
```

#### LabResult Model (~line 210)
```prisma
// Change these:
parameterName String   @map("parameter_name")
testedBy      String   @map("tested_by")

// To these:
parameterName String?  @map("parameter_name")
testedBy      String?  @map("tested_by")
```

#### Medicine Model (~line 240)
```prisma
// Change these:
code          String   @unique
unitPrice     Float    @map("unit_price")

// To these:
code          String?  @unique
unitPrice     Float?   @map("unit_price")
```

#### Patient Model (~line 50)
```prisma
// Change this:
gender        String

// To this:
gender        String?
```

---

## 🚀 After Making Changes

### Step 1: Validate Schema
```powershell
cd server
npx prisma validate
```

Expected: `✔ The schema is valid`

### Step 2: Generate Prisma Client
```powershell
npx prisma generate
```

Expected: `✔ Generated Prisma Client`

### Step 3: Push to Database
```powershell
npx prisma db push
```

Expected: `✔ Your database is now in sync with your Prisma schema`

### Step 4: Start Server
```powershell
npm run dev
```

---

## 🔄 Alternative: Reset Database (Nuclear Option)

If you don't need the existing test data:

```powershell
# WARNING: This deletes ALL data!
cd server
npx prisma db push --accept-data-loss
```

Then manually re-seed your database with test data.

---

## 📊 Current Database State

Based on the error message, your database contains:
- 3 consultations
- 1 dispense log
- 4 lab requests  
- 3 lab results
- 20 medicines
- 1+ patients
- 1+ prescription items

Making fields optional preserves all this data while allowing the schema to sync.

---

## ✅ Verification

After successful `db push`, verify:

```powershell
# Check Prisma can connect
npx prisma studio
```

Should open without errors and show all your tables with data intact.

### Test Server Endpoints:

```powershell
# Start server
npm run dev

# In another terminal, test endpoints:
curl http://localhost:3000/api/health
```

---

## 🐛 If Issues Persist

### Check Multi-Schema Support:

```powershell
npx prisma db pull
```

This pulls the current database schema and shows what Prisma sees. Compare with your `schema.prisma`.

### Check Database Connection:

```powershell
# Test DATABASE_URL connection
npx prisma db execute --stdin < schema.prisma
```

### View Prisma Logs:

```powershell
$env:DEBUG="prisma:*"
npx prisma db push
```

---

## 📝 Why Make Fields Optional?

### Benefits:
- ✅ Preserves existing data
- ✅ No manual data migration needed
- ✅ Gradual field population over time
- ✅ Safe for production

### Trade-offs:
- ⚠️ Need null checks in code: `if (consultation.doctorId) { ... }`
- ⚠️ Database allows incomplete records

### Alternative Approaches:

1. **Add defaults** (not recommended for IDs/references):
   ```prisma
   code String @unique @default("")
   ```

2. **Manual migration** (complex):
   ```sql
   UPDATE medicines SET code = id WHERE code IS NULL;
   ```

3. **Reset database** (loses data):
   ```powershell
   npx prisma db push --accept-data-loss
   ```

---

## 🎯 Recommended Path Forward

1. Make all fields optional as documented above
2. Push schema successfully
3. Update application code to handle nullable fields
4. Gradually populate missing data through the UI
5. Once all records have values, consider making fields required again

---

**After making these changes, your database will sync successfully!** 🎉
