"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Bot, CheckCircle2, ChevronRight, Calculator, Layers, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bug, AIAnalysis } from "@/types";
import { api } from "@/services/api";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";

interface AIAnalysisPanelProps {
  bug: Bug;
}

export function AIAnalysisPanel({ bug }: AIAnalysisPanelProps) {
  const [stage, setStage] = useState(0);
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);

  useEffect(() => {
    async function runAnalysis() {
      // Stage 1: Ingesting logs & parsing text (1s)
      await new Promise(r => setTimeout(r, 1000));
      setStage(1);

      // Stage 2: Categorizing & Complexity scoring (1.5s)
      const data = await api.getAIAnalysis(bug.id);
      setAnalysis(data);
      setStage(2);

      // Stage 3: Estimating bounty & matching (1s)
      await new Promise(r => setTimeout(r, 1000));
      setStage(3);
    }
    
    runAnalysis();
  }, [bug.id]);

  return (
    <Card className="max-w-2xl mx-auto border-primary/20 bg-card/80 backdrop-blur-sm overflow-hidden shadow-2xl shadow-primary/5">
      <div className="bg-gradient-to-r from-primary/10 via-purple-500/10 to-blue-500/10 p-4 border-b border-border/50 flex flex-col items-center">
        <div className="bg-background rounded-full p-3 mb-3 relative">
          <Bot className="h-8 w-8 text-primary animate-pulse" />
          {stage < 3 && (
            <span className="absolute top-0 right-0 h-3 w-3 bg-green-500 rounded-full animate-ping" />
          )}
        </div>
        <CardTitle className="text-xl">AI Bug Intelligence Analysis</CardTitle>
        <p className="text-sm text-muted-foreground mt-1 text-center max-w-[400px]">
          Our engine is dissecting your bug report, estimating complexity, and calculating recommended bounty.
        </p>
      </div>
      <CardContent className="pt-6">
        <div className="space-y-6">
          <AnalysisStep 
            active={stage >= 0} 
            completed={stage >= 1} 
            icon={<Layers className="h-5 w-5" />}
            title="Ingesting Logs & Metadata"
            description="Extracting error traces and cross-referencing GitHub repository context."
          />
          <AnalysisStep 
            active={stage >= 1} 
            completed={stage >= 2} 
            icon={<Target className="h-5 w-5" />}
            title="Categorization & Complexity Scoring"
            description={stage >= 2 ? `Categorized as: ${analysis?.category}` : "Analyzing NLP structures to determine category..."}
          >
            {stage >= 2 && analysis && (
              <motion.div initial={{opacity: 0, height: 0}} animate={{opacity: 1, height: "auto"}} className="mt-3 p-3 bg-muted/50 rounded-lg text-sm border border-border">
                <div className="flex justify-between mb-2">
                  <span className="text-muted-foreground">Predicted Complexity</span>
                  <span className={`font-semibold ${
                    analysis.complexity === 'High' || analysis.complexity === 'Extreme' ? 'text-red-400' : 'text-amber-400'
                  }`}>{analysis.complexity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Confidence Score</span>
                  <span className="font-medium text-green-400">{analysis.confidenceScore}%</span>
                </div>
                <Progress value={analysis.confidenceScore} className="h-1.5 mt-2" />
              </motion.div>
            )}
          </AnalysisStep>
          <AnalysisStep 
            active={stage >= 2} 
            completed={stage >= 3} 
            icon={<Calculator className="h-5 w-5" />}
            title="Bounty Estimation & Market Fit"
            description={stage >= 3 ? "Bounty successfully calculated based on similar historical fixes." : "Calculating fair market bounty value..."}
          >
             {stage >= 3 && analysis && (
              <motion.div initial={{opacity: 0, height: 0}} animate={{opacity: 1, height: "auto"}} className="mt-3 flex items-center gap-4">
                <div className="flex-1 p-4 bg-background border border-primary/30 rounded-lg flex flex-col items-center justify-center">
                   <span className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Recommended Bounty</span>
                   <span className="text-3xl font-mono font-bold text-primary">${analysis.estimatedBounty}</span>
                </div>
              </motion.div>
             )}
          </AnalysisStep>
        </div>
      </CardContent>
      {stage >= 3 && (
        <CardFooter className="bg-muted/30 border-t border-border flex justify-between p-4 flex-col sm:flex-row gap-4">
          <p className="text-sm text-muted-foreground">Analysis complete. Your bug is now live in the marketplace.</p>
          <Link href={`/bugs/${bug.id}`}>
            <Button className="w-full sm:w-auto gap-2">
              View Bug Page <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        </CardFooter>
      )}
    </Card>
  );
}

interface AnalysisStepProps {
  active: boolean;
  completed: boolean;
  icon: React.ReactNode;
  title: string;
  description: string;
  children?: React.ReactNode;
}

function AnalysisStep({ active, completed, icon, title, description, children }: AnalysisStepProps) {
  return (
    <div className={`flex gap-4 transition-opacity duration-500 ${active ? "opacity-100" : "opacity-30"}`}>
      <div className="flex flex-col items-center">
        <div className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
          completed ? "bg-primary border-primary text-primary-foreground" : "bg-background border-muted-foreground/30 text-muted-foreground"
        }`}>
          {completed ? <CheckCircle2 className="h-5 w-5" /> : icon}
        </div>
        <div className="flex-1 w-px bg-border my-2" />
      </div>
      <div className="flex-1 pb-6">
        <h4 className={`text-base font-semibold ${active ? "text-foreground" : "text-muted-foreground"}`}>{title}</h4>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
        {children}
      </div>
    </div>
  );
}
