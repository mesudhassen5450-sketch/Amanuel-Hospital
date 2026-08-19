import { Response } from 'express';
import { prisma } from '../config/db.js';
import { hashPassword } from '../utils/auth.js';
import { AuthRequest } from '../middlewares/auth.middleware.js';

/**
 * GET /api/staff
 * Retrieve all staff accounts
 * @access Admin only
 */
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

/**
 * POST /api/staff
 * Create new staff account
 * @access Admin only
 */
export const createStaffAccount = async (req: AuthRequest, res: Response) => {
    try {
        const { username, password, role, displayName, isActive } = req.body;

        // Validation
        if (!username || !password || !role || !displayName) {
            return res.status(400).json({
                success: false,
                error: 'Username, password, role, and display name are required',
            });
        }

        if (username.length < 3) {
            return res.status(400).json({
                success: false,
                error: 'Username must be at least 3 characters',
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                error: 'Password must be at least 6 characters',
            });
        }

        const validRoles = ['admin', 'reception', 'cashier', 'doctor', 'laboratory', 'pharmacy', 'staff'];
        if (!validRoles.includes(role)) {
            return res.status(400).json({
                success: false,
                error: `Invalid role. Must be one of: ${validRoles.join(', ')}`,
            });
        }

        // Check if username already exists
        const existingUser = await prisma.staffAccount.findUnique({
            where: { username: username.toLowerCase().trim() },
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                error: 'Username already exists',
            });
        }

        // Hash password
        const passwordHash = await hashPassword(password);

        // Create staff account
        const newStaff = await prisma.staffAccount.create({
            data: {
                username: username.toLowerCase().trim(),
                passwordHash,
                role,
                displayName: displayName.trim(),
                isActive: isActive !== undefined ? isActive : true,
                isOnline: false,
            },
            select: {
                id: true,
                username: true,
                role: true,
                displayName: true,
                isActive: true,
                createdAt: true,
            },
        });

        // If role is doctor, attempt to create linked doctor record safely
        // Note: Doctor model may not exist in schema - gracefully skipped
        if (role === 'doctor' || role === 'DOCTOR') {
            try {
                // Check if Doctor model exists before attempting to create
                // Uncomment if Doctor model is added to schema:
                // await prisma.doctor.create({
                //     data: {
                //         username: newStaff.username,
                //         specialty: req.body.specialty || req.body.specialization || 'General Practice',
                //         isAvailable: true,
                //     }
                // });
                console.log('[Staff Controller] Doctor role assigned to staff account:', newStaff.username);
            } catch (docError: any) {
                // Gracefully handle missing table error without breaking staff account creation
                console.warn('[Staff Controller] Skipped optional doctor record creation:', docError.message);
            }
        }

        return res.status(201).json({
            success: true,
            data: {
                ...newStaff,
                id: newStaff.id.toString(),
            },
            message: 'Staff account created successfully',
        });
    } catch (error: any) {
        console.error('[Staff Controller] Create staff error:', error);
        return res.status(500).json({
            success: false,
            error: error.message || 'Failed to create staff account',
        });
    }
};

/**
 * PUT /api/staff/:id
 * Update staff account details
 * @access Admin only
 */
export const updateStaffAccount = async (req: AuthRequest, res: Response) => {
    try {
        const id = Array.isArray(req.params.id) 
            ? req.params.id[0] 
            : req.params.id;
        const { username, role, displayName, isActive } = req.body;

        if (!id || isNaN(Number(id))) {
            return res.status(400).json({
                success: false,
                error: 'Valid staff ID is required',
            });
        }

        // Validation
        if (!username || !role || !displayName) {
            return res.status(400).json({
                success: false,
                error: 'Username, role, and display name are required',
            });
        }

        if (username.length < 3) {
            return res.status(400).json({
                success: false,
                error: 'Username must be at least 3 characters',
            });
        }

        const validRoles = ['admin', 'reception', 'cashier', 'doctor', 'laboratory', 'pharmacy', 'staff'];
        if (!validRoles.includes(role)) {
            return res.status(400).json({
                success: false,
                error: `Invalid role. Must be one of: ${validRoles.join(', ')}`,
            });
        }

        // Check if staff exists
        const existingStaff = await prisma.staffAccount.findUnique({
            where: { id: Number(id) },
        });

        if (!existingStaff) {
            return res.status(404).json({
                success: false,
                error: 'Staff account not found',
            });
        }

        // Check if new username conflicts with another account
        if (username.toLowerCase() !== existingStaff.username.toLowerCase()) {
            const usernameConflict = await prisma.staffAccount.findUnique({
                where: { username: username.toLowerCase().trim() },
            });

            if (usernameConflict) {
                return res.status(409).json({
                    success: false,
                    error: 'Username already exists',
                });
            }
        }

        // Update staff account
        const updatedStaff = await prisma.staffAccount.update({
            where: { id: Number(id) },
            data: {
                username: username.toLowerCase().trim(),
                role,
                displayName: displayName.trim(),
                isActive: isActive !== undefined ? isActive : existingStaff.isActive,
                updatedAt: new Date(),
            },
            select: {
                id: true,
                username: true,
                role: true,
                displayName: true,
                isActive: true,
                updatedAt: true,
            },
        });

        return res.json({
            success: true,
            data: {
                ...updatedStaff,
                id: updatedStaff.id.toString(),
            },
            message: 'Staff account updated successfully',
        });
    } catch (error: any) {
        console.error('[Staff Controller] Update staff error:', error);
        return res.status(500).json({
            success: false,
            error: error.message || 'Failed to update staff account',
        });
    }
};

/**
 * PUT /api/staff/:id/password
 * Reset staff password
 * @access Admin only
 */
export const resetStaffPassword = async (req: AuthRequest, res: Response) => {
    try {
        const id = Array.isArray(req.params.id) 
            ? req.params.id[0] 
            : req.params.id;
        const { newPassword } = req.body;

        if (!id || isNaN(Number(id))) {
            return res.status(400).json({
                success: false,
                error: 'Valid staff ID is required',
            });
        }

        if (!newPassword) {
            return res.status(400).json({
                success: false,
                error: 'New password is required',
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                error: 'Password must be at least 6 characters',
            });
        }

        // Check if staff exists
        const existingStaff = await prisma.staffAccount.findUnique({
            where: { id: Number(id) },
        });

        if (!existingStaff) {
            return res.status(404).json({
                success: false,
                error: 'Staff account not found',
            });
        }

        // Hash new password
        const passwordHash = await hashPassword(newPassword);

        // Update password
        await prisma.staffAccount.update({
            where: { id: Number(id) },
            data: {
                passwordHash,
                updatedAt: new Date(),
            },
        });

        return res.json({
            success: true,
            message: 'Password reset successfully',
        });
    } catch (error: any) {
        console.error('[Staff Controller] Reset password error:', error);
        return res.status(500).json({
            success: false,
            error: error.message || 'Failed to reset password',
        });
    }
};

/**
 * PATCH /api/staff/:id/status
 * Toggle staff active status
 * @access Admin only
 */
export const toggleStaffStatus = async (req: AuthRequest, res: Response) => {
    try {
        const id = Array.isArray(req.params.id) 
            ? req.params.id[0] 
            : req.params.id;
        const { isActive } = req.body;

        if (!id || isNaN(Number(id))) {
            return res.status(400).json({
                success: false,
                error: 'Valid staff ID is required',
            });
        }

        // Check if staff exists
        const existingStaff = await prisma.staffAccount.findUnique({
            where: { id: Number(id) },
        });

        if (!existingStaff) {
            return res.status(404).json({
                success: false,
                error: 'Staff account not found',
            });
        }

        // Determine new status (toggle if not provided)
        const newStatus = isActive !== undefined ? isActive : !existingStaff.isActive;

        // Prevent deactivating the last admin
        if (existingStaff.role === 'admin' && !newStatus) {
            const activeAdminCount = await prisma.staffAccount.count({
                where: {
                    role: 'admin',
                    isActive: true,
                },
            });

            if (activeAdminCount <= 1) {
                return res.status(400).json({
                    success: false,
                    error: 'Cannot deactivate the last active admin account',
                });
            }
        }

        // Update status
        const updatedStaff = await prisma.staffAccount.update({
            where: { id: Number(id) },
            data: {
                isActive: newStatus,
                updatedAt: new Date(),
            },
            select: {
                id: true,
                username: true,
                role: true,
                displayName: true,
                isActive: true,
            },
        });

        return res.json({
            success: true,
            data: {
                ...updatedStaff,
                id: updatedStaff.id.toString(),
            },
            message: `Staff account ${newStatus ? 'activated' : 'deactivated'} successfully`,
        });
    } catch (error: any) {
        console.error('[Staff Controller] Toggle status error:', error);
        return res.status(500).json({
            success: false,
            error: error.message || 'Failed to update staff status',
        });
    }
};

/**
 * DELETE /api/staff/:id
 * Delete staff account with cascading cleanup
 * @access Admin only
 */
export const deleteStaffAccount = async (req: AuthRequest, res: Response) => {
    try {
        const id = Array.isArray(req.params.id) 
            ? req.params.id[0] 
            : req.params.id;

        if (!id || isNaN(Number(id))) {
            return res.status(400).json({
                success: false,
                error: 'Valid staff ID is required',
            });
        }

        const staffId = parseInt(id, 10);

        // Check if staff exists
        const existingStaff = await prisma.staffAccount.findUnique({
            where: { id: staffId },
        });

        if (!existingStaff) {
            return res.status(404).json({
                success: false,
                error: 'Staff account not found',
            });
        }

        // Prevent deleting the last admin
        if (existingStaff.role === 'admin') {
            const activeAdminCount = await prisma.staffAccount.count({
                where: {
                    role: 'admin',
                    isActive: true,
                },
            });

            if (activeAdminCount <= 1) {
                return res.status(400).json({
                    success: false,
                    error: 'Cannot delete the last active admin account',
                });
            }
        }

        // Delete staff account
        // Note: Database foreign key constraints handle cascading deletion of related records
        await prisma.staffAccount.delete({
            where: { id: staffId },
        });

        return res.json({
            success: true,
            message: 'Staff account deleted successfully',
        });
    } catch (error: any) {
        console.error('[Staff Controller] Delete staff error:', error);
        return res.status(500).json({
            success: false,
            error: error.message || 'Failed to delete staff account',
        });
    }
};
