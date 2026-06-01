"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Search, Sparkles, MapPin, History } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";

const popularSearches = [
  "Beaches in Goa",
  "Family Trip to Kerala",
  "Romantic Rajasthan Getaway",
  "Himalayan Trekking",
];

export function AISearchCard() {
  const [query, setQuery] = React.useState("");
  const [searchHistory, setSearchHistory] = React.useState<string[]>([]);
  const router = useRouter();

  React.useEffect(() => {
    try {
      const historyStr = localStorage.getItem("tourista_search_history");
      if (historyStr) {
        setSearchHistory(JSON.parse(historyStr));
      }
    } catch (e) {}
  }, []);

  const handleGenerate = (searchQuery?: string | any) => {
    const queryToUse = typeof searchQuery === 'string' ? searchQuery : query;
    if (queryToUse.trim()) {
      const newQuery = queryToUse.trim();
      
      try {
        let history = [...searchHistory];
        history = history.filter(h => h.toLowerCase() !== newQuery.toLowerCase());
        history.unshift(newQuery);
        history = history.slice(0, 5); // Keep last 5
        localStorage.setItem("tourista_search_history", JSON.stringify(history));
        setSearchHistory(history);
      } catch (e) {}

      router.push(`/planner?destination=${encodeURIComponent(newQuery)}`);
    } else {
      router.push('/planner');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.8, ease: "easeOut" }}
      className="w-full max-w-4xl mx-auto -mt-24 relative z-30 px-4"
    >
      <div className="bg-surface/80 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-2xl rounded-2xl p-6 md:p-8">
        
        {/* Input Header */}
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Where do you want to go?</h2>
        </div>

        {/* Search Bar */}
        <div className="relative flex items-center w-full bg-background rounded-xl border border-input shadow-sm focus-within:ring-2 focus-within:ring-primary/50 transition-all overflow-hidden mb-6">
          <div className="pl-4 text-muted-foreground">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
            placeholder="e.g. A 5-day adventure in Manali with friends..."
            className="w-full bg-transparent border-none outline-none px-4 py-4 text-foreground placeholder:text-muted-foreground"
          />
          <div className="pr-2 hidden sm:block">
            <Button size="sm" className="rounded-lg px-6 h-10" onClick={() => handleGenerate()}>
              Generate Trip
            </Button>
          </div>
        </div>
        
        {/* Mobile button */}
        <div className="w-full sm:hidden mb-6">
          <Button className="w-full rounded-lg h-12" onClick={() => handleGenerate()}>
            Generate Trip
          </Button>
        </div>

        {/* Search History */}
        {searchHistory.length > 0 && (
          <div className="mb-6">
            <p className="text-sm text-muted-foreground mb-3 font-medium flex items-center gap-2">
              <History className="w-4 h-4" />
              Recent Searches
            </p>
            <div className="flex flex-wrap gap-2">
              {searchHistory.map((search, idx) => (
                <motion.button
                  key={`history-${search}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: idx * 0.05 }}
                  onClick={() => handleGenerate(search)}
                  className="text-xs sm:text-sm px-4 py-2 rounded-full border border-primary/30 bg-primary/10 hover:bg-primary/20 text-primary transition-colors whitespace-nowrap"
                >
                  {search}
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* Popular Searches */}
        <div>
          <p className="text-sm text-muted-foreground mb-3 font-medium flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Popular AI Suggestions
          </p>
          <div className="flex flex-wrap gap-2">
            {popularSearches.map((search, idx) => (
              <motion.button
                key={search}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 + idx * 0.1, duration: 0.4 }}
                onClick={() => handleGenerate(search)}
                className="text-xs sm:text-sm px-4 py-2 rounded-full border bg-background/50 hover:bg-primary/5 hover:border-primary/30 hover:text-primary transition-colors text-foreground whitespace-nowrap"
              >
                {search}
              </motion.button>
            ))}
          </div>
        </div>

      </div>
    </motion.div>
  );
}
