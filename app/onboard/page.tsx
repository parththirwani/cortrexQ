"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import OnboardingFlow from "@/components/auth/Onboarding-flow";
import LoadingPage from "../loading";

interface UserSizes {
  tops: string[];
  bottoms: string[];
  shoes: string[];
  outerwear: string[];
  dresses: string[];
}

interface OnboardingFormData {
  username: string;
  bio: string;
  gender: string;
  ageGroup: string;
  aesthetics: string[];
  sizes: UserSizes;
  [key: string]: any;
}

export default function OnboardingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // TODO: there is a better way to handle this i.e from the auth 
  if(session?.user.hasCompletedOnboarding){
    router.push("/")
  }

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  const handleOnboardingComplete = async (formData: OnboardingFormData) => {
    try {
      await fetch("/api/user/onboard", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      console.log("Onboarding completed with data:", formData);

      localStorage.setItem(
        "userPreferences",
        JSON.stringify({
          aesthetics: formData.aesthetics,
          sizes: formData.sizes,
          ageGroup: formData.ageGroup,
        })
      );

      router.push("/");
    } catch (error) {
      console.error("Error saving onboarding data:", error);

      router.push("/");
    }
  };

  const handleOnboardingSkip = (partialData: Partial<OnboardingFormData>) => {
    console.log("Onboarding skipped with partial data:", partialData);

    if (Object.keys(partialData).length > 0) {
      localStorage.setItem(
        "userPreferences",
        JSON.stringify({
          aesthetics: partialData.aesthetics || [],
          sizes: partialData.sizes || {},
          ageGroup: partialData.ageGroup || "",
        })
      );
    }

    router.push("/dashboard");
  };

  if (status === "loading") {
    return (
      <>
      <LoadingPage/>
      </>
    );
  }

  if (status === "authenticated") {
    return (
      <OnboardingFlow
        onComplete={handleOnboardingComplete}
        onSkip={handleOnboardingSkip}
        steps={["profile", "gender", "ageGroup", "aesthetics", "sizes"]}
      />
    );
  }

  return null;
}
