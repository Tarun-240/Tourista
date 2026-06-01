"use client";

import * as React from "react";
import Image from "next/image";
import { motion, Variants } from "framer-motion";
import { Star, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const destinations = [
  {
    id: 1,
    title: "Rajasthan",
    description: "Experience the grandeur of ancient forts, vibrant culture, and vast deserts.",
    rating: 4.9,
    reviews: 1240,
    image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    title: "Kerala",
    description: "Relax in serene backwaters, lush tea gardens, and pristine tropical beaches.",
    rating: 4.8,
    reviews: 980,
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    title: "Goa",
    description: "Discover stunning coastlines, Portuguese heritage, and electric nightlife.",
    rating: 4.7,
    reviews: 2150,
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 4,
    title: "Leh-Ladakh",
    description: "Embark on an adventure through breathtaking Himalayan landscapes and monasteries.",
    rating: 4.9,
    reviews: 860,
    image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80",
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  },
};

export function FeaturedDestinations() {
  const router = useRouter();
  const { user } = useAuth();

  const handleDestinationClick = (destinationTitle?: string) => {
    if (!user) {
      router.push("/login");
      return;
    }
    if (destinationTitle) {
      router.push(`/planner?destination=${encodeURIComponent(destinationTitle)}`);
    } else {
      router.push("/destinations");
    }
  };

  return (
    <section className="py-20 px-4 md:px-8 bg-background">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
              Featured Destinations
            </h2>
            <p className="text-muted-foreground text-lg">
              Explore India&apos;s most loved locales. Handpicked experiences perfectly curated for your next unforgettable journey.
            </p>
          </div>
          <Button variant="outline" className="hidden md:flex rounded-full" onClick={() => handleDestinationClick()}>
            View All Destinations
          </Button>
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {destinations.map((dest) => (
            <motion.div key={dest.id} variants={cardVariants}>
              <Card className="h-full overflow-hidden group cursor-pointer border-transparent hover:border-border transition-colors duration-300">
                <div className="relative h-64 w-full overflow-hidden">
                  <Image 
                    src={dest.image}
                    alt={dest.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-80" />
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                    <h3 className="text-xl font-bold text-white flex items-center gap-1">
                      <MapPin className="w-5 h-5 text-primary" />
                      {dest.title}
                    </h3>
                    <div className="flex items-center gap-1 bg-black/40 backdrop-blur-md px-2 py-1 rounded-md text-white text-sm font-medium">
                      <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                      <span>{dest.rating}</span>
                    </div>
                  </div>
                </div>
                <CardContent className="p-5 flex flex-col justify-between h-[calc(100%-16rem)]">
                  <div>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {dest.description}
                    </p>
                  </div>
                  <Button 
                    className="w-full rounded-lg bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-colors mt-auto"
                    onClick={() => handleDestinationClick(dest.title)}
                  >
                    Explore
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
        
        <Button variant="outline" className="w-full mt-8 md:hidden rounded-full" onClick={() => handleDestinationClick()}>
          View All Destinations
        </Button>
      </div>
    </section>
  );
}
