import { SearchBar } from "@/components/landing/search-bar";
import { TrendingSection } from "@/components/landing/trending-section";
import { QuickLinks } from "@/components/landing/quick-links";
import { Greeting } from "./Greetings";
import TypewriterEffect from "./landing/typewriter-effect";
import { getServerSession } from "next-auth";
import { getTrendingSection } from "@/lib/helper";

export default async function Landing() {
  const session = await getServerSession();
  const res = await getTrendingSection();
  const trendingItems = res.data;

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa]">
      <main className="flex-1 container mx-auto px-4 py-8 pt-36 ">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2"></div>
        </div>
        <div className="flex flex-col items-center justify-center max-w-3xl mx-auto mt-20 mb-16">
          <h1 className="text-3xl md:text-5xl text-center mb-2">
            <Greeting /> What can I help you find?
          </h1>
          <div className="py-3">
            <TypewriterEffect
              words={[
                "Find unique deals, sustainably",
                "A treasure hunt, just a click away",
                "Follow creators who inspire your closet.",
                "Shop the looks celebrities are wearing now.",
                "Build an incredible wardrobe piece by piece.",
                "Connect with a community of fashion lovers.",
                "Turn inspiration into your next favorite outfit.",
                "Your personalized fashion discovery starts now.",
                "From red carpet to your closet, effortlessly.",
              ]}
            />
          </div>
          <SearchBar />
        </div>
        <div className="mt-28">
          <TrendingSection trendingItems={trendingItems} />
        </div>
      </main>
    </div>
  );
}
