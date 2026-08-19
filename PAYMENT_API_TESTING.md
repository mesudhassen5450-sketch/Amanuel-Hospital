# Payment API Testing Guide

## ✅ Payment System Migration Complete

The payment system has been successfully migrated from serverless functions to the Express backend API at `http://localhost:3001/api/payments`.

---

## 🔧 Configuration Required

Before testing with real payments, update your Chapa API keys in `server/.env`:

```env
CHAPA_SECRET_KEY="your_actual_chapa_secret_key"
CHAPA_WEBHOOK_SECRET="your_actual_chapa_webhook_secret"
```

⚠️ **Current Status:** Placeholder keys are in place. Replace with production keys from [Chapa Dashboard](https://dashboard.chapa.co).

---

## 📋 Available Endpoints

### 1. Calculate Billing (Protected)
**Endpoint:** `POST /api/payments/calculate`

**Purpose:** Calculate subtotal, tax (15% VAT), and total amount for medical services.

**Authentication:** Required (Bearer token)

**Request Body:**
```json
{
  "consultationFee": 500,
  "prescriptionFee": 150,
  "labFee": 200
}
```

**Response:**
```json
{
  "subtotal": 850.00,
  "tax": 127.50,
  "taxRate": 0.15,
  "total": 977.50,
  "currency": "ETB",
  "breakdown": {
    "consultationFee": 500.00,
    "prescriptionFee": 150.00,
    "labFee": 200.00
  }
}
```

**Test Command (PowerShell):**
```powershell
# First get auth token
$token = "<YOUR_JWT_TOKEN>"

# Calculate billing
$body = '{"consultationFee":500,"prescriptionFee":150,"labFee":200}'
Invoke-RestMethod -Uri "http://localhost:3001/api/payments/calculate" `
  -Method POST `
  -ContentType "application/json" `
  -Headers @{Authorization="Bearer $token"} `
  -Body $body
```

---

### 2. Create Invoice & Initialize Payment (Protected)
**Endpoint:** `POST /api/payments/invoices`

**Purpose:** Create an invoice record and initialize Chapa payment, returns checkout URL.

**Authentication:** Required (Bearer token)

**Request Body:**
```json
{
  "amount": 977.50,
  "currency": "ETB",
  "email": "patient@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+251911234567",
  "appointmentId": "123",
  "patientId": "456",
  "doctorId": "dr.smith",
  "returnUrl": "http://localhost:8080/payment/success"
}
```

**Response:**
```json
{
  "success": true,
  "invoice": {
    "id": "uuid-here",
    "txRef": "AM-INV-1703012345678-A1B2C3D4",
    "amount": 977.50,
    "currency": "ETB",
    "status": "PENDING",
    "createdAt": "2026-08-19T10:30:00.000Z"
  },
  "checkoutUrl": "https://checkout.chapa.co/checkout/payment/...",
  "message": "Invoice created and payment initialized successfully"
}
```

**Test Command (PowerShell):**
```powershell
$invoiceBody = @{
  amount = 977.50
  currency = "ETB"
  email = "test@example.com"
  firstName = "Test"
  lastName = "Patient"
  phoneNumber = "+251911234567"
  patientId = 1
  appointmentId = 1
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3001/api/payments/invoices" `
  -Method POST `
  -ContentType "application/json" `
  -Headers @{Authorization="Bearer $token"} `
  -Body $invoiceBody
```

---

### 3. Verify Payment (Protected)
**Endpoint:** `GET /api/payments/verify/:txRef`

**Purpose:** Query Chapa API to verify payment status and update invoice.

**Authentication:** Required (Bearer token)

**Response (Success):**
```json
{
  "success": true,
  "status": "PAID",
  "invoice": {
    "id": "uuid-here",
    "txRef": "AM-INV-1703012345678-A1B2C3D4",
    "amount": 977.50,
    "currency": "ETB",
    "status": "PAID",
    "paymentMethod": "telebirr",
    "paidAt": "2026-08-19T10:35:00.000Z"
  },
  "message": "Payment verified successfully"
}
```

**Test Command (PowerShell):**
```powershell
$txRef = "AM-INV-1703012345678-A1B2C3D4"
Invoke-RestMethod -Uri "http://localhost:3001/api/payments/verify/$txRef" `
  -Method GET `
  -Headers @{Authorization="Bearer $token"}
```

---

### 4. Get Invoice by Transaction Reference (Protected)
**Endpoint:** `GET /api/payments/invoices/:txRef`

**Purpose:** Retrieve invoice details by transaction reference.

**Authentication:** Required (Bearer token)

**Test Command (PowerShell):**
```powershell
$txRef = "AM-INV-1703012345678-A1B2C3D4"
Invoke-RestMethod -Uri "http://localhost:3001/api/payments/invoices/$txRef" `
  -Method GET `
  -Headers @{Authorization="Bearer $token"}
```

---

### 5. Get Patient Invoices (Protected)
**Endpoint:** `GET /api/payments/invoices/patient/:patientId`

**Purpose:** Retrieve all invoices for a specific patient.

**Authentication:** Required (Bearer token)

**Response:**
```json
{
  "success": true,
  "count": 3,
  "invoices": [
    {
      "id": "uuid-1",
      "txRef": "AM-INV-...",
      "appointmentId": "123",
      "amount": 977.50,
      "currency": "ETB",
      "status": "PAID",
      "paymentMethod": "telebirr",
      "paidAt": "2026-08-19T10:35:00.000Z",
      "createdAt": "2026-08-19T10:30:00.000Z"
    }
  ]
}
```

**Test Command (PowerShell):**
```powershell
$patientId = 456
Invoke-RestMethod -Uri "http://localhost:3001/api/payments/invoices/patient/$patientId" `
  -Method GET `
  -Headers @{Authorization="Bearer $token"}
```

---

### 6. Webhook Handler (Public)
**Endpoint:** `POST /api/payments/webhook`

**Purpose:** Receive payment notifications from Chapa (signature-verified internally).

**Authentication:** None (HMAC-SHA256 signature verification)

**Headers Required:**
- `x-chapa-signature`: HMAC-SHA256 signature of request body

**Webhook Payload (from Chapa):**
```json
{
  "event": "charge.success",
  "data": {
    "tx_ref": "AM-INV-1703012345678-A1B2C3D4",
    "status": "success",
    "payment_method": "telebirr",
    "amount": 977.50,
    "currency": "ETB"
  }
}
```

**Note:** This endpoint is called directly by Chapa servers. Configure webhook URL in Chapa Dashboard:
```
https://your-domain.com/api/payments/webhook
```

---

## 🧪 Complete Test Flow

### Step 1: Get Authentication Token
```powershell
# Login as admin (or any staff account)
$loginBody = '{"username":"admin","password":"admin123"}'
$loginResponse = Invoke-RestMethod -Uri "http://localhost:3001/api/auth/login" `
  -Method POST `
  -ContentType "application/json" `
  -Body $loginBody

$token = $loginResponse.token
Write-Host "✅ Token obtained: $($token.Substring(0,20))..."
```

### Step 2: Calculate Billing
```powershell
$billingBody = '{"consultationFee":500,"prescriptionFee":150,"labFee":200}'
$billing = Invoke-RestMethod -Uri "http://localhost:3001/api/payments/calculate" `
  -Method POST `
  -ContentType "application/json" `
  -Headers @{Authorization="Bearer $token"} `
  -Body $billingBody

Write-Host "✅ Total Amount: $($billing.total) $($billing.currency)"
```

### Step 3: Create Invoice and Initialize Payment
```powershell
$invoiceBody = @{
  amount = $billing.total
  currency = "ETB"
  email = "patient@hospital.com"
  firstName = "Test"
  lastName = "Patient"
  phoneNumber = "+251911234567"
  patientId = 1
  appointmentId = 1
} | ConvertTo-Json

$invoice = Invoke-RestMethod -Uri "http://localhost:3001/api/payments/invoices" `
  -Method POST `
  -ContentType "application/json" `
  -Headers @{Authorization="Bearer $token"} `
  -Body $invoiceBody

Write-Host "✅ Invoice Created: $($invoice.invoice.txRef)"
Write-Host "✅ Checkout URL: $($invoice.checkoutUrl)"
Write-Host ""
Write-Host "⚠️  Note: Chapa API call will fail with placeholder keys"
Write-Host "   Update CHAPA_SECRET_KEY in server/.env for real payments"
```

### Step 4: Verify Payment (After user completes payment)
```powershell
$txRef = $invoice.invoice.txRef
$verification = Invoke-RestMethod -Uri "http://localhost:3001/api/payments/verify/$txRef" `
  -Method GET `
  -Headers @{Authorization="Bearer $token"}

Write-Host "✅ Payment Status: $($verification.status)"
```

---

## 🔐 Security Features

### 1. JWT Authentication
All endpoints (except webhook) require valid JWT Bearer token from staff login.

### 2. HMAC-SHA256 Webhook Verification
```typescript
// In payment.controller.ts
const expectedSignature = crypto
  .createHmac('sha256', CHAPA_WEBHOOK_SECRET)
  .update(payload)
  .digest('hex');

if (signature !== expectedSignature) {
  return res.status(401).json({ error: 'Invalid signature' });
}
```

### 3. Environment Variables
Sensitive keys stored in `server/.env` and never exposed to frontend.

---

## 📱 Frontend Integration Example

### Using the Payment API Service

```typescript
import {
  calculateBilling,
  createInvoiceAndInitializePayment,
  verifyPayment,
  redirectToCheckout,
  pollPaymentVerification,
} from '@/lib/api/payment-api';

// 1. Calculate billing
const billing = await calculateBilling({
  consultationFee: 500,
  prescriptionFee: 150,
  labFee: 200,
});

console.log(`Total: ${billing.total} ${billing.currency}`);

// 2. Create invoice and get checkout URL
const invoice = await createInvoiceAndInitializePayment({
  amount: billing.total,
  currency: 'ETB',
  email: 'patient@example.com',
  firstName: 'John',
  lastName: 'Doe',
  phoneNumber: '+251911234567',
  patientId: 123,
  appointmentId: 456,
});

// 3. Redirect to Chapa checkout
redirectToCheckout(invoice.checkoutUrl);

// 4. After redirect back from Chapa, verify payment
const urlParams = new URLSearchParams(window.location.search);
const txRef = urlParams.get('tx_ref');

if (txRef) {
  const result = await pollPaymentVerification(txRef);
  
  if (result.status === 'PAID') {
    console.log('✅ Payment successful!');
    // Update UI, show success message, etc.
  } else {
    console.log('❌ Payment failed or pending');
  }
}
```

---

## 🗄️ Database Schema

### Invoice Table
```prisma
model Invoice {
  id            String    @id @default(uuid())
  txRef         String    @unique @map("tx_ref")
  appointmentId BigInt?   @map("appointment_id")
  patientId     BigInt?   @map("patient_id")
  doctorId      String?   @map("doctor_id")
  amount        Float
  currency      String    @default("ETB")
  status        String    @default("PENDING") // PENDING, PAID, FAILED, CANCELLED
  paymentMethod String?   @map("payment_method")
  paidAt        DateTime? @map("paid_at")
  createdAt     DateTime  @default(now()) @map("created_at")
  updatedAt     DateTime  @updatedAt @map("updated_at")

  @@map("invoices")
  @@schema("public")
}
```

---

## 🔄 Payment Flow Diagram

```
┌─────────────┐
│  Frontend   │
│   Patient   │
└──────┬──────┘
       │
       │ 1. Calculate Billing
       ▼
┌──────────────────────┐
│  POST /calculate     │
│  (consultation, lab, │
│   prescription fees) │
└──────┬───────────────┘
       │
       │ 2. Create Invoice
       ▼
┌──────────────────────┐
│  POST /invoices      │
│  Creates Invoice DB  │
│  Calls Chapa API     │
└──────┬───────────────┘
       │
       │ 3. Redirect to Chapa
       ▼
┌──────────────────────┐
│  Chapa Checkout      │
│  Patient pays with   │
│  Telebirr/CBE/etc    │
└──────┬───────────────┘
       │
       │ 4. Webhook (async)
       ├───────────────────┐
       │                   │
       │                   ▼
       │            ┌──────────────┐
       │            │ POST /webhook│
       │            │ HMAC verified│
       │            │ Update status│
       │            └──────────────┘
       │
       │ 5. Redirect back
       ▼
┌──────────────────────┐
│  GET /verify/:txRef  │
│  Check final status  │
│  Show success/fail   │
└──────────────────────┘
```

---

## ✅ Migration Checklist

- [x] Environment configuration (`.env`)
- [x] Invoice model in Prisma schema
- [x] Database migration (`npx prisma db push`)
- [x] Payment controller with 6 functions
- [x] Payment routes with authentication
- [x] Routes registered in Express server
- [x] Frontend payment API service
- [x] Server running on port 3001
- [ ] Update Chapa API keys (user action required)
- [ ] Configure Chapa webhook URL in dashboard
- [ ] Test with real payment

---

## 🚀 Next Steps

1. **Get Chapa API Keys:**
   - Sign up at [Chapa Dashboard](https://dashboard.chapa.co)
   - Get your Secret Key and Webhook Secret
   - Update `server/.env` with real keys

2. **Configure Webhook:**
   - In Chapa Dashboard → Settings → Webhooks
   - Set webhook URL: `https://your-domain.com/api/payments/webhook`
   - Copy Webhook Secret to `server/.env`

3. **Test Real Payment:**
   - Use test card provided by Chapa
   - Complete payment flow
   - Verify webhook receives notification
   - Check invoice status updated to PAID

4. **Update Frontend:**
   - Replace any direct Supabase Edge Function calls
   - Import from `@/lib/api/payment-api`
   - Use `createInvoiceAndInitializePayment()` function
   - Handle payment success/failure states

---

## 📞 Support

If you encounter issues:

1. Check server logs: `npm run dev` output
2. Verify authentication token is valid
3. Ensure Chapa keys are correctly configured
4. Check database connection in `server/.env`
5. Review CORS settings for frontend access

**Server running:** ✅ `http://localhost:3001`  
**API base URL:** `http://localhost:3001/api/payments`  
**Frontend:** `http://localhost:8080`

---

**Payment system migration complete!** 🎉
