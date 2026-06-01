"use client";

import * as React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Star, MapPin, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

interface DestinationCardProps {
  id: number;
  title: string;
  category: string;
  budget: number;
  duration: string;
  rating: number;
  images: string[];
  description: string;
}

export function DestinationCard({ 
  title, 
  category, 
  budget, 
  duration, 
  rating, 
  images, 
  description 
}: DestinationCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
  const [direction, setDirection] = React.useState(0);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? "100%" : "-100%",
      opacity: 0,
    }),
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentImageIndex((prevIndex) => {
      let nextIndex = prevIndex + newDirection;
      if (nextIndex < 0) nextIndex = images.length - 1;
      if (nextIndex >= images.length) nextIndex = 0;
      return nextIndex;
    });
  };

  return (
    <Card className="h-full flex flex-col overflow-hidden group border-border hover:shadow-xl transition-all duration-300">
      
      {/* Image Carousel */}
      <div className="relative h-64 w-full overflow-hidden bg-muted">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentImageIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x);
              if (swipe < -swipeConfidenceThreshold) {
                paginate(1);
              } else if (swipe > swipeConfidenceThreshold) {
                paginate(-1);
              }
            }}
            className="absolute inset-0"
          >
            <Image 
              src={images[currentImageIndex]}
              alt={`${title} image ${currentImageIndex + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </motion.div>
        </AnimatePresence>

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none z-10" />

        {/* Badges */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-20">
          <span className="bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-semibold">
            {category}
          </span>
          <div className="flex items-center gap-1 bg-black/40 backdrop-blur-md px-2 py-1 rounded-md text-white text-sm font-medium">
            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
            <span>{rating}</span>
          </div>
        </div>
        
        {/* Title */}
        <div className="absolute bottom-4 left-4 z-20">
          <h3 className="text-2xl font-bold text-white flex items-center gap-1 drop-shadow-md">
            {title}
          </h3>
        </div>

        {/* Carousel Controls */}
        {images.length > 1 && (
          <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
            <button 
              className="bg-black/30 hover:bg-black/50 text-white rounded-full p-1.5 backdrop-blur-sm transition-colors"
              onClick={(e) => { e.preventDefault(); paginate(-1); }}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              className="bg-black/30 hover:bg-black/50 text-white rounded-full p-1.5 backdrop-blur-sm transition-colors"
              onClick={(e) => { e.preventDefault(); paginate(1); }}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
        
        {/* Carousel Indicators */}
        {images.length > 1 && (
          <div className="absolute bottom-4 right-4 flex gap-1.5 z-20">
            {images.map((_, idx) => (
              <div 
                key={idx} 
                className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentImageIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/50'}`} 
              />
            ))}
          </div>
        )}
      </div>

      <CardContent className="p-6 flex flex-col flex-1 justify-between gap-6">
        <div>
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
            {description}
          </p>
          <div className="flex items-center gap-4 text-sm font-medium text-foreground">
            <div className="flex items-center gap-1">
              <span className="text-muted-foreground text-xs uppercase tracking-wider">From</span>
              <span className="text-primary text-lg">₹{budget}</span>
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-border" />
            <div className="text-muted-foreground flex items-center gap-1">
              {duration}
            </div>
          </div>
        </div>
        
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1 font-medium hover:bg-muted">
            View Details
          </Button>
          <Button 
            className="flex-1 font-medium bg-primary text-primary-foreground shadow-md shadow-primary/20"
            onClick={() => window.location.href = `/planner?destination=${encodeURIComponent(title)}`}
          >
            <Sparkles className="w-4 h-4 mr-1.5" />
            Generate Trip
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
