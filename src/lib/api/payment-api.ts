/**
 * Payment Processing API Service
 * Uses Express backend API with Bearer token authentication
 * Integrates with Chapa payment gateway for Ethiopian payments
 */

import { apiFetch, handleApiResponse } from "./client";

// ══════════════════════════════════════════════════════════════════════════════
// PAYMENT TYPES
// ══════════════════════════════════════════════════════════════════════════════

export interface BillingCalculation {
  subtotal: number;
  tax: number;
  taxRate: number;
  total: number;
  currency: string;
  breakdown: {
    consultationFee: number;
    prescriptionFee: number;
    labFee: number;
  };
}

export interface Invoice {
  id: string;
  txRef: string;
  appointmentId?: string;
  patientId?: string;
  doctorId?: string;
  amount: number;
  currency: string;
  status: 'PENDING' | 'PAID' | 'FAILED' | 'CANCELLED';
  paymentMethod?: string;
  paidAt?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateInvoiceData {
  amount: number;
  currency?: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  appointmentId?: number | string;
  patientId: number | string;
  doctorId?: string;
  callbackUrl?: string;
  returnUrl?: string;
}

export interface CreateInvoiceResponse {
  success: boolean;
  invoice: Invoice;
  checkoutUrl: string;
  message: string;
}

export interface VerifyPaymentResponse {
  success: boolean;
  status: 'PAID' | 'FAILED' | 'PENDING';
  invoice?: Invoice;
  message: string;
}

export interface CalculateBillingData {
  consultationFee?: number;
  prescriptionFee?: number;
  labFee?: number;
}

// ══════════════════════════════════════════════════════════════════════════════
// API FUNCTIONS
// ══════════════════════════════════════════════════════════════════════════════

/**
 * POST /api/payments/calculate
 * Calculate billing with subtotal, tax (15%), and total
 */
export const calculateBilling = async (data: CalculateBillingData): Promise<BillingCalculation> => {
  const response = await apiFetch("/api/payments/calculate", {
    method: "POST",
    body: JSON.stringify(data),
  });

  return handleApiResponse<BillingCalculation>(response);
};

/**
 * POST /api/payments/invoices
 * Create invoice and initialize Chapa payment
 * Returns checkout URL for redirecting patient to payment page
 */
export const createInvoiceAndInitializePayment = async (
  data: CreateInvoiceData
): Promise<CreateInvoiceResponse> => {
  const response = await apiFetch("/api/payments/invoices", {
    method: "POST",
    body: JSON.stringify(data),
  });

  return handleApiResponse<CreateInvoiceResponse>(response);
};

/**
 * GET /api/payments/verify/:txRef
 * Verify payment status from Chapa and update invoice
 */
export const verifyPayment = async (txRef: string): Promise<VerifyPaymentResponse> => {
  const response = await apiFetch(`/api/payments/verify/${txRef}`, {
    method: "GET",
  });

  return handleApiResponse<VerifyPaymentResponse>(response);
};

/**
 * GET /api/payments/invoices/:txRef
 * Get invoice details by transaction reference
 */
export const getInvoiceByTxRef = async (txRef: string): Promise<Invoice> => {
  const response = await apiFetch(`/api/payments/invoices/${txRef}`, {
    method: "GET",
  });

  const result = await handleApiResponse<{ success: boolean; invoice: Invoice }>(response);
  return result.invoice;
};

/**
 * GET /api/payments/invoices/patient/:patientId
 * Get all invoices for a specific patient
 */
export const getPatientInvoices = async (patientId: number | string): Promise<Invoice[]> => {
  const response = await apiFetch(`/api/payments/invoices/patient/${patientId}`, {
    method: "GET",
  });

  const result = await handleApiResponse<{ success: boolean; count: number; invoices: Invoice[] }>(response);
  return result.invoices;
};

// ══════════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ══════════════════════════════════════════════════════════════════════════════

/**
 * Format amount for display with Ethiopian Birr currency
 */
export const formatAmount = (amount: number, currency: string = 'ETB'): string => {
  return new Intl.NumberFormat('en-ET', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Get payment status badge color
 */
export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'PAID':
      return 'green';
    case 'PENDING':
      return 'yellow';
    case 'FAILED':
      return 'red';
    case 'CANCELLED':
      return 'gray';
    default:
      return 'gray';
  }
};

/**
 * Open Chapa checkout in new window or redirect
 */
export const redirectToCheckout = (checkoutUrl: string, newWindow: boolean = false): void => {
  if (newWindow) {
    window.open(checkoutUrl, '_blank', 'width=800,height=600');
  } else {
    window.location.href = checkoutUrl;
  }
};

/**
 * Poll payment verification until status changes from PENDING
 * Useful for checking payment status after redirect from Chapa
 */
export const pollPaymentVerification = async (
  txRef: string,
  maxAttempts: number = 10,
  intervalMs: number = 3000
): Promise<VerifyPaymentResponse> => {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const result = await verifyPayment(txRef);

    if (result.status !== 'PENDING') {
      return result;
    }

    // Wait before next attempt
    await new Promise(resolve => setTimeout(resolve, intervalMs));
  }

  // Return last result if still pending after max attempts
  return verifyPayment(txRef);
};
