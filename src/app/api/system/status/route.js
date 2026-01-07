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

        // 2. Check Database Connection & Latency
        const start = Date.now();
        try {
            await prisma.$queryRaw`SELECT 1`;
        } catch (dbError) {
            console.error("Database connection failed:", dbError);
            return NextResponse.json({
                database: { status: 'error', message: 'Connection failed' },
                system: { status: 'degraded', timestamp: new Date().toISOString() }
            }, { status: 500 });
        }
        const latency = Date.now() - start;

        // 3. Get Database Size (Postgres specific)
        let dbSize = 'Unknown';
        try {
            const sizeResult = await prisma.$queryRaw`SELECT pg_size_pretty(pg_database_size(current_database())) as size`;
            // sizeResult is likely an array of objects
            if (Array.isArray(sizeResult) && sizeResult.length > 0) {
                dbSize = sizeResult[0].size;
            }
        } catch (e) {
            console.warn("Failed to get DB size:", e);
        }

        // 4. Return Status
        return NextResponse.json({
            database: {
                status: 'connected',
                latency: `${latency}ms`,
                size: dbSize,
                provider: 'PostgreSQL'
            },
            system: {
                status: 'online',
                version: process.env.npm_package_version || '1.0.0',
                timestamp: new Date().toISOString(),
                environment: process.env.NODE_ENV || 'development'
            }
        });

    } catch (error) {
        console.error("System status check failed:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
