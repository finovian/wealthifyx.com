# Invoice API Documentation

This document describes the two billing APIs integrated into the single transaction detail page.

---

## Table of Contents
1. [Get Invoice by Transaction ID](#1-get-invoice-by-transaction-id)
2. [Send Invoice to Email](#2-send-invoice-to-email)
3. [Integration Logic](#integration-logic)
4. [UI Behavior](#ui-behavior)

---

## 1. Get Invoice by Transaction ID

### Purpose
Fetches invoice breakdown details for a transaction, including base amount, GST, TDS, platform fees, and other charges.

### Endpoint
```
POST /api/v1/billing/invoices/invoice-by-transaction-id
```

### Base URL
- **Production**: `https://billing.experta.live/api/v1`
- **Staging**: `https://stg-billing.experta.live/api/v1`

### Headers
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer {JWT_TOKEN}"
}
```

### Request Body
```json
{
  "transactionId": "string"
}
```

#### Parameters
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| transactionId | string | Yes | Transaction ID or Reference ID |

### Response Examples

#### Success Response 1 (Full Details)
```json
{
  "status": "success",
  "result": {
    "baseAmount": 60,
    "gstAmount": 10.8,
    "tdsAmount": 4.8,
    "platformFeeAmount": 12,
    "expertCommissionAmount": 0,
    "totalAmount": 87.6
  }
}
```

#### Success Response 2 (Partial Details)
```json
{
  "status": "success",
  "result": {
    "baseAmount": 60,
    "gstAmount": 10.8,
    "totalAmount": 70.8
  }
}
```

#### Error Response (No Data Found)
```json
{
  "status": "error",
  "message": "No invoice found"
}
```

### Response Fields

All fields in the `result` object are **optional** and will only be present if applicable to that transaction.

| Field | Type | Description |
|-------|------|-------------|
| baseAmount | number | Base transaction amount before taxes/fees |
| gstAmount | number | GST (Goods and Services Tax) amount |
| tdsAmount | number | TDS (Tax Deducted at Source) amount |
| platformFeeAmount | number | Platform fee charged |
| expertCommissionAmount | number | Commission amount for expert |
| totalAmount | number | Final total amount after all calculations |

### HTTP Status Codes
- `200`: Success
- `404`: Invoice not found
- `401`: Unauthorized (invalid token)
- `500`: Server error

---

## 2. Send Invoice to Email

### Purpose
Sends the invoice to the user's registered email address via Zoho Books.

### Endpoint
```
POST /api/v1/billing/invoices/send-invoice-to-zoho-on-email
```

### Base URL
- **Production**: `https://billing.experta.live/api/v1`
- **Staging**: `https://stg-billing.experta.live/api/v1`

### Headers
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer {JWT_TOKEN}"
}
```

### Request Body
```json
{
  "transactionId": "string"
}
```

#### Parameters
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| transactionId | string | Yes | Transaction ID or Reference ID |

### Response Examples

#### Success Response
```json
{
  "status": "success",
  "response": "Your invoice has been sent to mail."
}
```

#### Error Response
```json
{
  "status": "error",
  "message": "Failed to send invoice"
}
```

### HTTP Status Codes
- `200`: Success
- `404`: Invoice not found
- `401`: Unauthorized (invalid token)
- `500`: Server error

---

## Integration Logic

### Transaction ID Selection

Both APIs use the same logic to determine which ID to pass:

```
1. IF reference starts with "pay" (case-insensitive):
   → Use transactionId
   
2. ELSE IF reference is available and not empty:
   → Use reference
   
3. ELSE:
   → Use transactionId (default)
```

#### Examples

| Scenario | Reference Value | Transaction ID | ID Passed to API |
|----------|----------------|----------------|------------------|
| Razorpay payment | `pay_123abc` | `txn_456` | `txn_456` |
| Razorpay payment | `PAY_XYZ789` | `txn_789` | `txn_789` |
| Regular transaction | `ref_order_123` | `txn_abc` | `ref_order_123` |
| No reference | `null` | `txn_def` | `txn_def` |
| Empty reference | `""` | `txn_ghi` | `txn_ghi` |

### Why This Logic?

Razorpay payment IDs (starting with "pay") are not stored in the billing system. These transactions are linked via the wallet transaction ID, so we use the `transactionId` instead of the payment reference.

---

## UI Behavior

### Invoice Summary Display

#### Loading State
- Shows circular progress indicator while fetching invoice data
- Displayed immediately when page loads

#### Success State
- Dynamically displays all fields returned from API
- Fields are auto-formatted from camelCase to readable labels:
  - `baseAmount` → "Base Amount"
  - `gstAmount` → "GST Amount"
  - `tdsAmount` → "TDS Amount"
  - `platformFeeAmount` → "Platform Fee Amount"
  - `expertCommissionAmount` → "Expert Commission Amount"
  - `totalAmount` → "Total Amount"

#### Error/No Data State
- Summary section is completely hidden
- No error message shown to user
- Page continues to display other transaction details

### Download Receipt Button Visibility

The button is conditionally displayed based on transaction type:

#### Always Visible For:
- `DEPOSIT` (Money Added)
- `WITHDRAWAL`
- `WITHDRAWAL_PAID`
- `EARNING`

#### Conditionally Visible:
- `AMOUNT_HOLD`: Only shown if `reference` is available

#### Hidden For:
- All other transaction types

### Download Receipt Button Behavior

#### Default State
```
[📥 Download Receipt]
```

#### Loading State (during API call)
```
[⏳ Sending...]
```
- Button is disabled
- Icon changes to spinner
- Text changes to "Sending..."

#### Success
- Toast message: "Your invoice has been sent to mail."
- Button returns to default state

#### Error
- Toast message: "Failed to send invoice" (or API error message)
- Button returns to default state

---

## Implementation Code References

### API Methods
- **File**: `lib/core/network/api_calls.dart`
- **Methods**:
  - `getInvoiceByTransactionId()` - Line ~4362
  - `sendInvoiceToEmail()` - Line ~4403

### UI Integration
- **File**: `lib/presentation/wallet_settings/single_transaction_detail.dart`
- **Components**:
  - `_fetchInvoiceData()` - Fetches invoice on page load
  - `_SummaryWidget` - Displays invoice breakdown
  - `_DownloadReceiptButton` - Send invoice to email
  - `_shouldShowDownloadButton()` - Button visibility logic

### API Endpoint Configuration
- **File**: `lib/core/network/api_endpoints.dart`
- **Property**: `billingBaseUrl`

---

## Testing Scenarios

### Test Case 1: Full Invoice Data
**Given**: Transaction with all fee breakdowns
**When**: Page loads
**Then**: 
- Summary shows all fields (base, GST, TDS, platform fee, commission, total)
- Download button visible (if eligible transaction type)

### Test Case 2: Partial Invoice Data
**Given**: Transaction with only base amount and GST
**When**: Page loads
**Then**: 
- Summary shows only base amount, GST, and total
- Other fields are not displayed

### Test Case 3: No Invoice Data
**Given**: Transaction without invoice data
**When**: Page loads
**Then**: 
- Summary section is hidden
- Rest of page displays normally

### Test Case 4: Razorpay Payment Reference
**Given**: Transaction with reference = "pay_ABC123"
**When**: Download button clicked
**Then**: 
- API receives transactionId (not reference)
- Email sent successfully

### Test Case 5: Regular Reference
**Given**: Transaction with reference = "order_XYZ789"
**When**: Download button clicked
**Then**: 
- API receives reference value
- Email sent successfully

### Test Case 6: AMOUNT_HOLD Without Reference
**Given**: Transaction type = "AMOUNT_HOLD", reference = null
**When**: Page loads
**Then**: 
- Download button is hidden

### Test Case 7: AMOUNT_HOLD With Reference
**Given**: Transaction type = "AMOUNT_HOLD", reference = "ref_123"
**When**: Page loads
**Then**: 
- Download button is visible

---

## Error Handling

### Network Errors
- Shows toast: "Failed to send invoice"
- Button returns to enabled state
- User can retry

### 404 Not Found
- Invoice summary hidden (for get invoice API)
- Shows toast error (for send email API)

### 401 Unauthorized
- Handled by global interceptor
- User redirected to login

### 500 Server Error
- Shows toast: "Failed to send invoice"
- Logged to console for debugging

---

## Notes for Backend Team

1. **Transaction ID Format**: Both APIs accept either wallet `transactionId` or `reference` values
2. **Email Recipient**: Invoice is sent to the email address registered with the user account
3. **Invoice Generation**: Zoho Books integration handles PDF generation
4. **Field Flexibility**: Frontend dynamically displays any fields returned in the `result` object
5. **Case Sensitivity**: Reference matching for "pay" prefix is case-insensitive

---

## Changelog

### Version 1.0 (January 2026)
- Initial integration of invoice APIs
- Dynamic field rendering
- Conditional button visibility
- Smart ID selection logic for Razorpay payments

---
