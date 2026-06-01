"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, MapPin, CheckCircle2 } from "lucide-react";

const messages = [
  "Finding the best attractions...",
  "Optimizing travel routes...",
  "Discovering hidden local gems...",
  "Personalizing your experiences...",
  "Finalizing your perfect itinerary..."
];

export function AILoadingScreen() {
  const [messageIndex, setMessageIndex] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full min-h-[600px] flex flex-col md:flex-row items-center justify-center gap-12 p-8">
      
      {/* Left side: AI Status */}
      <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left max-w-md">
        
        {/* Pulsing AI Icon */}
        <div className="relative mb-8">
          <motion.div 
            animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 bg-primary rounded-full blur-xl"
          />
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="relative bg-surface border-2 border-primary/30 w-20 h-20 rounded-2xl flex items-center justify-center shadow-[0_0_30px_-5px_rgba(var(--primary),0.3)]"
          >
            <Sparkles className="w-10 h-10 text-primary" />
          </motion.div>
        </div>

        <h2 className="text-3xl font-bold text-foreground mb-4">
          AI is crafting your perfect itinerary
        </h2>
        
        <div className="h-8 relative w-full overflow-hidden mb-12">
          <AnimatePresence mode="popLayout">
            <motion.p
              key={messageIndex}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="text-primary font-medium absolute inset-0"
            >
              {messages[messageIndex]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Timeline Animation */}
        <div className="w-full space-y-6">
          {[0, 1, 2].map((idx) => (
            <div key={idx} className="flex gap-4">
              <div className="flex flex-col items-center">
                <motion.div 
                  initial={{ backgroundColor: "rgba(150, 150, 150, 0.2)" }}
                  animate={{ 
                    backgroundColor: messageIndex >= idx + 1 ? "var(--color-primary)" : "rgba(150, 150, 150, 0.2)",
                  }}
                  className="w-6 h-6 rounded-full flex items-center justify-center relative z-10"
                >
                  {messageIndex >= idx + 1 ? (
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-muted-foreground/50" />
                  )}
                </motion.div>
                {idx < 2 && (
                  <motion.div 
                    className="w-0.5 h-12 bg-border mt-2"
                    initial={{ scaleY: 0, originY: 0 }}
                    animate={{ scaleY: messageIndex > idx + 1 ? 1 : 0.2 }}
                    transition={{ duration: 0.5 }}
                  />
                )}
              </div>
              <div className="flex-1 pt-0.5">
                <motion.div 
                  animate={{ opacity: messageIndex >= idx + 1 ? 1 : 0.4 }}
                  className="h-5 w-32 bg-muted rounded-md mb-2"
                />
                <motion.div 
                  animate={{ opacity: messageIndex >= idx + 1 ? 1 : 0.4 }}
                  className="h-3 w-48 bg-muted/60 rounded-md"
                />
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Right side: Skeleton Cards */}
      <div className="flex-1 w-full max-w-md relative">
        {/* Subtle background glow */}
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent rounded-3xl blur-3xl" />
        
        <div className="space-y-4 relative z-10">
          {[1, 2, 3].map((item, idx) => (
            <motion.div 
              key={item}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.2 }}
              className="bg-surface border rounded-2xl p-4 shadow-sm"
            >
              <div className="flex gap-4">
                <motion.div 
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: idx * 0.2 }}
                  className="w-24 h-24 rounded-xl bg-muted shrink-0"
                />
                <div className="flex-1 space-y-3 py-1">
                  <motion.div 
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: idx * 0.2 + 0.1 }}
                    className="h-4 w-3/4 bg-muted rounded-md"
                  />
                  <motion.div 
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: idx * 0.2 + 0.2 }}
                    className="h-3 w-full bg-muted/60 rounded-md"
                  />
                  <motion.div 
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: idx * 0.2 + 0.3 }}
                    className="h-3 w-5/6 bg-muted/60 rounded-md"
                  />
                  <div className="flex gap-2 pt-2">
                    <motion.div 
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: idx * 0.2 + 0.4 }}
                      className="h-6 w-16 bg-primary/10 rounded-full"
                    />
                    <motion.div 
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: idx * 0.2 + 0.5 }}
                      className="h-6 w-16 bg-muted rounded-full"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

    </div>
  );
}
