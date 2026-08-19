import { Router } from 'express';
import {
    getAllStaffAccounts,
    createStaffAccount,
    updateStaffAccount,
    resetStaffPassword,
    toggleStaffStatus,
    deleteStaffAccount,
} from '../controllers/staff.controller.js';
import { authenticateToken, authorizeRoles } from '../middlewares/auth.middleware.js';

const router = Router();

/**
 * All staff management routes require authentication and admin role
 */

// GET /api/staff - Fetch all staff accounts
router.get(
    '/',
    authenticateToken,
    authorizeRoles('admin'),
    getAllStaffAccounts
);

// POST /api/staff - Create new staff account
router.post(
    '/',
    authenticateToken,
    authorizeRoles('admin'),
    createStaffAccount
);

// PUT /api/staff/:id - Update staff account details
router.put(
    '/:id',
    authenticateToken,
    authorizeRoles('admin'),
    updateStaffAccount
);

// PUT /api/staff/:id/password - Reset staff password
router.put(
    '/:id/password',
    authenticateToken,
    authorizeRoles('admin'),
    resetStaffPassword
);

// PATCH /api/staff/:id/status - Toggle staff active status
router.patch(
    '/:id/status',
    authenticateToken,
    authorizeRoles('admin'),
    toggleStaffStatus
);

// DELETE /api/staff/:id - Delete staff account
router.delete(
    '/:id',
    authenticateToken,
    authorizeRoles('admin'),
    deleteStaffAccount
);

export default router;
