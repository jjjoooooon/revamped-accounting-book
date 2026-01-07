import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const startMonth = searchParams.get("startMonth"); // YYYY-MM
    const endMonth = searchParams.get("endMonth"); // YYYY-MM

    if (!startMonth || !endMonth) {
      return NextResponse.json(
        { error: "Start month and End month are required" },
        { status: 400 },
      );
    }

    // 1. Get all active members
    const members = await prisma.member.findMany({
      where: { status: "active" },
      select: {
        id: true,
        name: true,
        contact: true,
        amountPerCycle: true,
        address: true,
        email: true,
        startDate: true,
        status: true,
      },
      orderBy: { name: "asc" },
    });

    // 2. Get invoices for the range
    // We can't easily use 'between' for string dates if they span years correctly without careful formatting,
    // but YYYY-MM string comparison works lexicographically.
    const invoices = await prisma.invoice.findMany({
      where: {
        period: {
          gte: startMonth,
          lte: endMonth,
        },
        type: "Sanda",
        memberId: { in: members.map((m) => m.id) },
      },
      select: {
        id: true,
        memberId: true,
        status: true,
        amount: true,
        paidAmount: true,
        period: true,
      },
    });

    // 3. Transform data for Matrix View
    // Structure: [{ memberId, name, amount, payments: { '2025-01': { status: 'paid', invoiceId: '...' }, ... } }]
    const data = members.map((member) => {
      const memberInvoices = invoices.filter(
        (inv) => inv.memberId === member.id,
      );
      const paymentsMap = {};

      memberInvoices.forEach((inv) => {
        paymentsMap[inv.period] = {
          status: inv.status,
          invoiceId: inv.id,
          paidAmount: inv.paidAmount,
        };
      });

      return {
        memberId: member.id,
        name: member.name,
        contact: member.contact,
        amount: member.amountPerCycle,
        address: member.address,
        email: member.email,
        startDate: member.startDate,
        status: member.status, // Member status, not invoice status
        payments: paymentsMap,
      };
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching bulk status:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
