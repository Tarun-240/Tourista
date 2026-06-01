"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Phone, Clock, Send, ChevronDown, MapPin } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Typography } from "@/components/ui/Typography";
import { Card } from "@/components/ui/Card";

const faqs = [
  {
    question: "How does the AI Trip Planner work?",
    answer: "Our proprietary AI engine analyzes millions of travel data points, reviews, and logistics to craft a personalized itinerary based exactly on your budget, travel style, and preferences in seconds."
  },
  {
    question: "Can I modify my itinerary after it's generated?",
    answer: "Absolutely. The generated itinerary is a smart starting point. You can easily drag-and-drop activities, swap out restaurants, or ask the AI to regenerate specific days within the dashboard."
  },
  {
    question: "Is Tourista free to use?",
    answer: "Tourista offers a generous free tier that allows you to generate up to 3 trips per month. For unlimited planning, advanced PDF exports, and real-time collaboration, we offer a Premium subscription."
  },
  {
    question: "How do I share my trip with friends?",
    answer: "Every saved trip has a 'Share' button in the dashboard. You can generate a public read-only link, or invite friends via email to collaboratively edit the itinerary in real-time."
  },
  {
    question: "Do you offer customer support on weekends?",
    answer: "Our standard support team is available Monday through Friday. However, Premium members get access to 24/7 priority support, including weekends and holidays."
  }
];

function AccordionItem({ question, answer }: { question: string, answer: string }) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="border-b border-border last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex items-center justify-between text-left focus:outline-none group"
      >
        <span className="text-lg font-medium group-hover:text-primary transition-colors">{question}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="ml-4 shrink-0"
        >
          <ChevronDown className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-muted-foreground leading-relaxed">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      alert("Message sent successfully! Our team will get back to you soon.");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-24">
      <div className="container mx-auto px-4 md:px-8 max-w-6xl">
        
        {/* Header */}
        <div className="text-center mb-16">
          <Typography variant="h1" className="mb-4">Get in Touch</Typography>
          <Typography variant="lead" className="text-muted-foreground max-w-2xl mx-auto">
            Have questions about our AI planner or need help with your account? Our team is here to help you navigate the world.
          </Typography>
        </div>

        {/* Top Section: Form & Info */}
        <div className="flex flex-col lg:flex-row gap-12 mb-24">
          
          {/* Left: Contact Form */}
          <div className="w-full lg:w-3/5">
            <Card className="p-8 border-border bg-surface shadow-xl">
              <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium text-foreground">Full Name</label>
                    <input 
                      id="name"
                      type="text" 
                      required
                      placeholder="Jane Doe"
                      className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-foreground">Email Address</label>
                    <input 
                      id="email"
                      type="email" 
                      required
                      placeholder="jane@example.com"
                      className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-medium text-foreground">Subject</label>
                  <input 
                    id="subject"
                    type="text" 
                    required
                    placeholder="How can we help?"
                    className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium text-foreground">Message</label>
                  <textarea 
                    id="message"
                    required
                    rows={5}
                    placeholder="Tell us more about your inquiry..."
                    className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary/50 outline-none transition-all resize-y"
                  />
                </div>

                <Button type="submit" disabled={isSubmitting} className="w-full py-6 text-lg rounded-xl shadow-lg shadow-primary/20">
                  {isSubmitting ? "Sending..." : (
                    <>
                      Send Message <Send className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>
              </form>
            </Card>
          </div>

          {/* Right: Contact Information */}
          <div className="w-full lg:w-2/5 flex flex-col gap-6">
            <h2 className="text-2xl font-bold lg:mt-2">Contact Information</h2>
            <p className="text-muted-foreground mb-4">
              Prefer to reach out directly? Use the channels below to get in touch with our global support team.
            </p>

            <div className="space-y-4">
              <Card className="p-6 border-border bg-surface flex items-start gap-4 hover:border-primary/50 transition-colors">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground mb-1">Email Us</h3>
                  <p className="text-muted-foreground text-sm mb-1">For general inquiries and support.</p>
                  <a href="mailto:support@tourista.ai" className="text-primary font-medium hover:underline">support@tourista.ai</a>
                </div>
              </Card>

              <Card className="p-6 border-border bg-surface flex items-start gap-4 hover:border-primary/50 transition-colors">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground mb-1">Call Us</h3>
                  <p className="text-muted-foreground text-sm mb-1">Mon-Fri from 9am to 6pm EST.</p>
                  <a href="tel:+18005550199" className="text-primary font-medium hover:underline">+1 (800) 555-0199</a>
                </div>
              </Card>

              <Card className="p-6 border-border bg-surface flex items-start gap-4 hover:border-primary/50 transition-colors">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground mb-1">Headquarters</h3>
                  <p className="text-muted-foreground text-sm">
                    100 Innovation Drive<br/>
                    San Francisco, CA 94105<br/>
                    United States
                  </p>
                </div>
              </Card>
            </div>
          </div>

        </div>

        {/* Bottom Section: FAQ Accordion */}
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <Typography variant="h2" className="mb-4">Frequently Asked Questions</Typography>
            <p className="text-muted-foreground">Find quick answers to common questions about our platform.</p>
          </div>

          <Card className="p-2 md:p-8 border-border bg-surface">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} question={faq.question} answer={faq.answer} />
            ))}
          </Card>
        </div>

      </div>
    </div>
  );
}
