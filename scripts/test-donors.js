const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        console.log('Fetching donors...');
        const donors = await prisma.donor.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                _count: {
                    select: { donations: true }
                }
            }
        });
        console.log('Donors fetched:', donors);

        console.log('Fetching stats...');
        const donorsWithStats = await Promise.all(donors.map(async (donor) => {
            const aggregate = await prisma.donation.aggregate({
                where: { donorId: donor.id },
                _sum: { amount: true },
                _max: { date: true }
            });

            return {
                ...donor,
                total_contributed: aggregate._sum.amount || 0,
                last_donation: aggregate._max.date,
                donation_count: donor._count.donations
            };
        }));
        console.log('Stats fetched:', donorsWithStats);

    } catch (e) {
        console.error('Error:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
