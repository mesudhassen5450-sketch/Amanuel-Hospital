import { Request, Response } from 'express';
import crypto from 'crypto';
import prisma from '../lib/prisma.js';

const CHAPA_SECRET_KEY = process.env.CHAPA_SECRET_KEY || '';
const CHAPA_WEBHOOK_SECRET = process.env.CHAPA_WEBHOOK_SECRET || '';
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:8080';

// Tax rate configuration (15% VAT)
const TAX_RATE = 0.15;

/**
 * Calculate billing with subtotal, tax, and total amount
 * POST /api/payments/calculate
 */
export const calculateBilling = async (req: Request, res: Response) => {
  try {
    const { consultationFee = 0, prescriptionFee = 0, labFee = 0 } = req.body;

    // Validate input
    if (
      typeof consultationFee !== 'number' ||
      typeof prescriptionFee !== 'number' ||
      typeof labFee !== 'number'
    ) {
      return res.status(400).json({ error: 'All fees must be numbers' });
    }

    // Calculate subtotal
    const subtotal = consultationFee + prescriptionFee + labFee;

    // Calculate tax
    const tax = subtotal * TAX_RATE;

    // Calculate total
    const total = subtotal + tax;

    return res.json({
      subtotal: parseFloat(subtotal.toFixed(2)),
      tax: parseFloat(tax.toFixed(2)),
      taxRate: TAX_RATE,
      total: parseFloat(total.toFixed(2)),
      currency: 'ETB',
      breakdown: {
        consultationFee: parseFloat(consultationFee.toFixed(2)),
        prescriptionFee: parseFloat(prescriptionFee.toFixed(2)),
        labFee: parseFloat(labFee.toFixed(2)),
      },
    });
  } catch (error: any) {
    console.error('[Payment Controller] Calculate billing error:', error);
    return res.status(500).json({ error: error.message || 'Failed to calculate billing' });
  }
};

/**
 * Create invoice and initialize Chapa payment
 * POST /api/payments/invoices
 */
export const createInvoiceAndInitializePayment = async (req: Request, res: Response) => {
  try {
    const {
      amount,
      currency = 'ETB',
      email,
      firstName,
      lastName,
      phoneNumber,
      appointmentId,
      patientId,
      doctorId,
      callbackUrl,
      returnUrl,
    } = req.body;

    // Validate required fields
    if (!amount || !email || !patientId) {
      return res.status(400).json({
        error: 'Missing required fields: amount, email, and patientId are required',
      });
    }

    if (amount <= 0) {
      return res.status(400).json({ error: 'Amount must be greater than 0' });
    }

    // Generate unique transaction reference
    const timestamp = Date.now();
    const randomStr = crypto.randomBytes(4).toString('hex').toUpperCase();
    const txRef = `AM-INV-${timestamp}-${randomStr}`;

    // Create invoice record in database
    const invoice = await prisma.invoice.create({
      data: {
        txRef,
        appointmentId: appointmentId ? BigInt(appointmentId) : null,
        patientId: patientId ? BigInt(patientId) : null,
        doctorId: doctorId || null,
        amount: parseFloat(amount),
        currency,
        status: 'PENDING',
      },
    });

    // Prepare Chapa payment initialization request
    const chapaCallbackUrl = callbackUrl || `${BACKEND_URL}/api/payments/webhook`;
    const chapaReturnUrl = returnUrl || `${FRONTEND_URL}/payment/success?tx_ref=${txRef}`;

    const chapaPayload = {
      amount: amount.toString(),
      currency,
      email,
      first_name: firstName || 'Patient',
      last_name: lastName || 'User',
      phone_number: phoneNumber || '',
      tx_ref: txRef,
      callback_url: chapaCallbackUrl,
      return_url: chapaReturnUrl,
      customization: {
        title: 'Amanuel Hosp', // Max 16 characters per Chapa validation
        description: 'Medical Services Payment',
      },
    };

    // Initialize Chapa payment
    const chapaResponse = await fetch('https://api.chapa.co/v1/transaction/initialize', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CHAPA_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(chapaPayload),
    });

    const chapaData: any = await chapaResponse.json();

    if (!chapaResponse.ok || chapaData.status !== 'success') {
      // Delete the invoice if Chapa initialization fails
      await prisma.invoice.delete({ where: { id: invoice.id } });
      
      console.error('[Payment Controller] Chapa initialization failed:', chapaData);
      return res.status(500).json({
        error: 'Payment initialization failed',
        details: chapaData.message || 'Unknown error from payment gateway',
      });
    }

    // Return success response with checkout URL
    return res.status(201).json({
      success: true,
      invoice: {
        id: invoice.id,
        txRef: invoice.txRef,
        amount: invoice.amount,
        currency: invoice.currency,
        status: invoice.status,
        createdAt: invoice.createdAt,
      },
      checkoutUrl: chapaData.data.checkout_url,
      message: 'Invoice created and payment initialized successfully',
    });
  } catch (error: any) {
    console.error('[Payment Controller] Create invoice error:', error);
    return res.status(500).json({ error: error.message || 'Failed to create invoice' });
  }
};

/**
 * Verify payment status from Chapa
 * GET /api/payments/verify/:txRef
 */
export const verifyPayment = async (req: Request, res: Response) => {
  try {
    const txRef = Array.isArray(req.params.txRef) 
      ? req.params.txRef[0] 
      : req.params.txRef;

    if (!txRef) {
      return res.status(400).json({ error: 'Transaction reference is required' });
    }

    // Check if invoice exists
    const invoice = await prisma.invoice.findUnique({
      where: { txRef },
    });

    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    // If already paid, return success
    if (invoice.status === 'PAID') {
      return res.json({
        success: true,
        status: 'PAID',
        invoice: {
          id: invoice.id,
          txRef: invoice.txRef,
          amount: invoice.amount,
          currency: invoice.currency,
          status: invoice.status,
          paymentMethod: invoice.paymentMethod,
          paidAt: invoice.paidAt,
        },
        message: 'Payment already verified',
      });
    }

    // Verify with Chapa API
    const chapaResponse = await fetch(
      `https://api.chapa.co/v1/transaction/verify/${txRef}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${CHAPA_SECRET_KEY}`,
        },
      }
    );

    const chapaData: any = await chapaResponse.json();

    if (!chapaResponse.ok) {
      console.error('[Payment Controller] Chapa verification failed:', chapaData);
      return res.status(500).json({
        error: 'Payment verification failed',
        details: chapaData.message || 'Unknown error from payment gateway',
      });
    }

    // Update invoice based on Chapa response
    if (chapaData.status === 'success' && chapaData.data.status === 'success') {
      const updatedInvoice = await prisma.invoice.update({
        where: { txRef },
        data: {
          status: 'PAID',
          paymentMethod: chapaData.data.payment_method || 'UNKNOWN',
          paidAt: new Date(),
        },
      });

      return res.json({
        success: true,
        status: 'PAID',
        invoice: {
          id: updatedInvoice.id,
          txRef: updatedInvoice.txRef,
          amount: updatedInvoice.amount,
          currency: updatedInvoice.currency,
          status: updatedInvoice.status,
          paymentMethod: updatedInvoice.paymentMethod,
          paidAt: updatedInvoice.paidAt,
        },
        message: 'Payment verified successfully',
      });
    } else if (chapaData.data.status === 'failed') {
      // Mark as failed
      await prisma.invoice.update({
        where: { txRef },
        data: { status: 'FAILED' },
      });

      return res.json({
        success: false,
        status: 'FAILED',
        message: 'Payment failed',
      });
    } else {
      // Still pending
      return res.json({
        success: false,
        status: 'PENDING',
        message: 'Payment is still pending',
      });
    }
  } catch (error: any) {
    console.error('[Payment Controller] Verify payment error:', error);
    return res.status(500).json({ error: error.message || 'Failed to verify payment' });
  }
};

/**
 * Handle Chapa webhook for payment notifications
 * POST /api/payments/webhook
 */
export const handleWebhook = async (req: Request, res: Response) => {
  try {
    const signature = Array.isArray(req.headers['x-chapa-signature'])
      ? req.headers['x-chapa-signature'][0]
      : req.headers['x-chapa-signature'] as string;
    const payload = JSON.stringify(req.body);

    // Verify webhook signature
    if (!signature || !CHAPA_WEBHOOK_SECRET) {
      console.error('[Payment Webhook] Missing signature or webhook secret');
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Calculate expected signature using HMAC-SHA256
    const expectedSignature = crypto
      .createHmac('sha256', CHAPA_WEBHOOK_SECRET)
      .update(payload)
      .digest('hex');

    // Compare signatures
    if (signature !== expectedSignature) {
      console.error('[Payment Webhook] Invalid signature');
      return res.status(401).json({ error: 'Invalid signature' });
    }

    // Process webhook payload
    const { event, data } = req.body;

    if (event === 'charge.success' && data?.tx_ref) {
      const txRef = data.tx_ref;

      // Find invoice
      const invoice = await prisma.invoice.findUnique({
        where: { txRef },
      });

      if (!invoice) {
        console.error(`[Payment Webhook] Invoice not found for tx_ref: ${txRef}`);
        return res.status(404).json({ error: 'Invoice not found' });
      }

      // Update invoice status to PAID
      if (invoice.status !== 'PAID') {
        await prisma.invoice.update({
          where: { txRef },
          data: {
            status: 'PAID',
            paymentMethod: data.payment_method || 'CHAPA',
            paidAt: new Date(),
          },
        });

        console.log(`[Payment Webhook] Invoice ${txRef} marked as PAID`);
      }

      return res.json({ success: true, message: 'Webhook processed successfully' });
    } else {
      console.log('[Payment Webhook] Unhandled event:', event);
      return res.json({ success: true, message: 'Event acknowledged' });
    }
  } catch (error: any) {
    console.error('[Payment Webhook] Error:', error);
    return res.status(500).json({ error: error.message || 'Webhook processing failed' });
  }
};

/**
 * Get invoice by transaction reference
 * GET /api/payments/invoices/:txRef
 */
export const getInvoiceByTxRef = async (req: Request, res: Response) => {
  try {
    const txRef = Array.isArray(req.params.txRef) 
      ? req.params.txRef[0] 
      : req.params.txRef;

    const invoice = await prisma.invoice.findUnique({
      where: { txRef },
    });

    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    return res.json({
      success: true,
      invoice: {
        id: invoice.id,
        txRef: invoice.txRef,
        appointmentId: invoice.appointmentId?.toString(),
        patientId: invoice.patientId?.toString(),
        doctorId: invoice.doctorId,
        amount: invoice.amount,
        currency: invoice.currency,
        status: invoice.status,
        paymentMethod: invoice.paymentMethod,
        paidAt: invoice.paidAt,
        createdAt: invoice.createdAt,
        updatedAt: invoice.updatedAt,
      },
    });
  } catch (error: any) {
    console.error('[Payment Controller] Get invoice error:', error);
    return res.status(500).json({ error: error.message || 'Failed to retrieve invoice' });
  }
};

/**
 * Get all invoices for a patient
 * GET /api/payments/invoices/patient/:patientId
 */
export const getPatientInvoices = async (req: Request, res: Response) => {
  try {
    const patientId = Array.isArray(req.params.patientId) 
      ? req.params.patientId[0] 
      : req.params.patientId;

    const invoices = await prisma.invoice.findMany({
      where: { patientId: BigInt(patientId) },
      orderBy: { createdAt: 'desc' },
    });

    return res.json({
      success: true,
      count: invoices.length,
      invoices: invoices.map(inv => ({
        id: inv.id,
        txRef: inv.txRef,
        appointmentId: inv.appointmentId?.toString(),
        amount: inv.amount,
        currency: inv.currency,
        status: inv.status,
        paymentMethod: inv.paymentMethod,
        paidAt: inv.paidAt,
        createdAt: inv.createdAt,
      })),
    });
  } catch (error: any) {
    console.error('[Payment Controller] Get patient invoices error:', error);
    return res.status(500).json({ error: error.message || 'Failed to retrieve invoices' });
  }
};
