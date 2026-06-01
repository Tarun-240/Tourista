"use client";

import * as React from "react";
import { motion, Variants } from "framer-motion";
import { Map, Sparkles, Plane } from "lucide-react";

const steps = [
  {
    id: 1,
    title: "Choose Destination",
    description: "Tell us where you want to go or let our AI suggest the perfect getaway based on your mood.",
    icon: Map,
  },
  {
    id: 2,
    title: "Let AI Customize",
    description: "Our intelligent planner crafts a highly personalized day-by-day itinerary tailored to your unique preferences.",
    icon: Sparkles,
  },
  {
    id: 3,
    title: "Pack and Go",
    description: "Book seamlessly, pack your bags, and embark on a stress-free journey curated just for you.",
    icon: Plane,
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: "easeOut" } 
  },
};

export function ProcessSection() {
  return (
    <section className="py-24 px-4 md:px-8 bg-surface border-y">
      <div className="container mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-muted-foreground text-lg">
            Experience the future of travel planning. Three simple steps to your perfect vacation.
          </p>
        </div>

        <motion.div 
          className="relative max-w-5xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Connecting Line for Desktop */}
          <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent -z-10" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div 
                  key={step.id} 
                  variants={itemVariants}
                  className="flex flex-col items-center text-center relative"
                >
                  {/* Step Number Badge */}
                  <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-surface text-muted-foreground font-bold text-sm w-8 h-8 rounded-full border-2 border-background flex items-center justify-center z-10">
                    {step.id}
                  </div>
                  
                  {/* Icon Container */}
                  <div className="w-24 h-24 rounded-2xl bg-background border shadow-sm flex items-center justify-center mb-6 relative group overflow-hidden">
                    <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors duration-300" />
                    <Icon className="w-10 h-10 text-primary transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3" />
                  </div>

                  <h3 className="text-xl font-bold text-foreground mb-3">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
