# 💳 Payment API Quick Reference

**Base URL:** `http://localhost:3001/api/payments`

---

## 🔐 Authentication

All endpoints (except webhook) require JWT Bearer token:

```typescript
headers: {
  'Authorization': 'Bearer <your_jwt_token>',
  'Content-Type': 'application/json'
}
```

Get token from: `POST /api/auth/login`

---

## 📍 Endpoints

### 1. Calculate Billing
```
POST /api/payments/calculate
```

**Request:**
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
  "currency": "ETB"
}
```

---

### 2. Create Invoice & Initialize Payment
```
POST /api/payments/invoices
```

**Request:**
```json
{
  "amount": 977.50,
  "currency": "ETB",
  "email": "patient@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+251911234567",
  "patientId": 1,
  "appointmentId": 1
}
```

**Response:**
```json
{
  "success": true,
  "invoice": {
    "id": "uuid",
    "txRef": "AM-INV-1234567890-ABCD",
    "amount": 977.50,
    "currency": "ETB",
    "status": "PENDING"
  },
  "checkoutUrl": "https://checkout.chapa.co/..."
}
```

---

### 3. Verify Payment
```
GET /api/payments/verify/:txRef
```

**Response:**
```json
{
  "success": true,
  "status": "PAID",
  "invoice": {
    "txRef": "AM-INV-1234567890-ABCD",
    "amount": 977.50,
    "status": "PAID",
    "paymentMethod": "telebirr",
    "paidAt": "2026-08-19T10:30:00Z"
  }
}
```

---

### 4. Get Invoice
```
GET /api/payments/invoices/:txRef
```

**Response:**
```json
{
  "success": true,
  "invoice": {
    "id": "uuid",
    "txRef": "AM-INV-1234567890-ABCD",
    "amount": 977.50,
    "status": "PAID"
  }
}
```

---

### 5. Get Patient Invoices
```
GET /api/payments/invoices/patient/:patientId
```

**Response:**
```json
{
  "success": true,
  "count": 3,
  "invoices": [...]
}
```

---

### 6. Webhook (Public)
```
POST /api/payments/webhook
```

**Headers:**
- `x-chapa-signature`: HMAC-SHA256 signature

**Payload:**
```json
{
  "event": "charge.success",
  "data": {
    "tx_ref": "AM-INV-1234567890-ABCD",
    "status": "success",
    "payment_method": "telebirr"
  }
}
```

---

## 🎯 Frontend Usage

### Import Service
```typescript
import {
  calculateBilling,
  createInvoiceAndInitializePayment,
  verifyPayment,
  redirectToCheckout,
} from '@/lib/api/payment-api';
```

### Example Flow
```typescript
// 1. Calculate
const billing = await calculateBilling({
  consultationFee: 500,
  prescriptionFee: 150,
  labFee: 200
});

// 2. Create Invoice
const invoice = await createInvoiceAndInitializePayment({
  amount: billing.total,
  email: 'patient@example.com',
  patientId: 123,
  ...
});

// 3. Redirect to Payment
redirectToCheckout(invoice.checkoutUrl);

// 4. After redirect back, verify
const result = await verifyPayment(txRef);
if (result.status === 'PAID') {
  // Show success
}
```

---

## ⚙️ Configuration

### Environment Variables
```env
# server/.env
CHAPA_SECRET_KEY="your_secret_key"
CHAPA_WEBHOOK_SECRET="your_webhook_secret"
BACKEND_URL="http://localhost:3001"
FRONTEND_URL="http://localhost:8080"
```

---

## 🎨 Payment Status

| Status | Description | Color |
|--------|-------------|-------|
| `PENDING` | Awaiting payment | Yellow |
| `PAID` | Successfully paid | Green |
| `FAILED` | Payment failed | Red |
| `CANCELLED` | Cancelled by user | Gray |

---

## 🧪 Quick Test

```powershell
# 1. Get token
$token = "your_jwt_token"

# 2. Calculate billing
$body = '{"consultationFee":500,"prescriptionFee":150,"labFee":200}'
Invoke-RestMethod -Uri "http://localhost:3001/api/payments/calculate" `
  -Method POST -ContentType "application/json" `
  -Headers @{Authorization="Bearer $token"} -Body $body

# 3. Run full tests
.\test-payment-endpoints.ps1
```

---

## 📚 Documentation

- **Full Guide:** `PAYMENT_API_TESTING.md`
- **Migration Details:** `PAYMENT_MIGRATION_COMPLETE.md`
- **Test Script:** `test-payment-endpoints.ps1`

---

## 🆘 Common Issues

| Issue | Solution |
|-------|----------|
| 401 Unauthorized | Check JWT token validity |
| Payment init fails | Verify Chapa API keys |
| Webhook not working | Check HMAC signature |
| CORS errors | Verify CORS_ORIGIN in .env |

---

**Quick Access:** All payment docs in project root directory 📁
