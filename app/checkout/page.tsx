"use client";

import { useState } from "react";
import { Check, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { createOrderId } from "@/lib/createOrderId";
import { useSession } from "next-auth/react";
import Script from "next/script";

export default function CheckoutPage() {
  const [isLoading, setIsLoading] = useState(false);
  const amount = 20; 

  const { data: session } = useSession();

  const handlePayment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const orderId: string = await createOrderId(amount.toString());

      console.log("i am here")
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: parseFloat(amount.toString()) * 100,
        currency: "USD",
        name: "name",
        description: "description",
        order_id: orderId,
        handler: async function (response: any) {
          const data = {
            orderCreationId: orderId,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            razorpaySignature: response.razorpay_signature,
          };

          const result = await fetch("/api/verify", {
            method: "POST",
            body: JSON.stringify(data),
            headers: { "Content-Type": "application/json" },
          });
          const res = await result.json();
          if (res.isOk) alert("payment succeed");
          else {
            alert(res.message);
          }
        },
        prefill: {
          name: session?.user.name,
          email: session?.user.email,
        },
        theme: {
          color: "#3399cc",
        },
      };


      //@ts-ignore
      const paymentObject = new window.Razorpay(options);
      paymentObject.on("payment.failed", function (response: any) {
        alert(response.error.description);
      });
      paymentObject.open();
    } catch (error) {
      console.log(error);
    }
  };

  const benefits = [
    "Unlimited access to premium content",
    "Priority customer support",
    "Ad-free experience",
    "Exclusive member-only features",
    "Early access to new features",
  ];

  return (
    <div className="flex min-h-screen items-center justify-center bg-white p-4">
      <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
      />
      <Card className="w-full max-w-4xl border-black">
        <CardContent className="p-0">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="flex flex-col justify-between border-b border-black p-6 md:border-b-0 md:border-r">
              <div>
                <div className="mb-8">
                  <Link href="/" className="font-serif text-xl font-medium">
                    CortexQ
                  </Link>
                </div>
                <h2 className="mb-6 text-xl font-bold">
                  Premium Plan Benefits
                </h2>
                <ul className="space-y-3">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="mr-2 h-5 w-5 shrink-0 text-black" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-8 flex items-center text-sm text-gray-600">
                <Shield className="mr-2 h-4 w-4" />
                <span>Secure payment processed by Razorpay</span>
              </div>
            </div>

            <div className="flex flex-col justify-between p-6">
              <div>
                <h1 className="mb-2 text-2xl font-bold">
                  Complete Your Purchase
                </h1>
                <p className="mb-6 text-gray-600">
                  Get instant access to all premium features
                </p>

                <div className="mb-8 rounded-lg bg-gray-50 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Premium Plan</span>
                    <span>${amount}</span>
                  </div>
                  <Separator className="my-2 bg-gray-200" />
                  <div className="flex items-center justify-between font-bold">
                    <span>Total</span>
                    <span>${amount}</span>
                  </div>
                </div>
              </div>

              <Button
              //@ts-ignore
                onClick={(e)=>handlePayment(e)}
                disabled={isLoading}
                className="w-full bg-black text-white hover:bg-gray-800"
              >
                {isLoading ? "Processing..." : "Pay Now"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
