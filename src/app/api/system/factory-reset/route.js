import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { addDays } from 'date-fns';

export async function POST(request) {
    try {
        // 1. Check Authentication (Superadmin only)
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'superadmin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // 2. Validate confirmation phrase
        const body = await request.json();
        const { confirmationPhrase, expectedPhrase, reason } = body;

        if (!confirmationPhrase || confirmationPhrase !== expectedPhrase) {
            return NextResponse.json({
                error: 'Confirmation phrase does not match. Please type the exact phrase to proceed.'
            }, { status: 400 });
        }

        // 3. Create Reset Request record
        const resetRequest = await prisma.resetRequest.create({
            data: {
                userId: session.user.id,
                userName: session.user.name || session.user.email,
                reason: reason || 'No reason provided',
                status: 'pending',
                autoDeleteAt: addDays(new Date(), 7), // 7 days from now
            }
        });

        const now = new Date();
        const resetId = resetRequest.id;

        // 4. Soft delete all mosque data (in parallel for performance)
        await Promise.all([
            prisma.member.updateMany({
                where: { deletedAt: null },
                data: { deletedAt: now, deletedByResetId: resetId }
            }),
            prisma.invoice.updateMany({
                where: { deletedAt: null },
                data: { deletedAt: now, deletedByResetId: resetId }
            }),
            prisma.payment.updateMany({
                where: { deletedAt: null },
                data: { deletedAt: now, deletedByResetId: resetId }
            }),
            prisma.expense.updateMany({
                where: { deletedAt: null },
                data: { deletedAt: now, deletedByResetId: resetId }
            }),
            prisma.income.updateMany({
                where: { deletedAt: null },
                data: { deletedAt: now, deletedByResetId: resetId }
            }),
            prisma.donation.updateMany({
                where: { deletedAt: null },
                data: { deletedAt: now, deletedByResetId: resetId }
            }),
            prisma.category.updateMany({
                where: { deletedAt: null },
                data: { deletedAt: now, deletedByResetId: resetId }
            }),
            prisma.bankAccount.updateMany({
                where: { deletedAt: null },
                data: { deletedAt: now, deletedByResetId: resetId }
            }),
            prisma.ledger.updateMany({
                where: { deletedAt: null },
                data: { deletedAt: now, deletedByResetId: resetId }
            }),
        ]);

        // 5. Create Admin Notification
        await prisma.adminNotification.create({
            data: {
                type: 'RESET_REQUEST',
                title: 'Factory Reset Requested',
                message: `User "${session.user.name || session.user.email}" has performed a factory reset. Data will be permanently deleted on ${resetRequest.autoDeleteAt.toLocaleDateString()}.`,
                data: {
                    resetRequestId: resetId,
                    userId: session.user.id,
                    userName: session.user.name,
                    reason: reason,
                }
            }
        });

        // 6. Create Audit Log
        await prisma.auditLog.create({
            data: {
                userId: session.user.id,
                userName: session.user.name,
                action: 'FACTORY_RESET',
                entityType: 'System',
                entityId: resetId,
                entityName: 'Factory Reset',
                changes: { reason, autoDeleteAt: resetRequest.autoDeleteAt },
            }
        });

        return NextResponse.json({
            success: true,
            message: 'Factory reset completed. All data has been marked for deletion.',
            resetRequestId: resetId,
            autoDeleteAt: resetRequest.autoDeleteAt,
            recoveryPeriod: '7 days',
        });

    } catch (error) {
        console.error("Factory reset failed:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
