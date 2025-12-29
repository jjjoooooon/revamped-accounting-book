# API Documentation

This document outlines the API endpoints available in the application.

## Base URL
All API routes are prefixed with `/api`.

## Modules
- [Accounting](#accounting)
- [Admin](#admin)
- [Auth](#auth)
- [Billing](#billing)
- [Dashboard](#dashboard)
- [Donations](#donations)
- [Members](#members)
- [Reports](#reports)
- [Sanda](#sanda)
- [System/Test](#systemtest)
- [Simple Income/Expenses](#simple-incomeexpenses-legacysimple)

---

## Accounting

### Bank Accounts
Base URL: `/api/accounting/bank-accounts`

#### GET
Returns a list of all bank accounts.

**Response:**
- `200 OK`: Array of BankAccount objects.
  ```json
  [
    {
      "id": "string",
      "bankName": "string",
      "accountName": "string",
      "accountNumber": "string",
      "branch": "string?",
      "type": "string",
      "balance": number,
      "status": "string",
      "color": "string?",
      "createdAt": "date",
      "updatedAt": "date"
    }
  ]
  ```

#### POST
Creates a new bank account.

**Payload:**
- `bankName` (string, required)
- `accountName` (string)
- `accountNumber` (string, required)
- `branch` (string)
- `type` (string, default: 'Savings')
- `balance` (number, default: 0)
- `color` (string)

**Response:**
- `201 Created`: The created BankAccount object.
- `400 Bad Request`: If missing required fields.

#### PUT
Updates a bank account.

**Payload:**
- `id` (string, required)
- `bankName` (string)
- `accountName` (string)
- `accountNumber` (string)
- `branch` (string)
- `type` (string)
- `balance` (number)
- `color` (string)
- `status` (string)

**Response:**
- `200 OK`: The updated BankAccount object.
- `400 Bad Request`: If ID is missing.

### Categories
Base URL: `/api/accounting/categories`

#### GET
Returns a list of categories with current month's spending.

**Response:**
- `200 OK`: Array of Category objects with `current_spend` field.
  ```json
  [
    {
      "id": "string",
      "name": "string",
      "description": "string?",
      "status": "string",
      "createdAt": "date",
      "updatedAt": "date",
      "budgetLimit": number,
      "color": "string?",
      "current_spend": number
    }
  ]
  ```

#### POST
Creates a new category.

**Payload:**
- `name` (string, required)
- `description` (string)
- `color` (string, default: 'emerald')
- `budget_limit` (number, default: 0)
- `status` (string, default: 'Active')

**Response:**
- `201 Created`: The created Category object.
- `400 Bad Request`: If name is missing.

### Categories (Single)
Base URL: `/api/accounting/categories/[id]`

#### PUT
Updates a category.

**Payload:**
- `name` (string)
- `description` (string)
- `color` (string)
- `budget_limit` (number)
- `status` (string)

**Response:**
- `200 OK`: The updated Category object.

#### DELETE
Deletes a category.

**Response:**
- `200 OK`: `{ "message": "Category deleted" }`

### Expenses (Accounting)
Base URL: `/api/accounting/expenses`

#### GET
Fetches expenses with optional filters.

**Params:**
- `category` (string, optional): Filter by category ID.
- `search` (string, optional): Search by description.

**Response:**
- `200 OK`: Array of Expense objects including Category.

#### POST
Creates a new expense and updates ledger/balance if bank account is provided.

**Payload:**
- `amount` (number, required)
- `date` (date string)
- `categoryId` (string, required)
- `description` (string)
- `payee` (string, optional)
- `bankAccountId` (string, optional)

**Response:**
- `201 Created`: The created Expense object.
- `400 Bad Request`: If amount or categoryId is missing.

### Income (Accounting)
Base URL: `/api/accounting/income`

#### GET
Fetches a comprehensive income summary including Donations, Sanda Payments, and Other Income.

**Params:**
- `from` (date string, optional): Start date.
- `to` (date string, optional): End date.

**Response:**
- `200 OK`:
  ```json
  {
    "transactions": [
      {
        "id": "string",
        "date": "date",
        "source": "Donation" | "Sanda" | "Other",
        "reference": "string",
        "category": "string",
        "method": "string",
        "amount": number
      }
    ],
    "stats": {
      "total": number,
      "sanda": number,
      "donations": number,
      "other": number
    },
    "chartData": [
      {
        "name": "Month",
        "Sanda": number,
        "Donations": number,
        "Other": number
      }
    ]
  }
  ```

### Ledger
Base URL: `/api/accounting/ledger`

#### GET
Fetches ledger entries.

**Params:**
- `bankAccountId` (string, optional): Filter by bank account ID.

**Response:**
- `200 OK`: Array of Ledger objects including BankAccount.

### Other Income
Base URL: `/api/accounting/other-income`

#### GET
Fetches other income entries.

**Params:**
- `categoryId` (string, optional): Filter by category ID.

**Response:**
- `200 OK`: Array of Income objects including Category.

#### POST
Creates a new other income entry and corresponding ledger entry.

**Payload:**
- `amount` (number, required)
- `description` (string)
- `date` (date string)
- `categoryId` (string, required)

**Response:**
- `200 OK`: The created Income object.
- `400 Bad Request`: If amount or categoryId is missing.

#### PUT
Updates an other income entry and corresponding ledger entry.

**Payload:**
- `id` (string, required)
- `amount` (number)
- `description` (string)
- `date` (date string)
- `categoryId` (string)

**Response:**
- `200 OK`: The updated Income object.

#### DELETE
Deletes an other income entry and its corresponding ledger entry.

**Params:**
- `id` (string, required)

**Response:**
- `200 OK`: `{ "success": true }`

---

## Admin

### Users
Base URL: `/api/admin/users`
**Authentication:** Required (Role: `superadmin`)

#### GET
Returns a list of all users.

**Response:**
- `200 OK`: Array of User objects (without password).
  ```json
  [
    {
      "id": "string",
      "name": "string?",
      "email": "string?",
      "role": "string",
      "status": "string",
      "createdAt": "date"
    }
  ]
  ```
- `403 Forbidden`: If not authorized.

#### POST
Creates a new user (automatically approved).

**Payload:**
- `name` (string)
- `email` (string, required)
- `password` (string, required)
- `role` (string, default: 'user')

**Response:**
- `201 Created`: The created User object (without password).
- `400 Bad Request`: If missing fields or user already exists.
- `403 Forbidden`: If not authorized.

### Approve User
Base URL: `/api/admin/users/[id]/approve`
**Authentication:** Required (Role: `superadmin`)

#### POST
Approves a pending user.

**Response:**
- `200 OK`: The updated User object.
- `403 Forbidden`: If not authorized.

## Auth

### NextAuth
Base URL: `/api/auth/[...nextauth]`

Handles authentication using NextAuth.js.

#### Providers
- **Credentials**: Email and Password.

#### Callbacks
- **JWT**: Adds `id` and `role` to the token.
- **Session**: Adds `id` and `role` to the session user object.

#### Error Handling
- Throws "Your account is pending approval." if user status is not 'approved'.

---

## Billing

### History
Base URL: `/api/billing/history`

#### GET
Returns payment history with optional filters.

**Params:**
- `from` (date string, optional): Start date.
- `to` (date string, optional): End date.
- `search` (string, optional): Search by payment ID or member name.

**Response:**
- `200 OK`: Array of payment history objects.
  ```json
  [
    {
      "id": "string",
      "member_id": "string",
      "name": "string",
      "amount": number,
      "date": "date",
      "method": "string",
      "months_covered": ["string"],
      "status": "string"
    }
  ]
  ```

### Invoices
Base URL: `/api/billing/invoices`

#### GET
Returns a list of invoices with optional filters.

**Params:**
- `period` (string, optional): Filter by period (e.g., 'Jan 2024').
- `status` (string, optional): Filter by status ('pending', 'paid', 'partial', 'overdue').

**Response:**
- `200 OK`: Array of invoice summary objects.
  ```json
  [
    {
      "id": "string", // Invoice No
      "internalId": "string",
      "member_id": "string",
      "name": "string",
      "amount": number,
      "paidAmount": number,
      "balance": number,
      "status": "string",
      "due_date": "date"
    }
  ]
  ```

### Single Invoice
Base URL: `/api/billing/invoices/[id]`

#### GET
Fetches details of a single invoice by ID or Invoice Number.

**Params:**
- `id` (string, required): The invoice internal ID or Invoice Number.

**Response:**
- `200 OK`: Invoice object including member and payments.
- `404 Not Found`: If invoice does not exist.

### Outstanding
Base URL: `/api/billing/outstanding`

#### GET
Returns a list of members with outstanding arrears.

**Response:**
- `200 OK`: Array of outstanding member objects.
  ```json
  [
    {
      "id": "string",
      "name": "string",
      "phone": "string",
      "arrears": number,
      "months_due": number,
      "details": [
        {
          "period": "string",
          "amount": number,
          "paid": number,
          "balance": number
        }
      ],
      "last_paid": "string",
      "status": "string"
    }
  ]
  ```

### Pending Invoices
Base URL: `/api/billing/pending`

#### GET
Fetches pending invoices for a specific member.

**Params:**
- `memberId` (string, required)

**Response:**
- `200 OK`: Array of Invoice objects.
- `400 Bad Request`: If memberId is missing.

---

## Dashboard

### Dashboard Stats
Base URL: `/api/dashboard`

#### GET
Fetches comprehensive dashboard statistics, recent activity, and chart data.

**Response:**
- `200 OK`:
  ```json
  {
    "stats": [
      {
        "title": "Total Income",
        "value": "string",
        "change": "string",
        "trend": "up" | "down" | "neutral",
        "color": "string",
        "bg": "string",
        "iconName": "string"
      }
      // ... other stats
    ],
    "activities": [
      {
        "id": "string",
        "type": "Donation" | "Sanda" | "Other Income" | "Expense",
        "title": "string",
        "amount": "string",
        "date": "date",
        "status": "string",
        "rawDate": "date"
      }
    ],
    "chartData": [
      {
        "name": "Month",
        "Income": number,
        "Expense": number
      }
    ]
  }
  ```

---

## Donations

### Donations List
Base URL: `/api/donations`

#### GET
Returns a list of all donations.

**Response:**
- `200 OK`: Array of Donation objects including Member.
  ```json
  [
    {
      "id": "string",
      "amount": number,
      "date": "date",
      "purpose": "string",
      "paymentMethod": "string",
      "isAnonymous": boolean,
      "donorType": "string",
      "donorName": "string?",
      "memberId": "string?",
      "createdAt": "date",
      "updatedAt": "date"
    }
  ]
  ```

#### POST
Creates a new donation. Also creates a ledger entry and updates bank balance if applicable.

**Payload:**
- `amount` (number, required)
- `date` (date string)
- `purpose` (string, required)
- `paymentMethod` (string)
- `isAnonymous` (boolean)
- `donorType` (string)
- `donorName` (string)
- `memberId` (string)
- `bankAccountId` (string, optional)

**Response:**
- `201 Created`: The created Donation object.
- `400 Bad Request`: If amount or purpose is missing.

### Single Donation
Base URL: `/api/donations/[id]`

#### GET
Fetches a single donation by ID.

**Response:**
- `200 OK`: Donation object including Member.
- `404 Not Found`: If donation does not exist.

#### PUT
Updates a donation.

**Payload:**
- `amount` (number)
- `date` (date string)
- `purpose` (string)
- `paymentMethod` (string)
- `isAnonymous` (boolean)
- `donorType` (string)
- `donorName` (string)
- `memberId` (string)

**Response:**
- `200 OK`: The updated Donation object.

#### DELETE
Deletes a donation.

**Response:**
- `200 OK`: `{ "message": "Donation deleted" }`

---

## Members

### Members List
Base URL: `/api/members`

#### GET
Returns a list of all members.

**Response:**
- `200 OK`: Array of Member objects.
  ```json
  [
    {
      "id": "string",
      "name": "string",
      "address": "string?",
      "email": "string?",
      "contact": "string",
      "paymentFrequency": "string",
      "amountPerCycle": number,
      "startDate": "date",
      "profilePicture": "string?",
      "status": "string",
      "createdAt": "date",
      "updatedAt": "date"
    }
  ]
  ```

#### POST
Creates a new member.

**Payload:**
- `name` (string, required)
- `address` (string)
- `email` (string)
- `contact` (string, required)
- `payment_frequency` (string, default: 'Monthly')
- `amount_per_cycle` (number, default: 0)
- `start_date` (date string)
- `profilePicture` (string)

**Response:**
- `201 Created`: The created Member object.
- `400 Bad Request`: If name or contact is missing.

---

## Reports

### Financial Report
Base URL: `/api/reports/financial`

#### GET
Returns a comprehensive financial report including summary, income statement, balance sheet, and monthly performance.

**Params:**
- `from` (date string, optional): Start date.
- `to` (date string, optional): End date.

**Response:**
- `200 OK`:
  ```json
  {
    "summary": {
      "totalIncome": number,
      "totalExpense": number,
      "netSurplus": number,
      "cashOnHand": number,
      "bankBalance": number,
      "pendingBills": number
    },
    "incomeStatement": {
      "income": [ { "category": "string", "amount": number } ],
      "expenses": [ { "category": "string", "amount": number } ]
    },
    "balanceSheet": {
      "assets": [ { "name": "string", "value": number } ],
      "liabilities": [ { "name": "string", "value": number } ],
      "equity": [ { "name": "string", "value": number } ]
    },
    "monthlyPerformance": [
      {
        "name": "Month",
        "Income": number,
        "Expense": number
      }
    ]
  }
  ```

### Sanda Report
Base URL: `/api/reports/sanda`

#### GET
Returns a report on Sanda collection.

**Params:**
- `period` (string, optional): Filter by period (e.g., '2025-01').

**Response:**
- `200 OK`:
  ```json
  {
    "summary": {
      "totalExpected": number,
      "totalCollected": number,
      "pendingCount": number,
      "paidCount": number
    },
    "invoices": [
      // Array of Invoice objects with member details
    ]
  }
  ```

---

## Sanda

### Generate Sanda
Base URL: `/api/sanda/generate`

#### POST
Generates Sanda invoices for all active members for a specific period. Skips if invoice already exists.

**Payload:**
- `period` (string, required): Format 'YYYY-MM' (e.g., '2025-01').

**Response:**
- `200 OK`:
  ```json
  {
    "message": "Sanda generation complete",
    "results": {
      "generated": number,
      "skipped": number,
      "errors": number
    }
  }
  ```
- `400 Bad Request`: If period is missing.

### Pay Sanda
Base URL: `/api/sanda/pay`

#### POST
Processes a Sanda payment. Updates invoice, bank balance, and ledger.

**Payload:**
- `invoiceId` (string, required)
- `amount` (number, required)
- `method` (string, default: 'Cash')
- `bankAccountId` (string, optional)

**Response:**
- `201 Created`: The created Payment object.
- `400 Bad Request`: If invoiceId or amount is missing.
- `500 Internal Server Error`: If invoice not found or other error.

---

## System/Test

### Test API
Base URL: `/api/test`

#### GET
Simple health check endpoint.

**Response:**
- `200 OK`: `{ "message": "API is working!" }`

---

## Simple Income/Expenses (Legacy/Simple)

These endpoints might be used for simpler UI components or legacy support. They do not handle ledger or complex transaction logic.

### Expenses (Simple)
Base URL: `/api/expenses`

#### GET
Fetches all expenses sorted by date.

**Response:**
- `200 OK`: Array of Expense objects including Category.

#### POST
Creates a new expense (simple).

**Payload:**
- `amount` (number, required)
- `description` (string)
- `date` (date string)
- `categoryId` (string, required)

**Response:**
- `201 Created`: The created Expense object.
- `400 Bad Request`: If amount or categoryId is missing.

### Income (Simple)
Base URL: `/api/income`

#### GET
Fetches all income entries sorted by date.

**Response:**
- `200 OK`: Array of Income objects including Category.

#### POST
Creates a new income entry (simple).

**Payload:**
- `amount` (number, required)
- `description` (string)
- `date` (date string)
- `categoryId` (string, required)

**Response:**
- `201 Created`: The created Income object.
- `400 Bad Request`: If amount or categoryId is missing.
