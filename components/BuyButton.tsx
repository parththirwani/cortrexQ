"use client";

import axios from "axios";
import React from "react";
import Script from "next/script";
import { createOrderId } from "@/lib/createOrderId";


export default function PurchaseButton() {
  const [isLoading, setIsLoading] = React.useState(false);

  const handlePayment = async () => {
    setIsLoading(true);
    const price = "100"; // Replace with dynamic price
    try {
      const orderId: string = await createOrderId(price);
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: parseFloat(price) * 100,
        currency: "INR",
        name: "CortexQ", // Replace with dynamic company name
        description: "Payment for your order", // Replace with dynamic order description
        order_id: orderId,
        handler: async function (response: any) {
          try {
            const paymentResponse = await axios.post("/api/verifyOrder", {
              razorpay_order_id: orderId,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            alert("Payment Successful!");
            console.log(paymentResponse.data);
          } catch (error) {
            alert("Payment verification failed. Please contact support.");
            console.error(error);
          }
        },
        prefill: {
          name: "Saksham ", // Replace with dynamic user data
          email: "saksham1387@gmail.com", // Replace with dynamic user data
          contact: 9319097646
        },
        theme: {
          color: "#3399cc",
        },
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.on("payment.failed", function (response: any) {
        alert("Payment failed");
        console.error(response.error);
      });
      razorpay.open();
    } catch (error) {
      alert("Payment failed. Please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        className="bg-emerald-700 text-white font-semibold px-4 py-2 rounded-xl hover:bg-emerald-600 transition-all duration-300 hover:shadow-lg hover:scale-105"
        onClick={handlePayment}
        disabled={isLoading}
      >
        {isLoading ? "Processing..." : "Buy Now"}
      </button>
      <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
      />
    </>
  );
}

