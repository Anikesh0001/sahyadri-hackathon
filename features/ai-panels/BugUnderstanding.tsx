"use client";

import { motion } from "framer-motion";
import { BrainCircuit, Fingerprint, TextSearch } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AIAnalysis } from "@/types";

export function BugUnderstanding({ analysis }: { analysis: AIAnalysis }) {
  return (
    <Card className="bg-card/50 backdrop-blur border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <BrainCircuit className="h-5 w-5 text-primary" />
          AI Bug Understanding
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h4 className="flex items-center gap-2 text-sm font-semibold text-muted-foreground mb-2">
            <TextSearch className="h-4 w-4" />
            NLP Summary
          </h4>
          <p className="text-sm leading-relaxed border-l-2 border-primary/50 pl-3">
            {analysis.nlpSummary}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <h4 className="flex items-center gap-2 text-sm font-semibold text-muted-foreground mb-2">
              <Fingerprint className="h-4 w-4" />
              Error Clusters
            </h4>
            <div className="flex flex-wrap gap-2">
              {analysis.errorClusters.map((cluster, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="px-2.5 py-1 rounded bg-red-500/10 text-red-500 text-xs font-mono border border-red-500/20"
                >
                  {cluster}
                </motion.span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-muted-foreground mb-2">
              Log Insights
            </h4>
            <ul className="space-y-1.5">
              {analysis.logInsights.map((insight, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="text-xs text-muted-foreground flex items-start gap-2"
                >
                  <span className="text-primary mt-0.5">•</span>
                  {insight}
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
