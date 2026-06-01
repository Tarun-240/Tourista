import { Hero } from "@/components/home/Hero";
import { AISearchCard } from "@/components/home/AISearchCard";
import { FeaturedDestinations } from "@/components/home/FeaturedDestinations";
import { ProcessSection } from "@/components/home/ProcessSection";

export default function Home() {
  return (
    <div className="flex flex-col w-full min-h-screen">
      <Hero />
      <div className="relative z-20">
        <AISearchCard />
      </div>
      <FeaturedDestinations />
      <ProcessSection />
    </div>
  );
}
