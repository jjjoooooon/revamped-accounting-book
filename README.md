# Masjidh Accounting Solution

A comprehensive, full-stack accounting and management system tailored for Mosques. This solution handles Donations, Sanda (Membership Fees), Billing, Expenses, and Financial Reporting with a robust role-based access control system.

Developed By: **Inzeedo (PVT) Ltd.**

## 🚀 Features

- **Dashboard**: Real-time financial overview with charts and recent activity.
- **Accounting**:
  - Bank Account Management (Balances, Deposits, Withdrawals).
  - Income & Expense Tracking with Categories.
  - Automated Ledger Entries.
  - Double-entry bookkeeping principles.
- **Donations**:
  - Track donations by Donor or Member.
  - Anonymous donation support.
  - Receipt generation.
- **Billing (Sanda)**:
  - Member management.
  - Automated Monthly Invoice Generation.
  - Arrears/Outstanding tracking.
  - Payment history.
- **Reports**:
  - Financial Statements (Income Statement, Balance Sheet).
  - Monthly Performance.
  - Sanda Collection Reports.
- **Admin Panel**:
  - User Management (Approve/Reject signups).
  - Role-based permissions (Superadmin, User).
- **Settings**:
  - Customize Mosque Name, Logo, Currency, and Contact Info.

---

## 🛠 Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: JavaScript / Node.js
- **Database**: PostgreSQL
- **ORM**: [Prisma](https://www.prisma.io/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/) & [Shadcn/UI](https://ui.shadcn.com/)

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

1.  **Node.js** (v18 or higher recommended) - [Download](https://nodejs.org/)
2.  **npm** (comes with Node.js)
3.  **PostgreSQL Database** - You can host it locally or use a cloud provider like [Supabase](https://supabase.com/) or [Neon](https://neon.tech/).

---

## 📥 New Mosque Setup Guide

Follow these steps to install and set up the system for a new mosque.

### Step 1: Clone the Repository

```bash
git clone <repository_url>
cd masjidh-accounting-solution
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Configure Environment Variables

1.  Create a `.env` file in the root directory (copy from `.env.example`).

    ```bash
    cp .env.example .env
    ```

2.  Open `.env` and fill in your database details and secret keys:

    ```env
    # Database Connection String (PostgreSQL)
    DATABASE_URL="postgresql://user:password@host:port/database?schema=public"

    # Direct connection (required for some cloud providers like Supabase, otherwise same as DATABASE_URL)
    DIRECT_URL="postgresql://user:password@host:port/database?schema=public"

    # NextAuth Configuration
    # Generate a secure secret using: openssl rand -base64 32
    NEXTAUTH_SECRET="your_generated_secret_key_here"

    # Base URL of your application (http://localhost:3000 for local dev)
    NEXTAUTH_URL="http://localhost:3000"
    ```

### Step 4: Database Setup

Initialize the database schema using Prisma.

1.  **Generate Prisma Client:**
    ```bash
    npx prisma generate
    ```

2.  **Push Schema to Database:**
    ```bash
    npx prisma db push
    ```
    *(Alternatively, if you prefer migrations: `npx prisma migrate dev`)*

### Step 5: Seed Initial Data

Create the default superadmin account and initial configurations.

```bash
npx prisma db seed
```

> **Note:** This creates a default superadmin user.
> - **Email:** `mrjoon005@gmail.com`
> - **Password:** `12345678`

### Step 6: Start the Application

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ⚙️ Initial Configuration

After logging in for the first time:

1.  **Login**: Use the default credentials (`mrjoon005@gmail.com` / `12345678`).
2.  **Change Password**: Go to your profile or User Management (if available) and change the password immediately for security.
3.  **Update App Settings**:
    - Navigate to **Settings** (usually in the sidebar or admin menu).
    - Update the **Mosque Name**, **Address**, **Phone**, and **Email**.
    - Upload your Mosque's **Logo**.
    - These details will appear on all generated invoices and receipts.

---

## 📂 Folder Structure

- `src/app`: Application pages and API routes (App Router).
- `src/app/api`: Backend API endpoints.
- `src/components`: Reusable UI components.
- `src/lib`: Utility functions and database client (`prisma.js`).
- `prisma`: Database schema (`schema.prisma`) and seed script.
- `public`: Static assets (images, icons).

---

## 📜 Scripts

- `npm run dev`: Runs the app in development mode.
- `npm run build`: Builds the app for production.
- `npm start`: Runs the built app in production mode.
- `npm run lint`: Checks for code issues using Biome.
- `npm run format`: Formats code using Biome.

---

## ❓ Troubleshooting

**Database Connection Errors:**
- Ensure your PostgreSQL server is running.
- Check if the `DATABASE_URL` in `.env` is correct.
- If using Supabase, ensure you are using the Transaction Pooler URL for `DATABASE_URL` and Session Pooler for `DIRECT_URL` (or verify their specific docs).

**Login Issues:**
- If you can't login, ensure you ran `npx prisma db seed`.
- Check browser console for network errors.
- Ensure `NEXTAUTH_SECRET` is set in `.env`.

**"Prisma Client not initialized":**
- Run `npx prisma generate` again and restart the server.

---

## API Documentation

For developers, detailed API documentation is available in [API_DOCUMENTATION.md](./API_DOCUMENTATION.md).
