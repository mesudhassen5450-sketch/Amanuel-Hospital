# Payment API Endpoint Testing Script
# Tests all payment endpoints to verify integration

Write-Host "`n🧪 Payment API Testing Script" -ForegroundColor Cyan
Write-Host "================================`n" -ForegroundColor Cyan

$baseUrl = "http://localhost:3001"
$testsPassed = 0
$testsFailed = 0

# Test 1: Health Check
Write-Host "Test 1: Health Check..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "$baseUrl/health" -Method GET
    if ($health.status -eq "ok") {
        Write-Host "✅ Health check passed" -ForegroundColor Green
        $testsPassed++
    } else {
        Write-Host "❌ Health check failed" -ForegroundColor Red
        $testsFailed++
    }
} catch {
    Write-Host "❌ Health check error: $($_.Exception.Message)" -ForegroundColor Red
    $testsFailed++
}

# Test 2: Authentication Required (No Token)
Write-Host "`nTest 2: Calculate endpoint requires authentication..." -ForegroundColor Yellow
try {
    $body = '{"consultationFee":500,"prescriptionFee":150,"labFee":200}'
    Invoke-RestMethod -Uri "$baseUrl/api/payments/calculate" -Method POST -ContentType "application/json" -Body $body
    Write-Host "❌ Should have required authentication" -ForegroundColor Red
    $testsFailed++
} catch {
    if ($_.Exception.Message -like "*401*" -or $_.Exception.Message -like "*Unauthorized*") {
        Write-Host "✅ Authentication correctly required (401)" -ForegroundColor Green
        $testsPassed++
    } else {
        Write-Host "❌ Unexpected error: $($_.Exception.Message)" -ForegroundColor Red
        $testsFailed++
    }
}

# Test 3: Login and Get Token
Write-Host "`nTest 3: Login to get authentication token..." -ForegroundColor Yellow
$token = $null
try {
    # Try admin login
    $loginBody = '{"username":"admin","password":"admin123"}'
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" -Method POST -ContentType "application/json" -Body $loginBody
    $token = $loginResponse.token
    Write-Host "✅ Login successful, token obtained" -ForegroundColor Green
    Write-Host "   Token: $($token.Substring(0, 30))..." -ForegroundColor Gray
    $testsPassed++
} catch {
    Write-Host "⚠️  Login failed (expected if no admin account exists)" -ForegroundColor Yellow
    Write-Host "   Create admin account to test authenticated endpoints" -ForegroundColor Gray
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Gray
    $testsFailed++
}

# Test 4: Calculate Billing (With Token)
if ($token) {
    Write-Host "`nTest 4: Calculate billing with authentication..." -ForegroundColor Yellow
    try {
        $billingBody = '{"consultationFee":500,"prescriptionFee":150,"labFee":200}'
        $billing = Invoke-RestMethod -Uri "$baseUrl/api/payments/calculate" `
            -Method POST `
            -ContentType "application/json" `
            -Headers @{Authorization="Bearer $token"} `
            -Body $billingBody
        
        if ($billing.total -eq 977.50 -and $billing.tax -eq 127.50) {
            Write-Host "✅ Billing calculation correct" -ForegroundColor Green
            Write-Host "   Subtotal: $($billing.subtotal) ETB" -ForegroundColor Gray
            Write-Host "   Tax (15%): $($billing.tax) ETB" -ForegroundColor Gray
            Write-Host "   Total: $($billing.total) ETB" -ForegroundColor Gray
            $testsPassed++
        } else {
            Write-Host "❌ Billing calculation incorrect" -ForegroundColor Red
            $testsFailed++
        }
    } catch {
        Write-Host "❌ Calculate billing error: $($_.Exception.Message)" -ForegroundColor Red
        $testsFailed++
    }
} else {
    Write-Host "`nTest 4: Skipped (no authentication token)" -ForegroundColor Gray
}

# Test 5: Create Invoice (Will fail with placeholder Chapa keys)
if ($token) {
    Write-Host "`nTest 5: Create invoice and initialize payment..." -ForegroundColor Yellow
    try {
        $invoiceBody = @{
            amount = 977.50
            currency = "ETB"
            email = "patient@hospital.com"
            firstName = "Test"
            lastName = "Patient"
            phoneNumber = "+251911234567"
            patientId = 1
        } | ConvertTo-Json
        
        $invoice = Invoke-RestMethod -Uri "$baseUrl/api/payments/invoices" `
            -Method POST `
            -ContentType "application/json" `
            -Headers @{Authorization="Bearer $token"} `
            -Body $invoiceBody
        
        if ($invoice.success -and $invoice.invoice.txRef) {
            Write-Host "✅ Invoice created successfully" -ForegroundColor Green
            Write-Host "   Transaction Ref: $($invoice.invoice.txRef)" -ForegroundColor Gray
            Write-Host "   Status: $($invoice.invoice.status)" -ForegroundColor Gray
            $testsPassed++
            
            # Save txRef for verification test
            $txRef = $invoice.invoice.txRef
        } else {
            Write-Host "❌ Invoice creation failed" -ForegroundColor Red
            $testsFailed++
        }
    } catch {
        $errorMsg = $_.Exception.Message
        if ($errorMsg -like "*Payment initialization failed*" -or $errorMsg -like "*Chapa*") {
            Write-Host "⚠️  Invoice creation failed (expected with placeholder Chapa keys)" -ForegroundColor Yellow
            Write-Host "   Update CHAPA_SECRET_KEY in server/.env for real payments" -ForegroundColor Gray
            Write-Host "   Error: $errorMsg" -ForegroundColor Gray
        } else {
            Write-Host "❌ Unexpected error: $errorMsg" -ForegroundColor Red
            $testsFailed++
        }
    }
} else {
    Write-Host "`nTest 5: Skipped (no authentication token)" -ForegroundColor Gray
}

# Test 6: Webhook Signature Verification
Write-Host "`nTest 6: Webhook endpoint (signature verification)..." -ForegroundColor Yellow
try {
    $webhookBody = @{
        event = "charge.success"
        data = @{
            tx_ref = "TEST-TX-REF-123"
            status = "success"
            payment_method = "telebirr"
            amount = 977.50
        }
    } | ConvertTo-Json
    
    # Try without signature (should fail)
    Invoke-RestMethod -Uri "$baseUrl/api/payments/webhook" -Method POST -ContentType "application/json" -Body $webhookBody
    Write-Host "❌ Webhook should require valid signature" -ForegroundColor Red
    $testsFailed++
} catch {
    if ($_.Exception.Message -like "*401*" -or $_.Exception.Message -like "*Unauthorized*") {
        Write-Host "✅ Webhook correctly requires signature verification" -ForegroundColor Green
        $testsPassed++
    } else {
        Write-Host "❌ Unexpected error: $($_.Exception.Message)" -ForegroundColor Red
        $testsFailed++
    }
}

# Test 7: Server Endpoints Registration
Write-Host "`nTest 7: Payment routes registered..." -ForegroundColor Yellow
try {
    $rootInfo = Invoke-RestMethod -Uri "$baseUrl/" -Method GET
    if ($rootInfo.endpoints.payments) {
        Write-Host "✅ Payment routes registered at /api/payments" -ForegroundColor Green
        $testsPassed++
    } else {
        Write-Host "❌ Payment routes not found in server endpoints" -ForegroundColor Red
        $testsFailed++
    }
} catch {
    Write-Host "❌ Could not verify routes: $($_.Exception.Message)" -ForegroundColor Red
    $testsFailed++
}

# Summary
Write-Host "`n================================" -ForegroundColor Cyan
Write-Host "📊 Test Summary" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host "Tests Passed: $testsPassed" -ForegroundColor Green
Write-Host "Tests Failed: $testsFailed" -ForegroundColor Red
Write-Host "Total Tests: $($testsPassed + $testsFailed)`n" -ForegroundColor Cyan

if ($testsFailed -eq 0) {
    Write-Host "🎉 All tests passed!" -ForegroundColor Green
} else {
    Write-Host "⚠️  Some tests failed. See details above." -ForegroundColor Yellow
}

Write-Host "`n📝 Notes:" -ForegroundColor Cyan
Write-Host "- Authentication tests require an admin account in the database" -ForegroundColor Gray
Write-Host "- Invoice creation requires valid Chapa API keys in server/.env" -ForegroundColor Gray
Write-Host "- Webhook testing requires valid CHAPA_WEBHOOK_SECRET" -ForegroundColor Gray
Write-Host "`n"
