import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export const dynamic = 'force-dynamic';

export async function GET(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Debug: Check available models
        console.log('Prisma models:', Object.keys(prisma));

        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search');

        const where = {};
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { contact: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
            ];
        }

        const donors = await prisma.donor.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            include: {
                _count: {
                    select: { donations: true }
                }
            }
        });

        // Calculate total contributed for each donor
        const donorsWithStats = await Promise.all(donors.map(async (donor) => {
            try {
                const aggregate = await prisma.donation.aggregate({
                    where: { donorId: donor.id },
                    _sum: { amount: true },
                    _max: { date: true }
                });

                return {
                    ...donor,
                    total_contributed: aggregate._sum.amount || 0,
                    last_donation: aggregate._max.date,
                    donation_count: donor._count?.donations || 0
                };
            } catch (err) {
                console.error(`Error aggregating stats for donor ${donor.id}:`, err);
                return {
                    ...donor,
                    total_contributed: 0,
                    last_donation: null,
                    donation_count: 0
                };
            }
        }));

        return NextResponse.json(donorsWithStats);
    } catch (error) {
        console.error('Error fetching donors:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { name, contact, email, address } = body;

        if (!name) {
            return NextResponse.json({ error: 'Name is required' }, { status: 400 });
        }

        const donor = await prisma.donor.create({
            data: {
                name,
                contact,
                email,
                address
            }
        });

        return NextResponse.json(donor);
    } catch (error) {
        console.error('Error creating donor:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
