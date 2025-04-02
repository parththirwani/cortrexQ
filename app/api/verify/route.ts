import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Razorpay from "razorpay";
import prisma from "@/db";
import { PaymentStatus } from "@prisma/client";

const generatedSignature = (
  razorpayOrderId: string,
  razorpayPaymentId: string
) => {
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) {
    throw new Error(
      "Razorpay key secret is not defined in environment variables."
    );
  }
  const sig = crypto
    .createHmac("sha256", keySecret)
    .update(razorpayOrderId + "|" + razorpayPaymentId)
    .digest("hex");
  return sig;
};

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
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

  const { orderCreationId, razorpayPaymentId, razorpaySignature } =
    await request.json();

  const subscriptionExpiry = new Date();
  subscriptionExpiry.setMonth(subscriptionExpiry.getMonth() + 1);

  const payment = await razorpay.payments.fetch(razorpayPaymentId);
  if (payment.status !== "captured") {
    return NextResponse.json(
      { message: "payment verification failed", isOk: false },
      { status: 400 }
    );
  }

  const signature = generatedSignature(orderCreationId, razorpayPaymentId);
  if (signature !== razorpaySignature) {
    return NextResponse.json(
      { message: "payment verification failed", isOk: false },
      { status: 400 }
    );
  }

  const exsistingOrder = await prisma.payment.findFirst({
    where: {
      razorpayOrderId: orderCreationId,
    },
  });

  if (!exsistingOrder) {
    return NextResponse.json(
      { message: "No existing order found", isOk: false },
      { status: 400 }
    );
  }

  await prisma.$transaction([
    prisma.payment.update({
      where: {
        id: exsistingOrder.id,
      },
      data: {
        status: PaymentStatus.captured,
        razorpayPaymentId: razorpayPaymentId,
      },
    }),
    prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        isPremium: true,
        subscriptionExpiry: subscriptionExpiry,
      },
    }),
  ]);

  return NextResponse.json(
    { message: "payment verified successfully", isOk: true },
    { status: 200 }
  );
}
