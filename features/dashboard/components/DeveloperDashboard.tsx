"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Star, Zap, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/services/api";
import { Bug } from "@/types";

export function DeveloperDashboard() {
  const [recommendedBugs, setRecommendedBugs] = useState<Bug[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const bugs = await api.getBugs();
      // Assume the AI recommended these for the developer
      setRecommendedBugs(bugs.filter(b => b.status === "Open" || b.status === "Funded").slice(0, 3));
      setLoading(false);
    }
    loadData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Reputation Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        {[
          { title: "Bugs Fixed", value: "42", icon: <CheckCircle2 className="h-4 w-4 text-green-500" /> },
          { title: "Success Rate", value: "96%", icon: <Star className="h-4 w-4 text-amber-500" /> },
          { title: "Bounties Earned", value: "$4,250", icon: <Zap className="h-4 w-4 text-primary" /> },
          { title: "Current Rank", value: "Elite", icon: <Code className="h-4 w-4 text-purple-500" /> },
        ].map((stat, i) => (
          <Card key={i} className="bg-card/50 backdrop-blur border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-foreground/90">AI Recommended Matches</h2>
          <span className="text-sm text-muted-foreground flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            Live AI Streaming
          </span>
        </div>

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-48 w-full rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recommendedBugs.map((bug) => (
              <Card key={bug.id} className="bg-card/50 backdrop-blur border-border/50 hover:border-primary/50 transition-colors flex flex-col relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3">
                   <div className="flex items-center gap-1 bg-green-500/10 text-green-500 rounded-full px-2 py-1 text-xs font-semibold">
                     <span>{bug.aiScore}% Match</span>
                   </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-base line-clamp-1 pr-16">{bug.title}</CardTitle>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {bug.tags.map(tag => (
                      <span key={tag} className="text-[10px] bg-muted px-2 py-0.5 rounded-full">{tag}</span>
                    ))}
                  </div>
                </CardHeader>
                <CardContent className="flex-1 text-sm text-muted-foreground">
                   <div className="flex justify-between items-center mb-2">
                     <span>Bounty</span>
                     <span className="font-bold text-foreground font-mono">${bug.bounty}</span>
                   </div>
                   <div className="w-full bg-muted rounded-full h-1.5 mb-1 relative overflow-hidden">
                     <div className="bg-primary h-1.5 rounded-full" style={{width: `${(bug.fundsRaised/(bug.bounty||1))*100}%`}}></div>
                   </div>
                   <div className="text-xs text-right">{Math.round((bug.fundsRaised/(bug.bounty||1))*100)}% Funded</div>
                </CardContent>
                <CardFooter className="pt-2">
                  <Link href={`/bugs/${bug.id}`} className="w-full">
                    <Button variant="default" className="w-full text-xs">Claim Bug</Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
