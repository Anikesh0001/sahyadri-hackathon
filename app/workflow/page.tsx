"use client";

import { motion } from "framer-motion";
import { Bug, Cpu, Wallet, UserCheck, GitMerge, DollarSign } from "lucide-react";

const workflowSteps = [
  {
    id: 1,
    title: "1. Report & Replicate",
    description: "User submits an issue with logs, repos, and context. The platform ingests metadata instantly.",
    icon: <Bug className="h-6 w-6" />,
    color: "from-red-500/20 to-red-600/20 border-red-500/30 text-red-500",
  },
  {
    id: 2,
    title: "2. AI Intelligence Analysis",
    description: "NLP dissects logs, categories the bug, estimates complexity, and predicts fair bounty.",
    icon: <Cpu className="h-6 w-6" />,
    color: "from-primary/20 to-blue-600/20 border-primary/30 text-primary",
  },
  {
    id: 3,
    title: "3. Decentralized Crowdfunding",
    description: "Affected users unite to pool funds into a smart contract-like escrow for the fix.",
    icon: <Wallet className="h-6 w-6" />,
    color: "from-green-500/20 to-emerald-600/20 border-green-500/30 text-green-500",
  },
  {
    id: 4,
    title: "4. Developer Matchmaking",
    description: "AI autonomously pings expert developers whose skills and rep match the bug's DNA.",
    icon: <UserCheck className="h-6 w-6" />,
    color: "from-purple-500/20 to-fuchsia-600/20 border-purple-500/30 text-purple-500",
  },
  {
    id: 5,
    title: "5. Fix & Automated Verification",
    description: "Developer submits PR. AI simulates the fix against expected behavior and calculates diff similarity.",
    icon: <GitMerge className="h-6 w-6" />,
    color: "from-amber-500/20 to-orange-600/20 border-amber-500/30 text-amber-500",
  },
  {
    id: 6,
    title: "6. Instant Reward Distribution",
    description: "Upon successful AI verification and optional admin pass, funds unlock directly to the dev.",
    icon: <DollarSign className="h-6 w-6" />,
    color: "from-blue-400/20 to-cyan-500/20 border-blue-400/30 text-blue-400",
  },
];

export default function WorkflowPage() {
  return (
    <div className="container mx-auto px-4 py-16 md:py-24 max-w-5xl">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
          The CrowdfundFix <span className="text-primary">Lifecycle</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Experience the autonomous flow from a broken system to a funded, verified, and rewarded fix.
        </p>
      </div>

      <div className="relative">
        {/* Connecting line */}
        <div className="absolute left-1/2 top-4 bottom-4 w-1 bg-border/50 -translate-x-1/2 hidden md:block" />

        <div className="space-y-12 md:space-y-24">
          {workflowSteps.map((step, index) => {
            const isEven = index % 2 === 0;
            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`flex flex-col md:flex-row items-center justify-between gap-8 ${
                  isEven ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* Content side */}
                <div className={`flex-1 md:w-1/2 flex ${isEven ? 'md:justify-end' : 'md:justify-start'}`}>
                  <div className={`max-w-md ${isEven ? 'md:text-right' : 'md:text-left'} text-center`}>
                    <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                    <p className="text-muted-foreground leading-relaxed text-lg">
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Center Icon */}
                <div className="relative z-10 flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-4 border-background bg-gradient-to-br shadow-xl mx-auto md:mx-0">
                  <div className={`absolute inset-0 rounded-full bg-gradient-to-br opacity-50 blur-md ${step.color.split(' ')[0]} ${step.color.split(' ')[1]}`} />
                  <div className={`relative flex h-16 w-16 items-center justify-center rounded-full bg-background border ${step.color} shadow-inner`}>
                    {step.icon}
                  </div>
                </div>

                {/* Empty side for layout */}
                <div className="flex-1 md:w-1/2 hidden md:block" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
