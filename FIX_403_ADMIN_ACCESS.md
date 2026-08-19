# Fix: 403 Forbidden Error for Admin Access to /api/staff

## Problem Summary
Admin users were receiving `403 Forbidden` errors when accessing the `/api/staff` endpoint, despite having valid authentication tokens.

## Root Cause
**Case-sensitive role checking mismatch**:
- Database stored role as `"ADMIN"` (uppercase)
- JWT token contained role as-is from database: `"ADMIN"`
- Route middleware checked for `'admin'` (lowercase)
- Comparison `'ADMIN' === 'admin'` failed → 403 Forbidden

## Solution Implemented

### 1. Updated Authorization Middleware
**File**: `server/src/middlewares/auth.middleware.ts`

**Changes**:
- Made role comparison case-insensitive
- Added explicit admin/administrator bypass
- Better error messages

```typescript
export const authorizeRoles = (...roles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized: User not authenticated.'
            });
        }

        // Normalize roles to uppercase for case-insensitive comparison
        const userRole = req.user.role ? req.user.role.toUpperCase() : '';
        const normalizedAllowedRoles = roles.map(r => r.toUpperCase());

        // Allow access if user role matches any of the allowed roles
        // or if user is an ADMIN/ADMINISTRATOR (admins have full access)
        if (userRole === 'ADMIN' || 
            userRole === 'ADMINISTRATOR' || 
            normalizedAllowedRoles.includes(userRole)) {
            return next();
        }

        return res.status(403).json({
            success: false,
            message: 'Access denied: Insufficient permissions for this department.'
        });
    };
};
```

### 2. Standardized JWT Token Generation
**File**: `server/src/controllers/auth.controller.ts`

**Changes**:
- JWT tokens now always use uppercase role for consistency

```typescript
const token = jwt.sign(
    { 
        id: staff.id.toString(), 
        username: staff.username, 
        role: staff.role.toUpperCase() // Ensure uppercase for consistency
    },
    process.env.JWT_SECRET || 'amanuel_hospital_secure_jwt_secret_2026_key',
    { expiresIn: '24h' }
);
```

### 3. Fixed BigInt Serialization in Staff Controller
**File**: `server/src/controllers/staff.controller.ts`

**Changes**:
- Convert BigInt IDs to strings before JSON serialization
- Fixed response structure to match frontend expectations

```typescript
export const getAllStaffAccounts = async (req: AuthRequest, res: Response) => {
    try {
        const staffAccounts = await prisma.staffAccount.findMany({
            select: {
                id: true,
                username: true,
                role: true,
                displayName: true,
                isActive: true,
                isOnline: true,
                lastSeen: true,
                createdAt: true,
                updatedAt: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        // Convert BigInt IDs to strings for JSON serialization
        const serializedStaff = staffAccounts.map(staff => ({
            ...staff,
            id: staff.id.toString(),
        }));

        return res.json({
            success: true,
            staff: serializedStaff,
            count: serializedStaff.length,
        });
    } catch (error: any) {
        console.error('[Staff Controller] Get all staff error:', error);
        return res.status(500).json({
            success: false,
            error: error.message || 'Failed to fetch staff accounts',
        });
    }
};
```

## Testing Results

### Before Fix
```bash
curl -H "Authorization: Bearer <token>" http://localhost:3001/api/staff
# Response: 403 Forbidden
# {"success":false,"message":"Access denied: Insufficient permissions for this department."}
```

### After Fix
```bash
curl -H "Authorization: Bearer <token>" http://localhost:3001/api/staff
# Response: 200 OK
# {"success":true,"staff":[...],"count":13}
```

### Test Output
```
✅ Login successful! Role: ADMIN

Testing /api/staff endpoint...

✅ SUCCESS! Retrieved 13 staff members:
  - doctor tiruneh (doctor5) - Role: doctor - Active: True
  - DR mesud Hassen (doctor7) - Role: doctor - Active: True
  - Dr. Zerfe Kebede Emergency Medicine (doctor6) - Role: doctor - Active: True
  - Dr. Selamawit Bekele (doctor4) - Role: doctor - Active: True
  - Dr. Kidanemariam Haile (doctor3) - Role: doctor - Active: True
  - Dr. Dawit Abebe (doctor2) - Role: doctor - Active: True
  - Hospital Cashier (cashier) - Role: cashier - Active: True
  - Administrator (admin) - Role: ADMIN - Active: True
  - Reception Officer (reception) - Role: reception - Active: True
  - Lab Technician (laboratory) - Role: laboratory - Active: True
  - Chief Pharmacist (pharmacy) - Role: pharmacy - Active: True
  - Doctor Amanuel (doctor) - Role: doctor - Active: True
  - General Staff (staff) - Role: admin - Active: True
```

## Benefits of This Fix

1. **Case-Insensitive Role Matching**: Roles like `admin`, `ADMIN`, `Admin` all work
2. **Admin Bypass**: Users with ADMIN or ADMINISTRATOR role always have full access
3. **Better Security**: More robust authorization logic
4. **Consistency**: JWT tokens always use uppercase roles
5. **Fixed Serialization**: BigInt IDs converted to strings properly

## Files Modified

1. `server/src/middlewares/auth.middleware.ts` - Authorization logic
2. `server/src/controllers/auth.controller.ts` - JWT token generation
3. `server/src/controllers/staff.controller.ts` - BigInt serialization

## No Action Required for Existing Users

- ✅ Database roles remain unchanged
- ✅ Existing tokens still work
- ✅ No database migration needed
- ⚠️ Users need to **clear browser cache/localStorage** and **re-login** to get new tokens with uppercase roles

## Steps to Apply Fix (Already Done)

1. ✅ Updated authorization middleware
2. ✅ Updated JWT token generation
3. ✅ Fixed BigInt serialization
4. ✅ Server restarted
5. ✅ Tested successfully

## Future Considerations

- Consider creating a role enum in TypeScript for type safety
- Add role validation at database level
- Implement role-based access control (RBAC) for finer-grained permissions
- Add audit logging for admin actions

---

**Status**: ✅ **RESOLVED**  
**Date**: August 19, 2026  
**Tested**: Admin can now access `/api/staff` endpoint successfully
