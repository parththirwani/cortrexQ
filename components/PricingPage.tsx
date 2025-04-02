"use client";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";

export default function PricingPage() {
  const router = useRouter(); 

  return (
    <div className="bg-white pt-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-black sm:text-4xl">
            Simple, transparent pricing
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
            Choose the plan that's right for you or your business
          </p>
        </div>
        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {/* Free Plan */}
          <Card className="flex flex-col border-gray-200 shadow-sm">
            <CardHeader className="flex flex-col space-y-1.5 p-6">
              <CardTitle className="text-2xl font-bold text-black">
                Free
              </CardTitle>
              <CardDescription className="text-gray-500">
                For personal projects and hobbyists
              </CardDescription>
              <div className="mt-4 flex items-baseline text-black">
                <span className="text-4xl font-extrabold tracking-tight">
                  $0
                </span>
                <span className="ml-1 text-xl font-semibold">/month</span>
              </div>
            </CardHeader>
            <CardContent className="flex-1 p-6 pt-0">
              <ul className="space-y-3">
                <li className="flex items-start">
                  <Check className="mr-2 h-5 w-5 flex-shrink-0 text-black" />
                  <span className="text-gray-700">Up to 3 projects</span>
                </li>
                <li className="flex items-start">
                  <Check className="mr-2 h-5 w-5 flex-shrink-0 text-black" />
                  <span className="text-gray-700">Basic analytics</span>
                </li>
                <li className="flex items-start">
                  <Check className="mr-2 h-5 w-5 flex-shrink-0 text-black" />
                  <span className="text-gray-700">Community support</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter className="p-6 pt-0">
              <Button
                variant="outline"
                className="w-full border-black text-black hover:bg-gray-100"
              >
                Get started
              </Button>
            </CardFooter>
          </Card>

          {/* Individual Plan */}
          <Card className="flex flex-col border-2 border-black shadow-lg">
            <CardHeader className="flex flex-col space-y-1.5 p-6">
              <div className="rounded-full bg-black px-3 py-1 text-xs font-semibold text-white w-fit mx-auto">
                POPULAR
              </div>
              <CardTitle className="text-2xl font-bold text-black">
                Individual
              </CardTitle>
              <CardDescription className="text-gray-500">
                For professionals and freelancers
              </CardDescription>
              <div className="mt-4 flex items-baseline text-black">
                <span className="text-4xl font-extrabold tracking-tight">
                  $20
                </span>
                <span className="ml-1 text-xl font-semibold">/month</span>
              </div>
            </CardHeader>
            <CardContent className="flex-1 p-6 pt-0">
              <ul className="space-y-3">
                <li className="flex items-start">
                  <Check className="mr-2 h-5 w-5 flex-shrink-0 text-black" />
                  <span className="text-gray-700">Unlimited projects</span>
                </li>
                <li className="flex items-start">
                  <Check className="mr-2 h-5 w-5 flex-shrink-0 text-black" />
                  <span className="text-gray-700">Advanced analytics</span>
                </li>
                <li className="flex items-start">
                  <Check className="mr-2 h-5 w-5 flex-shrink-0 text-black" />
                  <span className="text-gray-700">Priority support</span>
                </li>
                <li className="flex items-start">
                  <Check className="mr-2 h-5 w-5 flex-shrink-0 text-black" />
                  <span className="text-gray-700">Custom domains</span>
                </li>
                <li className="flex items-start">
                  <Check className="mr-2 h-5 w-5 flex-shrink-0 text-black" />
                  <span className="text-gray-700">API access</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter className="p-6 pt-0">
              <Button className="w-full bg-black text-white hover:bg-gray-800" 
              onClick={()=>{
                router.push("/checkout")
              }}
              >
                Get started
              </Button>
            </CardFooter>
          </Card>

          {/* Business Plan */}
          <Card className="flex flex-col border-gray-200 shadow-sm">
            <CardHeader className="flex flex-col space-y-1.5 p-6">
              <CardTitle className="text-2xl font-bold text-black">
                Business
              </CardTitle>
              <CardDescription className="text-gray-500">
                For teams and organizations
              </CardDescription>
              <div className="mt-4 flex items-baseline text-black">
                <span className="text-4xl font-extrabold tracking-tight">
                  Contact us
                </span>
              </div>
            </CardHeader>
            <CardContent className="flex-1 p-6 pt-0">
              <ul className="space-y-3">
                <li className="flex items-start">
                  <Check className="mr-2 h-5 w-5 flex-shrink-0 text-black" />
                  <span className="text-gray-700">
                    Everything in Individual
                  </span>
                </li>
                <li className="flex items-start">
                  <Check className="mr-2 h-5 w-5 flex-shrink-0 text-black" />
                  <span className="text-gray-700">Team collaboration</span>
                </li>
                <li className="flex items-start">
                  <Check className="mr-2 h-5 w-5 flex-shrink-0 text-black" />
                  <span className="text-gray-700">
                    Dedicated account manager
                  </span>
                </li>
                <li className="flex items-start">
                  <Check className="mr-2 h-5 w-5 flex-shrink-0 text-black" />
                  <span className="text-gray-700">SLA guarantees</span>
                </li>
                <li className="flex items-start">
                  <Check className="mr-2 h-5 w-5 flex-shrink-0 text-black" />
                  <span className="text-gray-700">Enterprise security</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter className="p-6 pt-0">
              <Button
                variant="outline"
                className="w-full border-black text-black hover:bg-gray-100"
                onClick={() => {
                  router.push("/contact");
                }}
              >
                Contact sales
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}

