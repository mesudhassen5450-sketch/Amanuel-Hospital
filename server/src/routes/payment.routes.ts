import { Router } from 'express';
import {
  calculateBilling,
  createInvoiceAndInitializePayment,
  verifyPayment,
  handleWebhook,
  getInvoiceByTxRef,
  getPatientInvoices,
} from '../controllers/payment.controller.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';

const router = Router();

/**
 * Public Routes (No Authentication)
 */

// Webhook endpoint - Chapa will call this directly
// Must be public but signature-verified within the controller
router.post('/webhook', handleWebhook);

/**
 * Protected Routes (Require Authentication)
 */

// Calculate billing with tax
// POST /api/payments/calculate
// Body: { consultationFee, prescriptionFee, labFee }
router.post('/calculate', authenticateToken, calculateBilling);

// Create invoice and initialize Chapa payment
// POST /api/payments/invoices
// Body: { amount, currency, email, firstName, lastName, phoneNumber, appointmentId, patientId, doctorId }
router.post('/invoices', authenticateToken, createInvoiceAndInitializePayment);

// Verify payment status
// GET /api/payments/verify/:txRef
router.get('/verify/:txRef', authenticateToken, verifyPayment);

// Get invoice by transaction reference
// GET /api/payments/invoices/:txRef
router.get('/invoices/:txRef', authenticateToken, getInvoiceByTxRef);

// Get all invoices for a specific patient
// GET /api/payments/invoices/patient/:patientId
router.get('/invoices/patient/:patientId', authenticateToken, getPatientInvoices);

export default router;
