import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// GET: List all admin notifications
export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'superadmin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const notifications = await prisma.adminNotification.findMany({
            orderBy: { createdAt: 'desc' },
            take: 50,
        });

        const unreadCount = await prisma.adminNotification.count({
            where: { isRead: false }
        });

        return NextResponse.json({ notifications, unreadCount });

    } catch (error) {
        console.error("Failed to fetch notifications:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// PUT: Mark notifications as read
export async function PUT(request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'superadmin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { notificationId, markAllRead } = body;

        if (markAllRead) {
            await prisma.adminNotification.updateMany({
                where: { isRead: false },
                data: { isRead: true }
            });
        } else if (notificationId) {
            await prisma.adminNotification.update({
                where: { id: notificationId },
                data: { isRead: true }
            });
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Failed to update notifications:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
