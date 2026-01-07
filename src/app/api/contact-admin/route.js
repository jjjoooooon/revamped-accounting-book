import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { subject, message, contactEmail } = body;

    if (!subject || !message) {
      return NextResponse.json(
        { error: "Subject and message are required" },
        { status: 400 },
      );
    }

    // Create admin notification
    await prisma.adminNotification.create({
      data: {
        type: "CONTACT_FORM",
        title: `Contact: ${subject}`,
        message: message,
        data: {
          userId: session.user.id,
          userName: session.user.name,
          userEmail: session.user.email,
          contactEmail: contactEmail || session.user.email,
        },
      },
    });

    // TODO: Optionally send email to admin here using a mail service

    return NextResponse.json({
      success: true,
      message: "Your message has been sent to the administrator.",
    });
  } catch (error) {
    console.error("Contact form submission failed:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
