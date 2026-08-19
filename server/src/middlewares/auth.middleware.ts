import { Request, Response, NextFunction } from 'express';
import { verifyToken, TokenPayload } from '../utils/auth.js';

export interface AuthRequest extends Request {
    user?: TokenPayload;
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Expecting "Bearer <token>"

    if (!token) {
        return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = verifyToken(token);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ success: false, message: 'Invalid or expired token.' });
    }
};

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