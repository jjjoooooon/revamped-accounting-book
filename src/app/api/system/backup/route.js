import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET() {
    try {
        // 1. Check Authentication (Superadmin only)
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'superadmin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // 2. Fetch all mosque data (excluding deleted records)
        const [members, invoices, payments, expenses, incomes, donations, categories, bankAccounts, ledger] = await Promise.all([
            prisma.member.findMany({ where: { deletedAt: null } }),
            prisma.invoice.findMany({ where: { deletedAt: null } }),
            prisma.payment.findMany({ where: { deletedAt: null } }),
            prisma.expense.findMany({ where: { deletedAt: null } }),
            prisma.income.findMany({ where: { deletedAt: null } }),
            prisma.donation.findMany({ where: { deletedAt: null } }),
            prisma.category.findMany({ where: { deletedAt: null } }),
            prisma.bankAccount.findMany({ where: { deletedAt: null } }),
            prisma.ledger.findMany({ where: { deletedAt: null } }),
        ]);

        // 3. Create backup object
        const backup = {
            version: '1.0',
            exportedAt: new Date().toISOString(),
            exportedBy: session.user.name,
            data: {
                members,
                invoices,
                payments,
                expenses,
                incomes,
                donations,
                categories,
                bankAccounts,
                ledger,
            },
            stats: {
                members: members.length,
                invoices: invoices.length,
                payments: payments.length,
                expenses: expenses.length,
                incomes: incomes.length,
                donations: donations.length,
                categories: categories.length,
                bankAccounts: bankAccounts.length,
                ledger: ledger.length,
            }
        };

        // 4. Return as JSON download
        return new NextResponse(JSON.stringify(backup, null, 2), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Content-Disposition': `attachment; filename="mosque-backup-${new Date().toISOString().split('T')[0]}.json"`,
            },
        });

    } catch (error) {
        console.error("Backup failed:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
