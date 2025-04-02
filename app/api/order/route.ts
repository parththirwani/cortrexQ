import Razorpay from "razorpay";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PaymentStatus } from "@prisma/client";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized" },
      {
        status: 401,
      }
    );
  }

  const { amount } = (await request.json()) as {
    amount: string;
  };

  const currency = "USD";

  var options = {
    amount: amount,
    currency: currency,
    receipt: "rcp1",
  };

  try {
    const order = await razorpay.orders.create(options);

    await prisma.payment.create({
      data: {
        user: {
          connect: {
            id: session.user.id,
          },
        },
        amount: Number(amount),
        razorpayOrderId: order.id,
        status: PaymentStatus.pending,
      },
    });
    console.log("hfuishufishdfusd-----", order);
    return NextResponse.json({ orderId: order.id }, { status: 200 });
  } catch (e) {
    console.error("Error making an order", e);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
  
}
