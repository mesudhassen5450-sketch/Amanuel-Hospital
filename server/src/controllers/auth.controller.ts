import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma.js';
import { AuthRequest } from '../middlewares/auth.middleware.js';

export const login = async (req: Request, res: Response) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Username and password are required.' });
    }

    try {
        const staff = await prisma.staffAccount.findUnique({
            where: { username }
        });

        if (!staff) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        // Verify password against stored passwordHash
        const isValidPassword = await bcrypt.compare(password, staff.passwordHash);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        if (!staff.isActive) {
            return res.status(403).json({ error: 'Account is deactivated. Contact administrator.' });
        }

        // Issue JWT token containing Staff ID and Role
        const token = jwt.sign(
            { 
                id: staff.id.toString(), 
                username: staff.username, 
                role: staff.role.toUpperCase() // Ensure uppercase for consistency
            },
            process.env.JWT_SECRET || 'amanuel_hospital_secure_jwt_secret_2026_key',
            { expiresIn: '24h' }
        );

        // Update lastLogin timestamp
        await prisma.staffAccount.update({
            where: { id: staff.id },
            data: { lastLogin: new Date(), isOnline: true }
        });

        return res.json({
            success: true,
            token,
            user: {
                id: staff.id.toString(), // Convert BigInt to string for JSON serialization
                username: staff.username,
                role: staff.role,
                displayName: staff.displayName
            }
        });
    } catch (error: any) {
        console.error('Login controller error:', error);
        return res.status(500).json({ error: error.message || 'Internal server error during login' });
    }
};

export const getCurrentUser = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Not authenticated.' });
        }

        const staff = await prisma.staffAccount.findUnique({
            where: { id: req.user.id },
            select: {
                id: true,
                username: true,
                displayName: true,
                role: true,
                isActive: true,
                isOnline: true,
                lastLogin: true,
            },
        });

        if (!staff) {
            return res.status(404).json({ success: false, message: 'Staff account not found.' });
        }

        return res.json({ success: true, user: staff });
    } catch (error: any) {
        return res.status(500).json({ success: false, message: error.message });
    }
};