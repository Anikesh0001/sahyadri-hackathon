"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Bot, Code, Users, Cpu, ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300 } },
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 lg:py-32 flex flex-col items-center text-center">
        <div className="absolute inset-0 z-[-1] bg-grid-white/[0.02] bg-[size:50px_50px]" />
        <div className="absolute top-0 right-0 -z-10 w-[800px] h-[600px] opacity-20 blur-[100px] rounded-full bg-gradient-to-br from-primary via-purple-500 to-blue-500 transform translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 -z-10 w-[600px] h-[500px] opacity-20 blur-[120px] rounded-full bg-gradient-to-tr from-blue-600 via-primary to-purple-600 transform -translate-x-1/2 translate-y-1/2" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="container px-4 md:px-6"
        >
          <div className="inline-flex items-center rounded-full border border-primary/30 px-3 py-1 text-sm font-medium bg-primary/10 text-primary mb-8 backdrop-blur-sm">
            <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
            AI Powered Bug Intelligence Network
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
            Fund the Fixes.<br className="hidden sm:block" /> Power the Builders.
          </h1>
          <p className="max-w-[700px] mx-auto text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed">
            A decentralized platform where users post software bugs as bounty tasks, the community crowd-funds fixes, and AI autonomously matches developers to solve them.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/bugs">
              <Button size="lg" className="w-full sm:w-auto text-base gap-2 rounded-full h-12 px-8">
                Explore Bugs <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/workflow">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-base gap-2 rounded-full h-12 px-8 border-border/50 bg-background/50 backdrop-blur-sm">
                How It Works
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* AI Modules Overview */}
      <section className="py-20 bg-muted/30 border-y border-border/40">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Core Intelligence Modules</h2>
            <p className="text-muted-foreground max-w-[600px] mx-auto">
              Our advanced AI engine orchestrates the entire bug resolution lifecycle with unprecedented precision.
            </p>
          </div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
          >
            {[
              {
                icon: <Bot className="h-6 w-6 text-blue-500" />,
                title: "Intelligent Bug Understanding",
                description: "NLP-driven analysis summarizes complex logs and extracts core error clusters instantly.",
              },
              {
                icon: <Zap className="h-6 w-6 text-amber-500" />,
                title: "Smart Bounty Prediction",
                description: "Estimates optimal bounty amounts based on predicted complexity and user impact scoring.",
              },
              {
                icon: <Users className="h-6 w-6 text-green-500" />,
                title: "Developer Matching",
                description: "AI autonomously pairs the right developers to bugs based on skillset and past success rates.",
              },
              {
                icon: <ShieldCheck className="h-6 w-6 text-purple-500" />,
                title: "Automated Verification",
                description: "Analyzes PR diffs against expected behavior to simulate verified, production-ready fixes.",
              },
              {
                icon: <Cpu className="h-6 w-6 text-rose-500" />,
                title: "Impact Scoring",
                description: "Multi-dimensional radar metrics evaluating urgency, severity, and popularity dynamically.",
              },
              {
                icon: <Code className="h-6 w-6 text-cyan-500" />,
                title: "Transparent Workflow",
                description: "Real-time visibility from bug report to verified fix with intuitive timeline visualizations.",
              },
            ].map((module, i) => (
              <motion.div
                key={i}
                variants={item}
                className="group relative overflow-hidden rounded-2xl border border-border/50 bg-background/40 p-8 backdrop-blur-sm transition-all hover:bg-background/80 hover:shadow-lg hover:-translate-y-1"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-muted/50 border border-border/50">
                  {module.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{module.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {module.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent to-primary/5" />
        <div className="container px-4 md:px-6 mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
            Ready to Accelerate Software Quality?
          </h2>
          <p className="text-xl text-muted-foreground mb-10 max-w-[600px] mx-auto">
            Join the decentralized marketplace connecting users, developers, and AI to solve software bugs faster than ever.
          </p>
          <Link href="/dashboard">
            <Button size="lg" className="rounded-full h-14 px-10 text-lg">
              Launch Dashboard
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
